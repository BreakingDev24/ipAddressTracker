"use strict";

import "./style.css";
import viteLogo from "/vite.svg";

const ipAddress = document.querySelector(".ipAddress_text");
const location = document.querySelector(".location_text");
const timezoneText = document.querySelector(".timezone_text");
const ispText = document.querySelector(".isp_text");

const ipForm = document.querySelector(".ipForm");
const formInput = document.querySelector(".formInput");

let map;
let currentMarker;

const getInputType = (input) => {
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|::1|::)$/;
  const domainRegex =
    /^(?!:\/\/)(?=.{1,253}$)(([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,63})$/;

  if (ipv4Regex.test(input) || ipv6Regex.test(input)) return "ipAddress";
  if (domainRegex.test(input)) return "domain";
  return "invalid";
};

const getMap = (lat, lng) => {
  if (!map) {
    map = L.map("map", {
      zoomControl: false,
      dragging: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
    }).setView([lat, lng], 16);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  } else {
    map.setView([lat, lng], 13);
  }

  if (currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker([lat, lng]).addTo(map);
};

const getLocation = async (input = "") => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const type = getInputType(input);
  if (input !== "" && type === "invalid") return;

  const url =
    `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}` +
    (input && `&${type}=${input}`);
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

ipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputText = formInput.value;
  formInput.value = "";
  getLocation(inputText);
});

// getMap();
