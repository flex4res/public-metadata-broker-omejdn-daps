import React, { Component } from 'react';
import { MapContainer, Marker, Popup, Polygon, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { markerIcon } from './markers';
import MapLayersControl from './MapLayersControl';
import { tooltip } from 'leaflet';
import axios from 'axios';

const SPATIAL_COVERAGE_POI = 'spatialCoverage_poi';
const SPATIAL_COVERAGE_POlYGON = 'spatialCoverage_polygon';
const SPATIAL_COVERAGE_REF = 'spatialCoverage_ref';
const SPATIAL_COVERAGE_REF_LENGTH = 25;

const SPATIAL_COVERAGE_REF_URL = 'http://api.geonames.org/getJSON';
const SPATIAL_COVERAGE_REF_USERNAME = 'marija.popovic';

class MapConnectors extends Component {

  constructor(props) {
    super(props);
    this.state = {
      connectors: [],
      multiPolygonConnectors: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.connectors !== prevProps.connectors) {
      this.getConnectorLocations();
    }
  }


  async getGeoFeatureCoordinates(geoNameId, title) {
    try {
      const res = await axios.get(SPATIAL_COVERAGE_REF_URL, {
        params: {
          geonameId: geoNameId,
          username: SPATIAL_COVERAGE_REF_USERNAME,
          formatted: true
        }
      });
      this.setState((prevState) => ({
        connectors: [
          ...prevState.connectors,
          { position: [res.data.lat, res.data.lng], id: Math.random().toString(), tooltip: title }
        ]
      }))
    } catch (err) {
      console.error(err);
    }
  }

  getConnectorLocations() {
    let connectorsInfo = this.props.connectors;
    if (connectorsInfo) {
      for (let i = 0; i < connectorsInfo.length; i++) {
        if (connectorsInfo[i].connectorLocation) {
          let connectorLocation = connectorsInfo[i].connectorLocation[0];
          if (connectorLocation) {
            if (SPATIAL_COVERAGE_POI in connectorLocation) {
              let spatialCoveragePoi = connectorLocation[SPATIAL_COVERAGE_POI];
              this.setState((prevState) => ({
                connectors: [
                  ...prevState.connectors,
                  { position: [spatialCoveragePoi.lat, spatialCoveragePoi.lon], id: Math.random().toString(), tooltip: connectorsInfo[i].title[0] }
                ]
              }))
            } else if (SPATIAL_COVERAGE_POlYGON in connectorLocation) {
              let spatialCoveragePolygon = connectorLocation[SPATIAL_COVERAGE_POlYGON];
              let positions = [[]];
              for (let j = 0; j < spatialCoveragePolygon.length; j++) {
                positions[0].push([spatialCoveragePolygon[j].spatialCoverage_poi.lat, spatialCoveragePolygon[j].spatialCoverage_poi.lon]);
              }
              this.setState((prevState) => ({
                multiPolygonConnectors: [
                  ...prevState.multiPolygonConnectors,
                  { position: positions, id: Math.random().toString(), tooltip: connectorsInfo[i].title[0] }
                ]
              }))
            } else {
              if (process.env.REACT_APP_USE_GEO_NAMES === 'true') {
                let geoNameId = connectorLocation[SPATIAL_COVERAGE_REF].toString().slice(SPATIAL_COVERAGE_REF_LENGTH);
                geoNameId = geoNameId.slice(0, geoNameId.length - 1);
                this.getGeoFeatureCoordinates(geoNameId, connectorsInfo[i].title[0]);
              }
            }
          }
        }
      }
    }
  }

  render() {
    const connectors = this.state.connectors;
    const multiPolygonConnectors = this.state.multiPolygonConnectors;
    
    return (
      <MapContainer style={{ height: '400px', width: '100%' }} center={[49.505, 10.09]} zoom={4} >
        <MapLayersControl activeLayer='OpenStreetMap.Mapnik' />
        {connectors && connectors.map((connector) => (
          <Marker position={connector.position} icon={markerIcon} key={connector.id}>
            <Popup>
              Connector Id = {connector.id} <br /> Description
             </Popup>
            <LeafletTooltip direction='top' offset={[0, -20]} opacity={0.8}>
              {connector.tooltip}
            </LeafletTooltip>
          </Marker>
        ))}
        {multiPolygonConnectors && multiPolygonConnectors.map((connector) => (
          <Polygon pathOptions={{ color: 'purple' }} positions={connector.position} key={connector.id}>
            <Popup>
              Connector Id = {connector.id} <br /> Description
             </Popup>
            <LeafletTooltip sticky opacity={0.8}>{connector.tooltip}</LeafletTooltip>
          </Polygon>
        ))}
      </MapContainer>
    );
  }
}

export default MapConnectors;
