import React from "react";
import Button from '@material-ui/core/Button';
import FormData from "form-data";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Alert, AlertTitle } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { mongodb_handlerURL } from './urlConfig'
import { connect } from 'react-redux';


const queryMap = [
  {
    "display": "Activate Connector", "query": `PREFIX conn: <http://iais.fraunhofer.de/ids/iais-connector>

  # This query puts the IDS Connector on state 'graphIsActive'
  WITH <https://broker.ids.isst.fraunhofer.de/admin>
  DELETE {
      conn: ?predicate ?object .
  }
  INSERT {
      conn: <https://w3id.org/idsa/core/graphIsActive>  true .
      conn: <https://w3id.org/idsa/core/graphIsDeleted>  false .
  }
  WHERE {
      conn: ?predicate ?object .
  }` },
  {
    "display": "Add Connector", "query": `PREFIX ids: <https://w3id.org/idsa/core/>
  PREFIX idsc: <https://w3id.org/idsa/code/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX idsc: <https://w3id.org/idsa/code/>
  PREFIX part1: <https://im.internationaldataspaces.org/participant/part1>
  PREFIX conn1: <https://aastat.gov.de/connector/conn1/>

  # This query adds an IDS Connector
  INSERT { GRAPH conn1: {
  conn1: a ids:BaseConnector ;
      # General properties
      ids:title "Mobile base connector" ;
      ids:description "Mobile base connector operated by PART1" ;
      ids:maintainer part1: ;
      ids:curator part1: ;
      ids:physicalLocation <http://sws.geonames.org/3247450/> ; # Bonn
      ids:outboundModelVersion "4.0.0" ;
      ids:inboundModelVersion "4.0.0" ;

      # Network hosts maintained by the Connector
      ids:hasDefaultEndpoint conn1:http_host ;

      # Security and trust features
      ids:authInfo conn1:auth_info ;
      ids:securityProfile idsc:BASE_CONNECTOR_SECURITY_PROFILE ;
      ids:componentCertification conn1:certification ;

      # Catalog of mediated resources
      ids:resourceCatalog [
          a ids:ResourceCatalog ;
      ].

  <http://sws.geonames.org/3247450/> a ids:GeoFeature .

  conn1:http_host
      a ids:ConnectorEndpoint ;
      ids:accessURL <https://monconnector.aastat.gov.de>;
      .

  conn1:auth_info
      a ids:AuthInfo ;
      ids:authService <https://keycloak.aastat.gov.de>;
      ids:authStandard idsc:OAUTH2_JWT ;
      .

  conn1:certification
      a ids:ComponentCertification ;
      ids:certificationLevel idsc:COMPONENT_TRUSTPLUS_SECURITY_PROFILE_CONCEPT_REVIEW ;
      ids:lastValidDate "2020-12-31T12:00:00.000+02:00"^^xsd:dateTimeStamp ;
      .
    }
  }
  WHERE {
  }` },
  {
    "display": "Delete Named Graph", "query": `# This query deletes all triples from the named graph
  DELETE WHERE { GRAPH <http://iais.fraunhofer.de/ids/iais-connector2> {
    ?subject ?predicate ?object .
  }}` },
  {
    "display": "Inactivate Connector", "query": `PREFIX conn: <http://iais.fraunhofer.de/ids/iais-connector>

  # This query puts the IDS Connector on state 'graphIsDeleted'
  WITH <https://broker.ids.isst.fraunhofer.de/admin>
  DELETE {
      conn: ?predicate ?object .
  }
  INSERT {
      conn: <https://w3id.org/idsa/core/graphIsDeleted>  true .
      conn: <https://w3id.org/idsa/core/graphIsActive>  false .
  }
  WHERE {
      conn: ?predicate ?object .
  }` },
  {
    "display": "Select From Named Graph", "query": `# This query retrieves all triples from a specific graph
  SELECT *
  WHERE { GRAPH <https://aastat.gov.de/connector/conn1/> {
    ?subject ?predicate ?object
    }
  }` },
  {
    "display": "Update Connector", "query": `PREFIX ids: <https://w3id.org/idsa/core/>
  PREFIX idsc: <https://w3id.org/idsa/code/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX idsc: <https://w3id.org/idsa/code/>
  PREFIX part1: <https://im.internationaldataspaces.org/participant/part1>
  PREFIX conn1: <https://aastat.gov.de/connector/conn1/>

  # This query updates a IDS Connector
  WITH conn1:
  DELETE {
      ?subject ?predicate ?object .
  }
  INSERT {
  conn1: a ids:BaseConnector ;
      # General properties
      ids:title "Mobile base connector" ;
      ids:description "Mobile base connector operated by PART1" ;
      ids:maintainer part1: ;
      ids:curator part1: ;
      ids:physicalLocation <http://sws.geonames.org/3247450/> ; # Bonn
      ids:outboundModelVersion "4.0.0" ;
      ids:inboundModelVersion "4.0.0" ;

      # Network hosts maintained by the Connector
      ids:hasDefaultEndpoint conn1:http_host ;

      # Security and trust features
      ids:authInfo conn1:auth_info ;
      ids:securityProfile idsc:BASE_CONNECTOR_SECURITY_PROFILE ;
      ids:componentCertification conn1:certification ;

      # Catalog of mediated resources
      ids:resourceCatalog [
          a ids:ResourceCatalog ;
      ].

  <http://sws.geonames.org/3247450/> a ids:GeoFeature .

  conn1:http_host
      a ids:ConnectorEndpoint ;
      ids:accessURL <https://monconnector.aastat.gov.de>;
      .

  conn1:auth_info
      a ids:AuthInfo ;
      ids:authService <https://keycloak.aastat.gov.de>;
      ids:authStandard idsc:OAUTH2_JWT ;
      .

  conn1:certification
      a ids:ComponentCertification ;
      ids:certificationLevel idsc:COMPONENT_TRUSTPLUS_SECURITY_PROFILE_CONCEPT_REVIEW ;
      ids:lastValidDate "2020-12-31T12:00:00.000+02:00"^^xsd:dateTimeStamp ;
      .
  }
  WHERE {
      ?subject ?predicate ?object .
  }` },
  {
    "display": "Update Object", "query": `PREFIX ids: <https://w3id.org/idsa/core/>
  PREFIX idsc: <https://w3id.org/idsa/code/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX idsc: <https://w3id.org/idsa/code/>
  PREFIX part1: <https://im.internationaldataspaces.org/participant/part1>
  PREFIX conn1: <https://aastat.gov.de/connector/conn1/>

  # This query updates the object in a named graph
  WITH conn1:
  DELETE {
    conn1: ids:maintainer ?old_object .
  }
  INSERT {
    conn1: ids:maintainer <https://example.org/newMaintainer> . # the new object
  }
  WHERE {
      conn1: ids:maintainer ?old_object . # Take care! All triples with subject 'conn1:' and property 'ids:maintainer' of this graph will be deleted!
  }` },
  {
    "display": "Update Resource", "query": `PREFIX ids: <https://w3id.org/idsa/core/>
  PREFIX idsc: <https://w3id.org/idsa/code/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

  # This query updates an IDS Resource
  WITH <http://iais.fraunhofer.de/ids/iais-connector>
  DELETE {
      <https://aastat.gov.de/connector/conn2/data1/> ?predicate1 ?object1 .
      ?object1 ?predicate2 ?object2 .
      ?object2 ?predicate3 ?object3 .
      ?object3 ?predicate4 ?object4 .
      ?object4 ?predicate5 ?object5 .
  }
  INSERT {
    <https://w3id.org/idsa/autogen/catalog/432bc86b-9c86-4bf1-a2f3-d612c50325fb> a ids:ResourceCatalog .
    <https://w3id.org/idsa/autogen/catalog/432bc86b-9c86-4bf1-a2f3-d612c50325fb> ids:offeredResource <https://aastat.gov.de/connector/conn2/data1/> .

  <https://aastat.gov.de/connector/conn2/data1/> a ids:TextResource ;
    ids:title "European highway statistics - accident report"@en ;
    ids:description "Detailed accident analysis report based on European highway statistics data 2000 - 2017."@en;
    ids:keyword "report", "highway", "statistics", "Europe" ;
    ids:temporalCoverage [
        a ids:Interval ;
        ids:begin [
            a ids:Instant ;
            ids:dateTime "2001-01-01T12:00:00.000+02:00"^^xsd:dateTimeStamp ;
        ];
        ids:end   [
            a ids:Instant ;
            ids:dateTime "2017-12-31T12:00:00.000+02:00"^^xsd:dateTimeStamp ;
        ] ;
    ] ;
    ids:language idsc:EN ;
    ids:representation [
        a ids:TextRepresentation ;
        ids:mediaType <https://www.iana.org/assignments/media-types/application/pdf> ;
        ids:instance <https://aastat.gov.de/connector/conn2/data1/report_pdf> ;
    ] ;
    ids:representation [
        a ids:TextRepresentation ;
        ids:mediaType <https://www.iana.org/assignments/media-types/application/msword> ;
        ids:instance <https://aastat.gov.de/connector/conn2/data1/report_doc> ;
    ] ;
    ids:resourceEndpoint [
        a ids:ConnectorEndpoint ;
        ids:accessURL "https://connector.aastat.gov.de/reports/Highway_accident_statistics.pdf"^^xsd:anyURI ;
    ] ;
  .
  }
  WHERE {

      <https://aastat.gov.de/connector/conn2/data1/> a ids:TextResource .
      <https://aastat.gov.de/connector/conn2/data1/> ?predicate1 ?object1 .
      OPTIONAL { ?object1 ?predicate2 ?object2 .
        OPTIONAL { ?object2 ?predicate3 ?object3 .
          OPTIONAL { ?object3 ?predicate4 ?object4 .
            OPTIONAL { ?object4 ?predicate5 ?object5 . }
          }
        }
      }
  }` }
];

class Query extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      queryMessage: {
        "@context": {
          "ids": "https://w3id.org/idsa/core/",
          "idsc": "https://w3id.org/idsa/code/"
        },
        "@type": "ids:QueryMessage",
        "@id": "https://w3id.org/idsa/autogen/queryMessage/dbb77622-7508-4630-9830-aa07b196eebc",
        "ids:securityToken": {
          "@type": "ids:DynamicAttributeToken",
          "@id": "https://w3id.org/idsa/autogen/dynamicAttributeToken/f9f2b139-0e9b-4e6f-b320-abf22a7224aa",
          "ids:tokenFormat": {
            "@id": "idsc:JWT"
          },
          "ids:tokenValue": "eyJ0eXAiOiJKV1QiLCJraWQiOiJkZWZhdWx0IiwiYWxnIjoiUlMyNTYifQ..."
        },
        "ids:senderAgent": {
          "@id": "http://example.org"
        },
        "ids:modelVersion": "3.0.0",
        "ids:issued": {
          "@value": "2020-06-23T16:10:57.781+02:00",
          "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp"
        },
        "ids:issuerConnector": {
          "@id": "https://test.connector.de/"
        },
        "ids:queryLanguage": {
          "@id": "idsc:SPARQL"
        },
        "ids:queryScope": {
          "@id": "idsc:ALL"
        }
      },
      queryDropdown: "",
      inputQuery: 'PREFIX ids: <https://w3id.org/idsa/core/> \n SELECT ?connectorUri WHERE { GRAPH ?g { ?connectorUri a ids:BaseConnector . } } ',
      queryResult: "",
      queryError: false,
      formattedResult: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  executeQuery() {
    //let form = new FormData();
    //const query_url = new URL('/infrastructure', window._env_.REACT_APP_BROKER_URL);
    var query_url;
    if ((this.state.queryDropdown === "Select From Named Graph") || this.state.queryDropdown === "") {
      query_url = mongodb_handlerURL + '/proxy/selectQuery';
    } else {
      query_url = mongodb_handlerURL + '/proxyadmin/updateQuery';
    }
    //form.append("header", JSON.stringify(this.state.queryMessage));
    //form.append("payload", this.state.inputQuery);

    const myHeaders = new Headers();
    myHeaders.append('Content-type', 'application/json')

    if (this.props.token) {
      myHeaders.append('x-auth-token', this.props.token)
    }

    fetch(query_url.toString(), { method: "POST", headers: myHeaders, body: this.state.inputQuery })
      .then(res => {
        if (res.ok) {
          return res.blob();
        } else {
          throw new Error("An unexpected error");
        }
      })
      .then(resBlob => {
        const reader = new FileReader();
        reader.readAsText(resBlob);
        reader.addEventListener("loadend", event => {
          this.setState({ queryResult: event.srcElement.result });
          this.handleResult(event.srcElement.result);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChange(event) {
    this.setState({ inputQuery: event.target.value });
  }

  handleResult(text) {
    //response messages has a "header" and "payload" part. Query result is in the "payload" part and is in text/plain format
    //const resultSplit = text.split('name="payload"');
    if (text !== undefined) {
      // console.log(resultSplit[1].slice(resultSplit[1].indexOf('?'), resultSplit[1].indexOf('--')));
      const payloadSplit = text.split("\n");
      let finalResult = [];
      for (let str of payloadSplit) {
        if (
          str.length === 0 ||
          str.startsWith("Content-Type") ||
          str.startsWith("Content-Length") ||
          str.startsWith("--") ||
          str.startsWith("\r")
        )
          continue;
        else finalResult.push(str);
      }
      this.setState({ formattedResult: finalResult });
      this.setState({ queryError: false });
      // console.log(finalResult);
    } else {
      this.setState({ formattedResult: [] });
      this.setState({ queryError: true });
    }
  }

  selectQuery = (event) => {
    this.setState({ queryDropdown: event.target.value });
    queryMap.map(q => {
      if (q.display === event.target.value)
        this.setState({ inputQuery: q.query });
    })
  }

  renderResult() {
    if (
      this.state.formattedResult.length > 0 &&
      this.state.queryError === false
    ) {
      return (
        <div className="query-result" style={{ margin: 20 }}>
          {this.state.formattedResult.map((item, index) => (
            <Typography variant="body2" gutterBottom>
              {item}
              <br />
            </Typography>
          ))}
        </div>
      );
    } else if (this.state.queryError === true) {
      return (
        <div>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Invalid Query!! Please try again with a valid query
          </Alert>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  render() {
    return (
      <div>
        <div style={{ margin: 20 }}>
          <h3>Sparql query</h3>
          <Select
            id="demo-simple-select"
            displayEmpty
            variant="outlined"
            value={this.state.queryDropdown}
            style={{ width: 300 }}
            onChange={this.selectQuery}>
            <MenuItem value="" disabled>Please select a Query</MenuItem>
            {
              queryMap.map(e => {
                return <MenuItem value={e.display} key={e.display}>{e.display}</MenuItem>
              })
            }
          </Select>
          <br />
          <br />
          <TextField
            id="outlined-multiline-static"
            label="Query"
            multiline
            rows={15}
            value={this.state.inputQuery}
            onChange={this.handleChange}
            variant="outlined"
            style={{ width: 800 }}
          />
          <br />
          <br />
          <Button href="#" color="primary" variant="outlined" onClick={() =>
            this.executeQuery()
          }>
            Execute Query
          </Button>
        </div>
        {this.renderResult()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
})

export default connect(mapStateToProps)(Query)