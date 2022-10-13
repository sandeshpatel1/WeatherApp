const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentweatherinfo = document.getElementById("current-weather-info");
const timexone = document.getElementById("time-xone");
const country = document.getElementById("country");
const weatherforecast = document.getElementById("weather-forecast");
const currenttemp = document.getElementById("current-temp");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = '3477b8f408865262f1218cef22c71427';

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrsFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrsFormat < 10 ? '0'+hoursIn12HrsFormat : hoursIn12HrsFormat) +
    ":" +
    (minutes < 10 ? '0'+minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;
  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let {latitude, longitude } = success.coords;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

  timexone.innerHTML = data.timezone;
  country.innerHTML = data.lat + 'N' + data.lon + "E";

  currentweatherinfo.innerHTML = `<div class="weather-item">
    <div>Humadity</div>
    <div>${humidity}</div>
    </div>
   
    <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
    </div>

    <div class="weather-item"> 
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
    </div>

    <div class="weather-item"> 
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>

    <div class="weather-item"> 
    <div>Sunset</div>
    <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`;

    let otherDayForecast = '';
      data.daily.forEach((day, idx)=>{
        if(idx == 0){
            currenttemp.innerHTML = `
          <img
          src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
          alt="weather icon"
          class="w-icon"/>
          <div class="others">
          <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
          <div class="temp">Night - ${day.temp.night}&#176; C</div>
          <div class="temp">Day - ${day.temp.day}&#176; C</div>
          </div>
            `
         }
        else{
        otherDayForecast += `
        <div class="weather-forecast-item">
        <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
        <img
          src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
          alt="weather icon"
          class="w-icon"/>
        <div class="temp">Night - ${day.temp.night}&#176; C</div>
        <div class="temp">Day - ${day.temp.day}&#176; C</div>
      </div>
        `      
      }
    });

    weatherforecast.innerHTML = otherDayForecast;
}
