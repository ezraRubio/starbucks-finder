import axios from "axios";

export const getStores = async () => {
  return await axios.get(
    "https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json"
  );
};

export const getGeoJson = async (country: string) => {
  return await axios.get(
    `http://localhost:3003/api/geojson?country=${country}`
  );
};
