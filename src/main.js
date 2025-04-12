"use strict";

import "./style.css";
import viteLogo from "/vite.svg";
import iconLocation from "./images/icon-location.svg";

// Select DOM elements where data will be displayed
const ipAddress = document.querySelector(".ipAddress_text");
const location = document.querySelector(".location_text");
const timezoneText = document.querySelector(".timezone_text");
const ispText = document.querySelector(".isp_text");

// Select the form and input elements
const ipForm = document.querySelector(".ipForm");
const formInput = document.querySelector(".formInput");

// Define a custom map marker icon (make sure 'iconLocation' is defined elsewhere)
const costumeMarker = L.icon({
  iconUrl: iconLocation,
});

let map; // Leaflet map instance
let currentMarker; // Marker currently shown on the map

// Determine the type of input: IP address (IPv4 or IPv6), domain, or invalid
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

// Initialize or update the map with given latitude and longitude
const getMap = (lat, lng) => {
  if (!map) {
    // Create new map instance if it doesn't exist
    map = L.map("map", {
      zoomControl: false,
      dragging: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
    }).setView([lat, lng], 16);

    // Add tile layer from OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  } else {
    // Update map view if map already exists
    map.setView([lat, lng], 13);
  }

  // Remove existing marker if present, then add a new one
  if (currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker([lat, lng], { icon: costumeMarker }).addTo(map);
};

// Fetch geolocation data from the API based on user input (IP address or domain)
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

    // Destructure necessary data from the response
    const {
      ip,
      isp,
      location: { city, country, timezone, lat, lng },
    } = res;

    return { ip, isp, city, country, timezone, lat, lng };
  } catch (error) {
    console.error(`Error while retrieving the IP`, error.message);
  }
};

// Update the displayed data on the page
const showData = (ip, isp, timezone, city, country) => {
  ipAddress.textContent = ip;
  location.textContent = `${city}, ${country}`;
  timezoneText.textContent = `UTC ${timezone}`;
  ispText.textContent = isp;
};

// Display data and update the map with a marker
const renderLocationData = (data) => {
  const { ip, isp, city, country, timezone, lat, lng } = data;
  showData(ip, isp, timezone, city, country);
  getMap(lat, lng);
};

// Render initial location data (based on user's current IP)
const renderInitialLocation = async () => {
  const data = await getLocation();
  if (data) renderLocationData(data);
};

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  const inputText = formInput.value.trim();
  formInput.value = "";

  const data = await getLocation(inputText);
  if (data) renderLocationData(data);
};

// Initial fetch and render when the page loads
renderInitialLocation();

// Add event listener to the form
ipForm.addEventListener("submit", handleSubmit);
