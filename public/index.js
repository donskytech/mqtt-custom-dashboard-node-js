// Import MQTT service
import { MQTTService } from "./mqttService.js";

// Target specific HTML items
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);

/*
  Event listeners for any HTML click
*/
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");

  // Update Chart background
  chartBGColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-background"
  );
  chartFontColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-font-color"
  );
  chartAxisColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-axis-color"
  );
  updateChartsBackground();
});

/*
  Plotly.js graph and chart setup code
*/
var temperatureHistoryDiv = document.getElementById("temperature-history");
var humidityHistoryDiv = document.getElementById("humidity-history");
var pressureHistoryDiv = document.getElementById("pressure-history");
var altitudeHistoryDiv = document.getElementById("altitude-history");

var temperatureGaugeDiv = document.getElementById("temperature-gauge");
var humidityGaugeDiv = document.getElementById("humidity-gauge");
var pressureGaugeDiv = document.getElementById("pressure-gauge");
var altitudeGaugeDiv = document.getElementById("altitude-gauge");

const historyCharts = [
  temperatureHistoryDiv,
  humidityHistoryDiv,
  pressureHistoryDiv,
  altitudeHistoryDiv,
];

const gaugeCharts = [
  temperatureGaugeDiv,
  humidityGaugeDiv,
  pressureGaugeDiv,
  altitudeGaugeDiv,
];

// History Data
var temperatureTrace = {
  x: [],
  y: [],
  name: "Temperature",
  mode: "lines+markers",
  type: "line",
};
var humidityTrace = {
  x: [],
  y: [],
  name: "Humidity",
  mode: "lines+markers",
  type: "line",
};
var pressureTrace = {
  x: [],
  y: [],
  name: "Pressure",
  mode: "lines+markers",
  type: "line",
};
var altitudeTrace = {
  x: [],
  y: [],
  name: "Altitude",
  mode: "lines+markers",
  type: "line",
};

var temperatureLayout = {
  autosize: true,
  title: {
    text: "Temperature",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var humidityLayout = {
  autosize: true,
  title: {
    text: "Humidity",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var pressureLayout = {
  autosize: true,
  title: {
    text: "Pressure",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var altitudeLayout = {
  autosize: true,
  title: {
    text: "Altitude",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };

// Event listener when page is loaded
window.addEventListener("load", (event) => {
  Plotly.newPlot(
    temperatureHistoryDiv,
    [temperatureTrace],
    temperatureLayout,
    config
  );
  Plotly.newPlot(humidityHistoryDiv, [humidityTrace], humidityLayout, config);
  Plotly.newPlot(pressureHistoryDiv, [pressureTrace], pressureLayout, config);
  Plotly.newPlot(altitudeHistoryDiv, [altitudeTrace], altitudeLayout, config);

  // Get MQTT Connection
  fetchMQTTConnection();

  // Run it initially
  handleDeviceChange(mediaQuery);
});

// Gauge Data
var temperatureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Temperature" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 50] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var humidityData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Humidity" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var pressureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Pressure" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 750 },
    gauge: {
      axis: { range: [null, 1100] },
      steps: [
        { range: [0, 300], color: "lightgray" },
        { range: [300, 700], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var altitudeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Altitude" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 60 },
    gauge: {
      axis: { range: [null, 150] },
      steps: [
        { range: [0, 50], color: "lightgray" },
        { range: [50, 100], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

Plotly.newPlot(temperatureGaugeDiv, temperatureData, layout);
Plotly.newPlot(humidityGaugeDiv, humidityData, layout);
Plotly.newPlot(pressureGaugeDiv, pressureData, layout);
Plotly.newPlot(altitudeGaugeDiv, altitudeData, layout);

// Will hold the arrays we receive from our BME280 sensor
// Temperature
let newTempXArray = [];
let newTempYArray = [];
// Humidity
let newHumidityXArray = [];
let newHumidityYArray = [];
// Pressure
let newPressureXArray = [];
let newPressureYArray = [];
// Altitude
let newAltitudeXArray = [];
let newAltitudeYArray = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
let ctr = 0;

// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

  let temperature = Number(jsonResponse.temperature).toFixed(2);
  let humidity = Number(jsonResponse.humidity).toFixed(2);
  let pressure = Number(jsonResponse.pressure).toFixed(2);
  let altitude = Number(jsonResponse.altitude).toFixed(2);

  updateBoxes(temperature, humidity, pressure, altitude);

  updateGauge(temperature, humidity, pressure, altitude);

  // Update Temperature Line Chart
  updateCharts(
    temperatureHistoryDiv,
    newTempXArray,
    newTempYArray,
    temperature
  );
  // Update Humidity Line Chart
  updateCharts(
    humidityHistoryDiv,
    newHumidityXArray,
    newHumidityYArray,
    humidity
  );
  // Update Pressure Line Chart
  updateCharts(
    pressureHistoryDiv,
    newPressureXArray,
    newPressureYArray,
    pressure
  );

  // Update Altitude Line Chart
  updateCharts(
    altitudeHistoryDiv,
    newAltitudeXArray,
    newAltitudeYArray,
    altitude
  );
}

function updateBoxes(temperature, humidity, pressure, altitude) {
  let temperatureDiv = document.getElementById("temperature");
  let humidityDiv = document.getElementById("humidity");
  let pressureDiv = document.getElementById("pressure");
  let altitudeDiv = document.getElementById("altitude");

  temperatureDiv.innerHTML = temperature + " C";
  humidityDiv.innerHTML = humidity + " %";
  pressureDiv.innerHTML = pressure + " hPa";
  altitudeDiv.innerHTML = altitude + " m";
}

function updateGauge(temperature, humidity, pressure, altitude) {
  var temperature_update = {
    value: temperature,
  };
  var humidity_update = {
    value: humidity,
  };
  var pressure_update = {
    value: pressure,
  };
  var altitude_update = {
    value: altitude,
  };
  Plotly.update(temperatureGaugeDiv, temperature_update);
  Plotly.update(humidityGaugeDiv, humidity_update);
  Plotly.update(pressureGaugeDiv, pressure_update);
  Plotly.update(altitudeGaugeDiv, altitude_update);
}

function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function updateChartsBackground() {
  // updates the background color of historical charts
  var updateHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));

  // updates the background color of gauge charts
  var gaugeHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
}

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 550,
      height: 260,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}

/*
  MQTT Message Handling Code
*/
const mqttStatus = document.querySelector(".status");

function onConnect(message) {
  mqttStatus.textContent = "Connected";
}
function onMessage(topic, message) {
  var stringResponse = message.toString();
  var messageResponse = JSON.parse(stringResponse);
  updateSensorReadings(messageResponse);
}

function onError(error) {
  console.log(`Error encountered :: ${error}`);
  mqttStatus.textContent = "Error";
}

function onClose() {
  console.log(`MQTT connection closed!`);
  mqttStatus.textContent = "Closed";
}

function fetchMQTTConnection() {
  fetch("/mqttConnDetails", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      initializeMQTTConnection(data.mqttServer, data.mqttTopic);
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}
function initializeMQTTConnection(mqttServer, mqttTopic) {
  console.log(
    `Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`
  );
  var fnCallbacks = { onConnect, onMessage, onError, onClose };

  var mqttService = new MQTTService(mqttServer, fnCallbacks);
  mqttService.connect();

  mqttService.subscribe(mqttTopic);
}
