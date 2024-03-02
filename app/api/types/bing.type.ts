interface BingSearchResponse {
  _type: string;
  queryContext: {
    originalQuery: string;
  };
  computation: {
    expression: string;
    value: number;
  };
  images: BingImageAnswer;
  places: {
    value: BingPlace[];
  };
  webPages: {
    value: BingWebPage[];
  };
}

interface BingWebPage {
  id: string;
  name: string;
  url: string;
  displayUrl: string;
  snippet: string;
  dateLastCrawled: string;
}

interface BingImageAnswer {
  _type: string;
  queryContext: {
    originalQuery: string;
  };
  value: BingImage[];
}

interface BingVideoAnswer {
  _type: string;
  queryContext: {
    originalQuery: string;
  };
  value: BingVideo[];
}

interface BingVideo {
  name: string;
  thumbnailUrl: string;
  contentUrl: string;
  hostPageUrl: string;
  encodingFormat: string;
  width: number;
  height: number;
  hostPageDisplayUrl: string;
  duration: string;
  viewCount: number;
  publishedDate: string;
  creator: {
    name: string;
  };
}

interface BingImage {
  name: string;
  thumbnailUrl: string;
  hostPageUrl: string;
  contentUrl: string;
  encodingFormat: string;
  width: number;
  height: number;
  hostPageDisplayUrl: string;
}

interface BingPlace {
  _type: string;
  queryContext: {
    originalQuery: string;
  };
  address: {
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    country: string;
  };
  name: string;
  telephone: string;
  url: string;
  webSearchUrl: string;
}

export type {
  BingSearchResponse,
  BingWebPage,
  BingImage,
  BingPlace,
  BingVideo,
};
