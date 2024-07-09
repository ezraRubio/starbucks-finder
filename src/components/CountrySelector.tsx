import { useCallback, useMemo, useState } from "react";
import { getCountryName } from "../shared/helper";
import { TCountryCode } from "countries-list";

interface CountrySelectorProps {
  countries: TCountryCode[];
  onSelectCountry: (country: TCountryCode) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  onSelectCountry,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const country = event.target.value;
      setSelectedCountry(country);
      onSelectCountry(country as TCountryCode);
    },
    [onSelectCountry]
  );

  const countryOptions = useMemo(
    () =>
      countries.map((country, i) => (
        <option key={i} value={country}>
          {getCountryName(country as TCountryCode)}
        </option>
      )),
    [countries]
  );

  return (
    <div>
      <label htmlFor="country-selector" style={{ fontWeight: "bold" }}>
        Select a Country:
      </label>
      <select
        id="country-selector"
        value={selectedCountry}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a country
        </option>
        {countryOptions}
      </select>
    </div>
  );
};
