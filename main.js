import './style.css';
import {Map, View, Overlay} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  overlays: [overlay],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

//состояние погоды в зависимости от кода
const weather_code = {
  0:'Ясное небо',
  1: 'В основном ясно',
  2: 'Частичная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Инейный туман',
  51: 'Легкая морось',
  53: 'Умеренная морось',
  55: 'Интенсивная морось',
  56: 'Легкая ледяная морось',
  57: 'Интенсивная ледяная морось',
  61: 'Слабый дождь',
  63: 'Умеренный дождь',
  65: 'Сильный дождь',
  66: 'Легкий ледяной дождь',
  67: 'Сильный ледяной дождь',
  71: 'Небольшой снег',
  73: 'Умеренный снег',
  75: 'Большой снег',
  77: 'Град',
  80: 'Слабый ливень',
  81: 'Умеренный ливень',
  82: 'Сильный ливень',
  85: 'Легкий снегопад',
  86: 'Сильный снегопад',
  95: 'Слабая гроза',
  96: 'Умеренная гроза',
  99: 'Гроза с легким и сильным градом',
}

map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  const geoCoordinates = transform(coordinate, 'EPSG:3857', 'EPSG:4326');

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoCoordinates[1]}&longitude=${geoCoordinates[0]}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=auto`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    content.innerHTML = '<p> Температура: ' + data.current.temperature_2m + data.current_units.temperature_2m + '</p>' + '<p> Чувствуется как: ' + data.current.apparent_temperature + data.current_units.apparent_temperature + '</p>' + '<p> Относительная влажность: ' + data.current.relative_humidity_2m + data.current_units.relative_humidity_2m + '</p>' + '<p> Осадки: ' + weather_code[data.current.weather_code] + '</p>' 
    
    overlay.setPosition(coordinate);
  })
  .catch(error => console.error('Error:', error));

});