"use strict";
//register button firing events
document.getElementById("seaBtn").addEventListener("click", seaBtnFire);
document.getElementById("britBtn").addEventListener("click", britBtnFire);
document.getElementById("myLocBtn").addEventListener("click", myLocBtnFire);

function seaBtnFire() {
    let qString = qStringBuilder(47.6762,-122.3182);
    console.log(qString);
    getWeather(qString);
}
function britBtnFire() {
    let qString = qStringBuilder(51.5074,0.1278);
    getWeather(qString);
}
function myLocBtnFire() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoLocSuccess);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    function geoLocSuccess(loc) {
        let qString = qStringBuilder(loc.coords.latitude,loc.coords.longitude);
        getWeather(qString);
    }

}

function qStringBuilder(lat, lon) {
    const key = "2ae13408d002af239c3d50f035701549"; //this would be on the backend if a real/production program
    const uri = "api.openweathermap.org/data/2.5/";
    //const corsPrepend = "https://cors-anywhere.herokuapp.com/";
    const corsPrepend = "https://uwpce-weather-proxy.herokuapp.com/data/2.5/weather/";
    return `${corsPrepend}http://${uri}weather?lat=${lat}&lon=${lon}&APPID=${key}`;
}
function iconStingBuilder(iconCode) {
    return "http://openweathermap.org/img/w/" + iconCode + ".png";
}
function getWeather(qString) {
    let request = new XMLHttpRequest();
    request.open("GET",qString);
    request.onload = requestUpdate;
    request.onerror = requestError;
    request.send();
}

function requestUpdate(request) {
    let resp = JSON.parse(request.currentTarget.response);
    console.log(resp);
    if(resp.cod == 200) {
        updateDOM(resp);
    }
    else {
        errorUpdateDOM(resp);
    }
}

function requestError(request) {
    console.log("error");
    errorUpdateDOM(request.currentTarget.response);
}
function errorUpdateDOM(data) {
    let weatherDiv = document.getElementById("weatherReport");
    //clear children
    while (weatherDiv.hasChildNodes()) {
        weatherDiv.removeChild(weatherDiv.lastChild);
    }
    let h1 = document.createElement("h1");
    h1.appendChild(document.createTextNode(data.cod));
    weatherDiv.appendChild(h1);
    let sm = document.createElement("small");
    sm.appendChild(document.createTextNode(`${data.message}`));
    weatherDiv.appendChild(sm);
}
function updateDOM(data) {
    let weatherDiv = document.getElementById("weatherReport");
    //clear children
    while (weatherDiv.hasChildNodes()) {
        weatherDiv.removeChild(weatherDiv.lastChild);
    }
    //Set City Name
    appendElement(weatherDiv, "h1", data.name);
    // Set Lat & Lon
    appendElement(weatherDiv, "sm", `${data.coord.lat},${data.coord.lon}`);
    // Set Description
    appendElement(weatherDiv, "p",`${data.weather[0].description}`);
    let dIcon = appendElement(weatherDiv, "img","");
    dIcon.src = iconStingBuilder(data.weather[0].icon);

    // Set Temperature
    appendElement(weatherDiv, "p",`Current Temp: ${(data.main.temp-273.15).toFixed(1)} °C`);

}

function appendElement(parent, type, text) {
    let child = document.createElement(type);
    child.appendChild(document.createTextNode(text));
    parent.appendChild(child);
    return child;
}