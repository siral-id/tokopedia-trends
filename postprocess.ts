import { readJSON, writeJSON } from "https://deno.land/x/flat/mod.ts";

interface ITokopediaPopularKeywordDataPopularKeywordKeyword {
  url: string;
  image_url: string;
  keyword: string;
  product_count: number;
  product_count_formatted: string;
}

interface ITokopediaPopularKeywordDataPopularKeyword {
  recommendation_type: string;
  title: string;
  sub_title: number;
  keywords: ITokopediaPopularKeywordDataPopularKeywordKeyword[];
}

interface ITokopediaPopularKeywordData {
  popular_keywords: ITokopediaPopularKeywordDataPopularKeyword;
}

interface ITokopediaPopularKeywordResponse {
  data: ITokopediaPopularKeywordData;
}

interface trend {
  keyword: string;
  image: string;
  count: number;
  source: string;
}

const filename = Deno.args[0]; // Same name as downloaded_filename
const response: ITokopediaPopularKeywordResponse = await readJSON(filename);

const keywords = response["data"]["popular_keywords"]["keywords"];

const trends: trend[] = keywords.map(
  ({ keyword, image_url, product_count }) => {
    return {
      keyword,
      count: product_count,
      image: image_url,
      source: "TOKOPEDIA",
    };
  },
);

const newfile = `tokopedia_trends.json`;
await writeJSON(newfile, trends);
