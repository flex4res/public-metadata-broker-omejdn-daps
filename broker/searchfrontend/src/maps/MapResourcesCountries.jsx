import React, { Component, useState, useEffect } from 'react';
import { MapContainer, MapConsumer, Marker, Popup, Tooltip as LeafletTooltip } from 'react-leaflet';
import mapData0 from './data/NUTS_RG_20M_2021_4326_LEVL_0.json';
import mapData1 from './data/NUTS_RG_20M_2021_4326_LEVL_1.json';
import markerCoordinates from './data/markerCoordinates.json';
import 'leaflet/dist/leaflet.css';
import { markerIconNumber } from './markers';
import L from 'leaflet';
import MapLayersControl from './MapLayersControl';
import GeoJSONCustom from './GeoJSONCustom';
import leafletPip from '@mapbox/leaflet-pip';
import axios from 'axios';

const SPATIAL_COVERAGE_POI = 'spatialCoverage_poi';
const SPATIAL_COVERAGE_POlYGON = 'spatialCoverage_polygon';
const SPATIAL_COVERAGE_REF = 'spatialCoverage_ref';
const SPATIAL_COVERAGE_REF_LENGTH = 25;

const SPATIAL_COVERAGE_REF_URL = 'http://api.geonames.org/getJSON';
const SPATIAL_COVERAGE_REF_USERNAME = 'marija.popovic';

const MAP_DATA_FEATURES_LENGTH = 37;

function ResourceMarkersCustom(props) {

  const [resourceMap, setResourceMap] = useState(new Map());
  const [resourceZoomMap, setResourceZoomMap] = useState(new Map());
  const [regionsMap, setRegionsMap] = useState(new Map());
  const [updateInitialDone, setUpdateInitialDone] = useState(false);

  const [geoFeatureResources, setGeoFeatureResources] = useState([]);
  const [updateZoomDone, setUpdateZoomDone] = useState(false);

  const [zoomMode, setZoomMode] = useState(false);


  useEffect(() => {
    if (!zoomMode && props.mapDataFeatures.length > MAP_DATA_FEATURES_LENGTH) {
      setZoomMode(true);
    } else {
      setZoomMode(false);
    }
    // if we don't yet have zoom location info, only run once
    if (resourceZoomMap.size === 0) {
      setInitialResourceMapState(props.resources, props.mapDataFeatures, true);
    }
  }, [props.mapDataFeatures])

  useEffect(() => {
    setInitialResourceMapState(props.resources, props.mapDataFeatures, false);
  }, [props.resources])

  useEffect(() => {
    if (!updateZoomDone && resourceZoomMap.size > 0) {
      setUpdateZoomDone(true);
    }
  }, [resourceZoomMap.size])

  useEffect(() => {
    if (!updateInitialDone && resourceMap.size > 0) {
      setUpdateInitialDone(true);
    }
  }, [resourceMap.size])

  useEffect(() => {
    setGeoFeatureMapState(props.mapDataFeatures);
  }, [updateZoomDone])

  useEffect(() => {
    setGeoFeatures(props.resources, props.mapDataFeatures);
  }, [updateInitialDone])

  const getColor = (number) => {
    return (number > 10) ? 'red' : (number > 5) ? 'blue' : 'green';
  };

  const isResourcePointInBounds = (lat, lng, item) => {
    let gj = {
      type: 'FeatureCollection',
      features: [item]
    };
    let results = leafletPip.pointInLayer([lng, lat], L.geoJson(gj), true);
    return (results.length > 0);
  };

  const setGeoFeatureMapState = (mapFeatures) => {
    let tempResourceMap = resourceZoomMap;
    for (let i = 0; i < geoFeatureResources.length; i++) {
      mapFeatures.every((item) => {
        return addResourceToResourceMap(geoFeatureResources[i].lat, geoFeatureResources[i].lng, item, tempResourceMap, geoFeatureResources[i].resourceID, geoFeatureResources[i].title);
      });
    }
    setResourceZoomMap(new Map(tempResourceMap));
  }

  const testRegionsCoordinates = (item, regionsMap) => {
    let name = item.properties.NUTS_NAME;
    let id = item.properties.NUTS_ID;

    let center = (markerCoordinates[id]) ? markerCoordinates[id] : L.polygon(item.geometry.coordinates).getBounds().getCenter();
    let marker = { position: [center.lng, center.lat], id: id, country: name, tooltip: id, number: 1, color: 'green' };

    regionsMap.set(name, marker);
    return true;
  }

  const addResourceToResourceMap = (lat, lng, item, resourceMap, resourceID, resourceTitle) => {
    if (isResourcePointInBounds(lat, lng, item)) {
      let name = item.properties.NUTS_NAME;
      let id = item.properties.NUTS_ID;
      let marker = resourceMap.get(name);
      if (marker) {
        marker.number = marker.number + 1;
        marker.color = getColor(marker.number);
        marker.resources.push({ id: resourceID, title: resourceTitle });
      } else {
        let center = (markerCoordinates[id]) ? markerCoordinates[id] : L.polygon(item.geometry.coordinates).getBounds().getCenter();
        marker = { position: [center.lng, center.lat], id: id, country: name, tooltip: id, number: 1, color: 'green', resources: [{ id: resourceID, title: resourceTitle }] };
      }
      resourceMap.set(name, marker);
      item.properties.hasResources = true;
      return false;
    } else {
      return true;
    }
  };

  const getResourceCoordinates = (resource) => {
    let resourceCoordinates = {};
    let resourceLocations = resource.spatialCoverages;
    if (resourceLocations) {
      let resourceLocation = resourceLocations[0];
      if (SPATIAL_COVERAGE_POI in resourceLocation) {
        let spatialCoveragePoi = resourceLocation[SPATIAL_COVERAGE_POI];
        resourceCoordinates = {
          lat: spatialCoveragePoi.lat,
          lng: spatialCoveragePoi.lon
        }
      } else if (SPATIAL_COVERAGE_POlYGON in resourceLocation) {
        let spatialCoveragePolygon = resourceLocation[SPATIAL_COVERAGE_POlYGON];
        let spatialCoveragePoi = spatialCoveragePolygon[0][SPATIAL_COVERAGE_POI];
        resourceCoordinates = {
          lat: spatialCoveragePoi.lat,
          lng: spatialCoveragePoi.lon
        }
      } else {
        return null;
      }
      return resourceCoordinates;
    } else {
      return null;
    }
  }

  const setInitialResourceMapState = (resources, mapFeatures, zoom) => {
    let resourceMap = new Map();
    for (let i = 0; i < resources.length; i++) {
      let resourcesPerConnector = resources[i];
      for (let j = 0; j < resourcesPerConnector.length; j++) {
        let resourceCoordinates = getResourceCoordinates(resourcesPerConnector[j]);
        if (resourceCoordinates) {
          mapFeatures.every((item) => {
            return addResourceToResourceMap(resourceCoordinates.lat, resourceCoordinates.lng, item, resourceMap, resourcesPerConnector[j].resourceID, resourcesPerConnector[j].title[0]);
          });
        }
      }
    }
    if (zoom) {
      setResourceZoomMap(resourceMap);
      /*  mapData1.features.every((item) => {
         return testRegionsCoordinates(item, regionsMap);
       });
       setRegionsMap(regionsMap); */
    } else {
      setResourceMap(resourceMap);
    }
  }

  const getGeoFeatureCoordinates = async (geoNameId, resourceCoordinates) => {
    try {
      const res = await axios.get(SPATIAL_COVERAGE_REF_URL, {
        params: {
          geonameId: geoNameId,
          username: SPATIAL_COVERAGE_REF_USERNAME,
          formatted: true
        }
      });
      resourceCoordinates = {
        lat: res.data.lat,
        lng: res.data.lng
      }
      return resourceCoordinates;
    } catch (err) {
      console.error(err);
    }
  }

  const getResourceGeoFeatureCoordinates = async (resource) => {
    let resourceCoordinates = {};
    let resourceLocations = resource.spatialCoverages;
    if (resourceLocations) {
      let resourceLocation = resourceLocations[0];
      if (SPATIAL_COVERAGE_REF in resourceLocation && process.env.REACT_APP_USE_GEO_NAMES === 'true') {
        let geoNameId = resourceLocation[SPATIAL_COVERAGE_REF].toString().slice(SPATIAL_COVERAGE_REF_LENGTH);
        geoNameId = geoNameId.slice(0, geoNameId.length - 1);
        resourceCoordinates = await getGeoFeatureCoordinates(geoNameId, resourceCoordinates);
        return resourceCoordinates;
      }
    } else {
      return null;
    }
  }

  const setGeoFeatures = async (resources, mapFeatures) => {
    let tempResourceMap = resourceMap;
    for (let i = 0; i < resources.length; i++) {
      let resourcesPerConnector = resources[i];
      for (let j = 0; j < resourcesPerConnector.length; j++) {
        let resourceCoordinates = await getResourceGeoFeatureCoordinates(resourcesPerConnector[j]);
        if (resourceCoordinates) {
          setGeoFeatureResources(prevResources =>
            [
              ...prevResources,
              { resourceID: resourcesPerConnector[j].resourceID, title: resourcesPerConnector[j].title[0], lat: resourceCoordinates.lat, lng: resourceCoordinates.lng }
            ]
          )
          mapFeatures.every((item) => {
            return addResourceToResourceMap(resourceCoordinates.lat, resourceCoordinates.lng, item, tempResourceMap, resourcesPerConnector[j].resourceID, resourcesPerConnector[j].title[0]);
          });
        }
      }
    }
    setResourceMap(new Map(tempResourceMap));
  }

  return (
    <div>
      {/*      {zoomMode && [...regionsMap.values()].map((item) => (
        <Marker position={item.position} icon={markerIconNumber(item.number, item.color)} key={item.country}>
          <Popup>
            Marker Id = {item.id} : {item.country} <br /> lng: {item.position[0]} lat: {item.position[1]}
          </Popup>
          <LeafletTooltip direction='top' offset={[0, -5]} opacity={0.8}>
            {item.tooltip}
          </LeafletTooltip>
        </Marker>
      ))} */}

      {zoomMode && [...resourceZoomMap.values()].map((item) => (
        <Marker position={item.position} icon={markerIconNumber(item.number, item.color)} key={item.country}>
          <Popup>
            {item.resources.map((resource) => (
              <p> {resource.title} </p>
            ))}
          </Popup>
          <LeafletTooltip direction='top' offset={[0, -5]} opacity={0.8}>
            {item.tooltip}
          </LeafletTooltip>
        </Marker>
      ))}

      {!zoomMode && [...resourceMap.values()].map((item) => (
        <Marker position={item.position} icon={markerIconNumber(item.number, item.color)} key={item.country}>
          <Popup>
            {item.resources.map((resource) => (
              <p> {resource.title} </p>
            ))}
          </Popup>
          <LeafletTooltip direction='top' offset={[0, -5]} opacity={0.8}>
            {item.tooltip}
          </LeafletTooltip>
        </Marker>
      ))}
    </div>
  );
}

class MapResourcesCountries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapDataFeatures: mapData0.features
    };
  }

  zoomToRegions = () => {
    this.setState({
      mapDataFeatures: mapData1.features
    });
  };

  zoomOutFromRegions = () => {
    this.setState({
      mapDataFeatures: mapData0.features
    });
  };

  render() {
    return (
      <MapContainer style={{ height: '400px', width: '100%' }} center={[49.505, 10.09]} zoom={4} >
        <MapConsumer>
          {(map) => {
            return <GeoJSONCustom zoomToRegions={this.zoomToRegions} zoomOutFromRegions={this.zoomOutFromRegions} map={map} />
          }}
        </MapConsumer>
        <MapLayersControl activeLayer='CartoDB.VoyagerNoLabels' />
        <ResourceMarkersCustom resources={this.props.resources} mapDataFeatures={this.state.mapDataFeatures} />
      </MapContainer>
    );
  }
}

export default MapResourcesCountries;
