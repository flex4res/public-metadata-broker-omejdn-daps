import React, { Component } from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import mapData0 from './data/NUTS_RG_20M_2021_4326_LEVL_0.json';
import mapData1 from './data/NUTS_RG_20M_2021_4326_LEVL_1.json';
import leafletPip from '@mapbox/leaflet-pip';

class GeoJSONCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 4
    };
    
    this.props.map.on('zoomend', () => {
      const newZoom = this.props.map.getZoom();
      if (newZoom < this.state.zoom && newZoom <= 4) {
        props.zoomOutFromRegions();
        
        this.props.map.eachLayer( (layer) => {
          if ( layer.myTag && layer.myTag === "regionsGeoJSON") {
            this.props.map.removeLayer(layer);
          }
        });
        // let countriesLayer = new L.geoJSON(mapData0.features,{
        //   style: this.countryStyle,
        //   onEachFeature: this.onEachCountry
        // });
        // countriesLayer.addTo(this.props.map);
      }
      this.state.zoom = newZoom;
    });
  }
  
  countryStyle = {
    fillColor: 'yellow',
    fillOpacity: 0.01,
    color: 'black',
    weight: 2,
  };
  
  regionStyle = {
    fillColor: 'yellow',
    fillOpacity: 0.01,
    color: 'gray',
    weight: 1,
  };
  
  highlightFeature = (e) => {
    e.target.setStyle({
      weight: 4
    });
  };

  resetHighlight = (e) => {
    e.target.setStyle({
      weight: (e.target.myTag === "countriesGeoJSON") ? 2 : 1
    });
  };
  
  zoomToLayer = (e) => {
    if (e.target.feature.properties.hasResources) {
      const coordinates = e.target.feature.geometry.coordinates;
      const geometryType = e.target.feature.geometry.type;
      let newBounds = e.target._bounds;
      
      if (geometryType === 'MultiPolygon') {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        for (let i = 0; i < coordinates.length; i++) {
          let itemCoordinates = coordinates[i];
          let gj = {
            type: 'FeatureCollection',
            features: [{"type": "Feature", "geometry": {"type": "MultiPolygon", "coordinates": [itemCoordinates]}}]
          };
          
          let results = leafletPip.pointInLayer([lng, lat], L.geoJson(gj), true);
          if (results.length > 0) {
            const newBoundsTemp = L.polygon(itemCoordinates).getBounds();
            newBounds._northEast.lat = newBoundsTemp._northEast.lng;
            newBounds._northEast.lng = newBoundsTemp._northEast.lat;
            newBounds._southWest.lat = newBoundsTemp._southWest.lng;
            newBounds._southWest.lng = newBoundsTemp._southWest.lat;
            
            break;
          }
        }
      }
          
      const newZoom = this.props.map.getBoundsZoom(newBounds);
      if (newZoom !== this.state.zoom) {
        this.state.zoom = 0;//to handle properly regions of large country bounds (without it, onzoom event will remove regions)
      }
      this.props.zoomToRegions();
      this.resetHighlight(e);
      this.props.map.fitBounds(newBounds);
      // this.props.map.eachLayer( (layer) => {
      //   if ( layer.myTag && layer.myTag === "countriesGeoJSON") {
      //     this.props.map.removeLayer(layer);
      //   }
      // });
      
      //create layer with regions
      let regionsLayer = new L.geoJSON(mapData1.features,{
        style: this.regionStyle,
        onEachFeature: this.onEachRegion
      });
      regionsLayer.addTo(this.props.map);
    }
  };
  
  onEachRegion = (region, layer) => {
    const regionName = region.properties.NUTS_NAME;
    //layer.bindPopup(regionName);
    layer.bindTooltip(regionName);
    layer.myTag = "regionsGeoJSON";
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight
    });
  };
  
  onEachCountry = (country, layer) => {
    const countryName = country.properties.NUTS_NAME;
    layer.bindTooltip(countryName);

    //layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
    // const colorIndex = Math.floor(Math.random() * this.colors.length);
    // layer.options.fillColor = this.colors[colorIndex]; //0
    layer.myTag = "countriesGeoJSON";
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.zoomToLayer
    });
  };
  
  render() {
    return (
      <GeoJSON
        style={this.countryStyle}
        data={mapData0.features}
        onEachFeature={this.onEachCountry}
        />
    );
  }
}

export default GeoJSONCustom;
