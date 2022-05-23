export interface ITokopediaPopularKeywordDataPopularKeywordKeyword {
  url: string;
  image_url: string;
  keyword: string;
  product_count: number;
  product_count_formatted: string;
}

export interface ITokopediaPopularKeywordDataPopularKeyword {
  recommendation_type: string;
  title: string;
  sub_title: number;
  keywords: ITokopediaPopularKeywordDataPopularKeywordKeyword[];
}

export interface ITokopediaPopularKeywordData {
  popular_keywords: ITokopediaPopularKeywordDataPopularKeyword;
}

export interface ITokopediaPopularKeywordResponse {
  data: ITokopediaPopularKeywordData;
}

export interface ITrend {
  keyword: string;
  image: string;
  count: number;
  source: string;
  timestamp: string;
}
