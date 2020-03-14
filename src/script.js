import enterView from 'enter-view';
import textBalancer from 'text-balancer';

import { USE_COVER_HED } from '../config.json';

/* Fade in navbar at scroll trigger */

const navbar = document.getElementById('navbar');
enterView({
  selector: USE_COVER_HED ? '.headline' : '.step-deck',
  offset: USE_COVER_HED ? 1 : 0.957,
  enter: () => {
    navbar.classList.remove('only-logo');
  },
  exit: () => {    
    navbar.classList.remove('show-nav-links');
    navbar.classList.add('only-logo');
  },
});

/* Mobile navbar hamburger trigger */

export function hamburgerTrigger() {
  navbar.classList.toggle('show-nav-links');
}

/* Text balance headline and deck */

textBalancer.balanceText('.headline, .deck, .image-overlay .image-caption-text, .annote-text');

/* Highlight nav link */

const pageNum = parseInt(document.getElementById('body-page-container').getAttribute('data-page-num'));
document.getElementById('nav-link-' + pageNum).classList.add('nav-link-highlighted');


/* ===== MAPBOX ====== */

import mapboxgl from 'mapbox-gl';
import dotenv from 'dotenv';
dotenv.config();
mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

if (pageNum === 1) {
  makeMap('floridita-map', 'Floridita');
  makeMap('dino-map', 'Dino');
}

function makeMap(mapId, restaurantName) {
  const mapDiv = document.getElementById(mapId);
  mapDiv.style.display = 'block'; // Override dummy style: display none
  mapDiv.removeChild(mapDiv.firstElementChild); // Remove the dummy <p>

  // const [ x0, y0 ] = mapDiv.getAttribute('data-old-location').split(', ').map(parseFloat);
  // const [ xf, yf ] = mapDiv.getAttribute('data-new-location').split(', ').map(parseFloat);
  let x0, y0, xf, yf;
  if (mapId === 'floridita-map') {
    x0 = -73.958252;
    y0 = 40.816126;
    xf = -73.960993;
    yf = 40.817990;

  } else if (mapId === 'dino-map') {
    x0 = -73.959246;
    y0 = 40.818427;
    xf = -73.960844;
    yf = 40.818008;
  } else {
    return;
  }

  const center = [ (x0+xf)/2, (y0+yf)/2 ];
  if (window.innerWidth < 460 && mapId === 'floridita-map')
    center[1] -= 0.0001; // super hacky last minute minor style change

  const map = new mapboxgl.Map({
    container: mapId,
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 16,
    center,
    scrollZoom: false,
    boxZoom: false,
    touchZoomRotate: false,
  });
  map.addControl(new mapboxgl.NavigationControl());

  //adding a dot
  var size = 100;

  // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
  // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
  var pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
   
  // get rendering context for the map canvas when layer is added to the map
    onAdd: function() {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },
   
  // called once before every frame where the icon will be used
    render: function() {
      let duration = 1000;
      let t = (performance.now() % duration) / duration;
   
      let radius = (size / 2) * 0.3;
      let outerRadius = (size / 2) * 0.7 * t + radius;
      let context = this.context;
   
      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
      context.fill();
   
      // draw inner circle
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255, 100, 100, 1)';
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();
   
      // update this image's data with data from the canvas
      this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;
   
      // continuously repaint the map, resulting in the smooth animation of the dot
      map.triggerRepaint();
       
      // return `true` to let the map know that the image was updated
      return true;
    }
  };
  var grayDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
   
  // get rendering context for the map canvas when layer is added to the map
    onAdd: function() {
      let canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },
   
  // called once before every frame where the icon will be used
    render: function() {
      let duration = 1000;
      // var t = (performance.now() % duration) / duration;
      let t = duration;
   
      let radius = (size / 2) * 0.3;
      let outerRadius = 0; // (size / 2) * 0.7 * t + radius;
      let context = this.context;
   
      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255, 200, 200,0)';
      context.fill();
   
      // draw inner circle
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = '#bbb';
      context.strokeStyle = 'white';
      context.lineWidth = 4;
      context.fill();
      context.stroke();
   
      // update this image's data with data from the canvas
      this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;
   
      // continuously repaint the map, resulting in the smooth animation of the dot
      // map.triggerRepaint();
       
      // return `true` to let the map know that the image was updated
      return true;
    }
  };


  map.on('load', function() {

    map.addSource('route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [x0,y0],
            [xf,yf],

          ]
        }
      }
    });
    map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#ed6498',
        'line-width': 5,
        'line-opacity': 0.8
      }
    });
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    map.addSource('points', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [xf, yf]
            },
            'properties': {
              'title': `${restaurantName}'s current location`
            }
          }
        ]
      }
    });
    let textOffset = [-1, -1.5]
    if (mapId === 'floridita-map' && window.innerWidth < 460) {
      textOffset = [8, -1.5];
    } else if (mapId === 'dino-map') {
      textOffset = [4, 1];
    }
    map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'layout': {
        'icon-image': 'pulsing-dot',
        'text-field': ['get', 'title'],
        'text-font': ['Roboto Regular', 'Arial Unicode MS Bold'],
        'text-offset': textOffset,
        'text-anchor': 'top-right'
      }
    });


    map.addSource('points2', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [x0, y0]
            },
            'properties': {
              'title': `${restaurantName}'s old location`
            }
          }
        ]
      }
    });

    map.addImage('gray-dot', grayDot, { pixelRatio: 2 });
    if (mapId === 'floridita-map') {
      if (window.innerWidth < 460)
        textOffset = [2, 0.9];
      else
        textOffset = [4.7, 1];
    } else if (mapId === 'dino-map') {
      textOffset = [4, -2];
    }
    map.addLayer({
      'id': 'points2',
      'type': 'symbol',
      'source': 'points2',
      'layout': {
        'icon-image': 'gray-dot',
        'text-field': ['get', 'title'],
        'text-font': ['Roboto Regular', 'Arial Unicode MS Bold'],
        'text-offset': textOffset,
        'text-anchor': 'top-right'
      }
    });
  });
}
