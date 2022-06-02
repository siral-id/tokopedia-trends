import { ITokopediaPopularKeywordResponse } from "./interfaces.ts";
import { popularKeywordQuery } from "./gql.ts";
import { sleep } from "https://raw.githubusercontent.com/siral-id/deno-utility/main/utility.ts";
import { getMongoClient } from "https://raw.githubusercontent.com/siral-id/deno-utility/main/database.ts";
import { tokopediaHeader } from "https://raw.githubusercontent.com/siral-id/deno-utility/main/header.ts";
import {
  ITrend,
  ITrendSchema,
} from "https://raw.githubusercontent.com/siral-id/deno-utility/main/interfaces.ts";

const noOfPages = 10;
const offsets = Array.from(Array(noOfPages).keys());
const sleepDuration = 0.1;

const mongoUri = Deno.env.get("MONGO_URI");
if (!mongoUri) throw new Error("MONGO_URI not found");

const client = await getMongoClient(mongoUri);
const collection = client.database().collection<ITrendSchema>("trends");

await Promise.all(offsets.map(async (offset) => {
  const graphql = JSON.stringify({
    query: popularKeywordQuery,
    variables: {
      "page": offset,
    },
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: tokopediaHeader,
    body: graphql,
    redirect: "follow",
  };

  const url = "https://gql.tokopedia.com";
  const response = await fetch(url, requestOptions);
  const data: ITokopediaPopularKeywordResponse = await response.json();

  const keywords = data["data"]["popular_keywords"]["keywords"];
  const trends: ITrend[] = keywords.map(
    ({ keyword, image_url, product_count }) => {
      const timestamp = new Date().toISOString();

      return {
        keyword,
        count: product_count,
        image: image_url,
        source: "TOKOPEDIA",
        timestamp,
      };
    },
  );

  await collection.insertMany(trends);
  // prevent hammering the api source
  await sleep(sleepDuration);
}));
