import axios from "axios";
import google from "googlethis";
import { BingSearchResponse } from "../types/bing.type";

interface BrowseProps {
  query: string;
  elements?: number;

  type?:
    | "results"
    | "videos"
    | "dictionary"
    | "translation"
    | "knowledge_panel";
}

const bingApiEndpoint = process.env.BING_SEARCH_ENDPOINT || "";
const bingApiKey = process.env.BING_API_KEY;

const browseWithBing = async ({
  query,
  elements,
  type = "results",
}: BrowseProps) => {
  const response = await axios
    .get(bingApiEndpoint, {
      params: {
        q: query,
        count: elements,
        mkt: "en-US",
        responseFilter: "Webpages",
      },
      headers: {
        "Ocp-Apim-Subscription-Key": bingApiKey,
      },
    })
    .catch((e) => {
      console.error("Error while fetching Bing API: ", e);
      return e;
    });

  const data = response.data as BingSearchResponse;

  console.log("Response fecthed from Bing 🔎: ", data);

  return data;
};

const browse = async ({ query, elements, type = "results" }: BrowseProps) => {
  const options = {
    page: 0,
    safe: false,
    additional_params: {
      //   hl: "en",
    },

    // Additional params: https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
  };

  const response = await google.search(query, options);

  const reduced = response;

  console.log("Response fecthed from Google 🔎: ", reduced);

  //   console.log("Top 3 results: ", reduced.results.slice(0, 3));

  return reduced;
};

interface BrowseImage extends Omit<BrowseProps, "type"> {}

const browseImages = async ({ query, elements }: BrowseImage) => {
  const options = {
    page: 0,
    safe: true,
    parse_ads: false,
    additional_params: {
      hl: "en",
    },
  };

  const response = (await google.image(query, options)).slice(0, elements);

  return response;
};

export { browse, browseWithBing, browseImages };
