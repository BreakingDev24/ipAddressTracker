import "./style.css";
import viteLogo from "/vite.svg";

const getMap = () => {
  const map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const marker = L.marker([51.5, -0.09]).addTo(map);
};

const getLocation = async () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;
  try {
    const resGeo = await fetch(url);
    if (!resGeo.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const res = await geo.json();
    const {
      ip,
      isp,
      location: { city, country, lat, lng },
    } = res;
    console.log(res);
    return { ip, isp, city, country, lat, lng };
  } catch (error) {
    console.error(`Error while retrieving the IP`, error.message);
  }
};

console.log(import.meta.env.VITE_API_KEY);

getLocation();

getMap();
