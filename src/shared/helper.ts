import { getGeoJson } from "../api";
import { getCountryData, TCountryCode } from "countries-list";
import * as turf from "@turf/turf";
import { GeoJSONGeometry } from "ol/format/GeoJSON";
import { LocationType } from "./types";

export const getCountryName = (alpha2Country: TCountryCode): string => {
  return getCountryData(alpha2Country).name;
};

export const getUniqueCountries = (
  locations: LocationType[]
): TCountryCode[] => {
  const countrySet = new Set<TCountryCode>();

  locations.forEach((location) => {
    countrySet.add(location.country as TCountryCode);
  });

  return Array.from(countrySet);
};

export const filterLocations = (
  locations: LocationType[],
  geojsonPolygon: GeoJSONGeometry
): LocationType[] => {
  if (Object.keys(geojsonPolygon).length !== 0)
    return locations.filter((location) => {
      const coordinates = [location.longitude, location.latitude];
      const point = turf.point(coordinates);
      const isWithin = turf.booleanWithin(point, geojsonPolygon);
      return isWithin;
    });

  return locations;
};

export const getCountryGeoJson = async (
  alpha2Country: TCountryCode
): Promise<GeoJSONGeometry> => {
  const alpha3Country = getCountryData(alpha2Country).iso3;
  const geoJson = (await getGeoJson(alpha3Country)).data;

  return geoJson.features[0].geometry;
};
