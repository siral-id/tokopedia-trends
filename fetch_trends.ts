import { Octokit } from "https://cdn.skypack.dev/octokit?dts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { ITokopediaPopularKeywordResponse } from "./interfaces.ts";
import { popularKeywordQuery } from "./gql.ts";
import { sleep, tokopediaHeader, ITrend, Source } from "https://raw.githubusercontent.com/siral-id/deno-utility/main/mod.ts";

const noOfPages = 10;
const offsets = Array.from(Array(noOfPages).keys());
const sleepDuration = 0.1;

const ghToken = Deno.env.get("GH_TOKEN");
if (!ghToken) throw new Error("GH_TOKEN not found");

const octokit = new Octokit({ auth: ghToken });

const totalTrends: ITrend[] = [];

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
  keywords.map(
    ({ keyword, image_url, product_count }) => {
      const timestamp = new Date().toISOString();

      const record = {
        keyword,
        count: product_count,
        image: image_url,
        source: Source.TOKOPEDIA,
        timestamp,
      };

      totalTrends.push(record);
      return record;
    },
  );

  // prevent hammering the api source
  await sleep(sleepDuration);
}));

const uuid = v4.generate();

await octokit.rest.issues.create({
  owner: "siral-id",
  repo: "core",
  title: `WRITE_TRENDS_TOKOPEDIA_${uuid}`,
  body: JSON.stringify(totalTrends),
});
