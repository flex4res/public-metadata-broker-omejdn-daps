import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import Icon from './Icon';

const markerIcon = new L.Icon({
    iconUrl: require('./img/marker-icon-2x.png'),
    iconRetinaUrl: require('./img/marker-icon-2x.png'),
    shadowUrl: require('./img/marker-shadow.png'),
    iconSize:     [10, 20], 
    shadowSize:   [20, 10], 
    iconAnchor:   [5, 20], 
    shadowAnchor: [5, 10],  
    popupAnchor:  [0, -23] 
});

let markerIconNumber = (number, color) => {
    return new L.divIcon({
      className: 'custom-icon',
      html: ReactDOMServer.renderToString(<Icon number={number} color={color}/>)
    });
};

export { markerIcon, markerIconNumber };
