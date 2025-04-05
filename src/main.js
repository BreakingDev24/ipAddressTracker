import "./style.css";
import viteLogo from "/vite.svg";

const ipAddress = document.querySelector(".ipAddress_text");
const location = document.querySelector(".location_text");
const timezoneText = document.querySelector(".timezone_text");
const ispText = document.querySelector(".isp_text");

const getMap = (lat, lng) => {
  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const marker = L.marker([lat, lng]).addTo(map);
};

const getLocation = async () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;
  try {
    const resGeo = await fetch(url);
    if (!resGeo.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const res = await resGeo.json();
    const {
      ip,
      isp,
      location: { city, country, timezone, lat, lng },
    } = res;
    console.log(res);
    showData(ip, isp, timezone, city, country);
    getMap(lat, lng);
    // return { ip, isp, city, country, lat, lng };
  } catch (error) {
    console.error(`Error while retrieving the IP`, error.message);
  }
};

const showData = (ip, isp, timezone, city, country) => {
  ipAddress.textContent = ip;
  location.textContent = `${city}, ${country}`;
  timezoneText.textContent = timezone;
  ispText.textContent = isp;
};

// console.log(import.meta.env.VITE_API_KEY);

getLocation();

// getMap();
