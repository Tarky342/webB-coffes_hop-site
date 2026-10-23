import { useState } from "react";
import { getFlagUrl } from "../lib/origins.js";

export function CountryFlag({ countryId, countryName }) {
  const [isAvailable, setIsAvailable] = useState(true);

  if (!countryId || !isAvailable) return null;

  return (
    <img
      className="country-flag"
      src={getFlagUrl(countryId)}
      alt={`${countryName}の国旗`}
      width={32}
      height={24}
      loading="lazy"
      onError={() => setIsAvailable(false)}
    />
  );
}
