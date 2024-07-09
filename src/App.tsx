import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { getStores } from "./api";
import { MyMap } from "./components/MyMap";
import { CountrySelector } from "./components/CountrySelector";
import {
  filterLocations,
  getCountryGeoJson,
  getUniqueCountries,
} from "./shared/helper";
import { LocationType } from "./shared/types";
import { TCountryCode } from "countries-list";
import { GeoJSONGeometry } from "ol/format/GeoJSON";

function App() {
  const [stores, setStores] = useState<LocationType[]>([]);
  const [countries, setCountries] = useState<TCountryCode[]>([]);
  const [geojson, setGeojson] = useState<GeoJSONGeometry>(
    {} as GeoJSONGeometry
  );

  useEffect(() => {
    getStores()
      .then((res) => {
        setCountries(getUniqueCountries(res.data));
        setStores(filterLocations(res.data, geojson));
      })
      .catch((e) => console.log(e));
  }, [geojson]);

  const onSelectCountry = useCallback((country: TCountryCode) => {
    getCountryGeoJson(country)
      .then((res) => setGeojson(res))
      .catch((e) => console.log("error fetching geojson", e.stack));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>World Starbucks location finder</h1>
      <div style={{ display: "flex" }}>
        <div style={{ padding: 20 }}>
          <CountrySelector
            countries={countries}
            onSelectCountry={onSelectCountry}
          />
        </div>
        <MyMap locations={stores} selectedCountryPolygon={geojson} />
      </div>
    </div>
  );
}

export default App;
