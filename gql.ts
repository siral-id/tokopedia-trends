export const popularKeywordQuery =
  "query PopularKeyword($page: Int) {\n    popular_keywords(page: $page) {\n        recommendation_type\n        title\n        sub_title\n        keywords {\n            url\n            image_url\n            keyword\n            product_count\n            product_count_formatted\n            __typename\n        }\n        __typename\n    }\n}\n";
