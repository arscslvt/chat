import axios from "axios";

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
}

const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

type WeatherByNameResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

const getWeatherByName = async (
  city: string
): Promise<WeatherByNameResponse> => {
  const { data, status } = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    }
  );

  if (status !== 200) {
    throw new Error("Unable to fetch weather.");
  }

  return data as WeatherByNameResponse;
};

const geWeather = async (lon: string, lat: string) => {
  const { data, status } = await axios.get(WEATHER_BASE_URL, {
    params: {
      lon,
      lat,
      appid: process.env.OPENAWEATHER_API_KEY,
      units: "metric",
    },
  });

  if (status !== 200) {
    throw new Error("Unable to fetch weather.");
  }

  return data;
};

export { getWeatherByName, geWeather };
