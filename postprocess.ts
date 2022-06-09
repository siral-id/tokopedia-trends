import { Octokit } from "https://cdn.skypack.dev/octokit@v1.7.2?dts";
import { v4 } from "https://deno.land/std@0.142.0/uuid/mod.ts";
import {
  ITokopediaPopularKeywordResponse,
  popularKeywordQuery,
} from "./mod.ts";
import {
  ICreateTrend,
  sleep,
  Source,
  tokopediaHeader,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

export function setupOctokit(ghToken?: string): Octokit {
  if (!ghToken) throw new Error("GH_TOKEN not found");
  return new Octokit({ auth: ghToken });
}

export async function pull(
  noOfPages = 10,
  sleepDuration = 0.1,
): Promise<ICreateTrend[]> {
  const offsets = Array.from(Array(noOfPages).keys());

  const trends = await Promise.all(offsets.map(async (offset) => {
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

    // prevent hammering the api source
    await sleep(sleepDuration);

    const keywords = data["data"]["popular_keywords"]["keywords"];
    return keywords.map(
      ({ keyword, image_url, product_count }) => {
        const timestamp = new Date().toISOString();

        return {
          keyword,
          count: product_count,
          image: image_url,
          source: Source.TOKOPEDIA,
          timestamp,
        };
      },
    );
  }));
  return trends.flat(1);
}

export async function upload(octokit: Octokit, data: ICreateTrend[]) {
  const uuid = v4.generate();

  await octokit.rest.issues.create({
    owner: "siral-id",
    repo: "core",
    title: `WRITE_TRENDS_TOKOPEDIA_${uuid}`,
    body: JSON.stringify(data),
  });
}
