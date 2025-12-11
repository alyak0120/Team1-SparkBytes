export async function getCoordinates(address: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "FreeFoodBU/1.0" // Required by Nominatim policies
    }
  });

  const data = await res.json();

  if (!data || data.length === 0) {
    console.warn("Address not found:", address);
    return null;
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
