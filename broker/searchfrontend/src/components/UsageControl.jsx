import React, { Component, Fragment } from "react";
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Four03 from './error/403';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from '@material-ui/core/TextField';

const usageControlMap = [
  {
    "display": "Rental Agreement", "usageControl": {
      "@context": "https://w3id.org/idsa/contexts/context.jsonld",
      "@type": "ids:RentalAgreement",
      "@id": "/ResourceCatalog/e75d21a4/agreement4/",
      "ids:provider": { "@id": "https://example.org/some-participant/" },
      "ids:consumer": { "@id": "https://example.org/some-other-participant/" },
      "ids:permission": {
        "@type": "ids:Permission",
        "ids:assigner": { "@id": "https://example.org/some-participant/" },
        "ids:assignee": { "@id": "https://example.org/some-other-participant/" },
        "ids:target": { "@id": "/ResourceCatalog/e75d21a4/5128c92c/9a039204/" },
        "ids:action": "idsc:USE",
        "ids:constraint": [{
          "@type": "ids:Constraint",
          "ids:leftOperand": { "@id": "idsc:STATE" },
          "ids:operator": { "@id": "idsc:NOT" },
          "ids:rightOperand": { "@id": "http://www.w3.org/ns/prov#End" }
        }],
        "ids:preDuty": {
          "@type": "ids:Duty",
          "ids:assigner": { "@id": "https://example.org/some-participant/" },
          "ids:assignee": { "@id": "https://example.org/some-other-participant/" },
          "ids:action": {
            "@type": "ids:Action",
            "ids:includedIn": { "@id": "idsc:COMPENSATE" },
            "ids:actionRefinement": [{
              "@type": "ids:Constraint",
              "ids:leftOperand": { "@id": "idsc:PAYMENT" },
              "ids:operator": { "@id": "idsc:EQ" },

              "ids:rightOperand": {
                "@value": "0.5",
                "@type": "http://www.w3.org/2001/XMLSchema#double"
              },
              "ids:unit": { "@id": "https://dbpedia.org/resource/Euro" }
            }]
          },
          "ids:constraint": [
            {
              "@type": { "@id": "ids:Constraint" },
              "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
              "ids:operator": { "@id": "idsc:AFTER" },
              "ids:rightOperand": {
                "@value": "P30D",
                "@type": "http://www.w3.org/2001/XMLSchema#duration"
              }
            }
          ]
        }
      }
    }
  },
  {
    "display": "Rental Offer", "usageControl": {
      "@context": "https://w3id.org/idsa/contexts/context.jsonld",
      "@type": "ids:RentalOffer",
      "@id": "/ResourceCatalog/e75d21a4/offer4/",
      "ids:provider": { "@id": "https://example.org/some-participant/" },
      "ids:permission": {
        "@type": "ids:Permission",
        "ids:assigner": { "@id": "https://example.org/some-participant/" },
        "ids:target": "/ResourceCatalog/e75d21a4/5128c92c/9a039204/",
        "ids:action": { "@id": "idsc:USE" },
        "ids:constraint": [
          {
            "@type": "ids:Constraint",
            "ids:leftOperand": { "@id": "idsc:STATE" },
            "ids:operator": { "@id": "idsc:NOT" },
            "ids:rightOperand": { "@id": "http://www.w3.org/ns/prov#End" }
          }
        ],
        "ids:preDuty": {
          "@type": "ids:Duty",
          "ids:assigner": { "@id": "https://example.org/some-participant/" },
          "ids:action": {
            "@type": "ids:Action",
            "ids:includedIn": { "@id": "idsc:COMPENSATE" },
            "ids:actionRefinement": {
              "@type": "ids:Constraint",
              "ids:leftOperand": { "@id": "idsc:PAY_AMOUNT" },
              "ids:operator": { "@id": "idsc:EQ" },
              "ids:rightOperand": {
                "@value": "0.5",
                "@type": "http://www.w3.org/2001/XMLSchema#double"
              },
              "ids:unit": { "@id": "https://dbpedia.org/resource/Euro" }
            }
          },
          "ids:constraint": [
            {
              "@type": { "@id": "ids:Constraint" },
              "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
              "ids:operator": { "@id": "idsc:AFTER" },
              "ids:rightOperand": {
                "@value": "P30D",
                "@type": "http://www.w3.org/2001/XMLSchema#duration"
              }
            }
          ]
        }
      }
    }
  },
  {
    "display": "Sales Agreement", "usageControl": {
      "@context": "https://w3id.org/idsa/contexts/context.jsonld",
      "@type": "ids:SalesAgreement",
      "@id": "/ResourceCatalog/e75d21a7/agreement3/",
      "ids:provider": { "@id": "https://example.org/some-participant/" },
      "ids:consumer": { "@id": "https://example.org/some-other-participant/" },
      "ids:permission": {
        "@type": "ids:Permission",
        "ids:assigner": { "@id": "https://example.org/some-participant/" },
        "ids:assignee": { "@id": "https://example.org/some-other-participant/" },
        "ids:target": { "@id": "/ResourceCatalog/e75d21a4/5128c92c/9a039204/" },
        "ids:action": "idsc:USE",
        "ids:preDuty": {
          "@type": "ids:Duty",
          "ids:assigner": { "@id": "https://example.org/some-participant/" },
          "ids:assignee": { "@id": "https://example.org/some-other-participant/" },
          "ids:action": {
            "@type": "ids:Action",
            "ids:includedIn": { "@id": "idsc:COMPENSATE" },
            "ids:actionRefinement": {
              "@type": "ids:Constraint",
              "ids:leftOperand": { "@id": "idsc:PAY_AMOUNT" },
              "ids:operator": { "@id": "idsc:EQ" },
              "ids:rightOperand": {
                "@value": "5",
                "@type": "http://www.w3.org/2001/XMLSchema#double"
              },
              "ids:unit": { "@id": "https://dbpedia.org/resource/Euro" }
            }
          }
        }
      }
    }
  },
  {
    "display": "Usage During Interval Agreement", "usageControl": {
      "@context": "https://w3id.org/idsa/contexts/context.jsonld",
      "@type": "ids:IntervalUsageAgreement",
      "@id": "/ResourceCatalog/e75d21a0/agreement1/",
      "ids:provider": { "@id": "https://example.org/some-participant/" },
      "ids:consumer": { "@id": "https://example.org/some-other-participant/" },
      "ids:permission": {
        "@type": "ids:Permission",
        "ids:assigner": { "@id": "https://example.org/some-participant/" },
        "ids:assignee": { "@id": "https://example.org/some-other-participant/" },
        "ids:target": "/ResourceCatalog/e75d21a0/5128c92c/9a039204/",
        "ids:action": { "@id": "idsc:USE" },
        "ids:constraint": [{
          "@type": "ids:Constraint",
          "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
          "ids:operator": { "@id": "idsc:AFTER" },
          "ids:rightOperand": {
            "@value": "2020-07-08T15:35:34.589+02:00",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp"
          }
        }, {
          "@type": "ids:Constraint",
          "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
          "ids:operator": { "@id": "idsc:BEFORE" },
          "ids:rightOperand": {
            "@value": "2020-12-08T15:35:34.589+02:00",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp"
          }
        }]
      }
    }
  },
  {
    "display": "Usage During Interval Offer", "usageControl": {
      "@context": "https://w3id.org/idsa/contexts/context.jsonld",
      "@type": "ids:IntervalUsageOffer",
      "@id": "/ResourceCatalog/e75d21a0/offer1/",
      "ids:provider": { "@id": "https://example.org/some-participant/" },
      "ids:permission": {
        "@type": "ids:Permission",
        "ids:assigner": { "@id": "https://example.org/some-participant/" },
        "ids:target": "/ResourceCatalog/e75d21a0/5128c92c/9a039204/",
        "ids:action": { "@id": "idsc:USE" },
        "ids:constraint": [{
          "@type": "ids:Constraint",
          "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
          "ids:operator": { "@id": "idsc:AFTER" },
          "ids:rightOperand": {
            "@value": "2020-07-08T15:35:34.589+02:00",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp"
          }
        }, {
          "@type": "ids:Constraint",
          "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
          "ids:operator": { "@id": "idsc:BEFORE" },
          "ids:rightOperand": {
            "@value": "2020-12-08T15:35:34.589+02:00",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTimeStamp"
          }
        }]
      }
    }
  },
  {
    "display": "Usage Logging Agreement", "usageControl": {
      "@context": "https://w3id.org/idsa/contexts/context.jsonld",
      "@type": "ids:LoggingAgreement",
      "@id": "/ResourceCatalog/e75d21a4/agreement2/",
      "ids:provider": { "@id": "https://example.org/some-participant/" },
      "ids:consumer": { "@id": "https://example.org/some-other-participant/" },
      "ids:permission": {
        "@type": "ids:Permission",
        "ids:assigner": { "@id": "https://example.org/some-participant/" },
        "ids:assignee": { "@id": "https://example.org/some-other-participant/" },
        "ids:target": "/ResourceCatalog/e75d21a4/5128c92c/9a039204/",
        "ids:action": { "@id": "idsc:USE" },
        "ids:postDuty": {
          "@type": "ids:Duty",
          "ids:assigner": { "@id": "https://example.org/some-participant/" },
          "ids:assignee": { "@id": "https://example.org/some-other-participant/" },
          "ids:action": { "@id": "idsc:LOG" }
        }
      }
    }
  },
  {
    "display": "Usage Logging Offer", "usageControl": {
      "@context": "https://w3id.org/idsa/contexts/context.jsonld",
      "@type": "ids:LoggingOffer",
      "@id": "/ResourceCatalog/e75d21a4/offer2/",
      "ids:provider": { "@id": "https://example.org/some-participant/" },
      "ids:permission": {
        "@type": "ids:Permission",
        "ids:assigner": { "@id": "https://example.org/some-participant/" },
        "ids:target": "/ResourceCatalog/e75d21a4/5128c92c/9a039204/",
        "ids:action": { "@id": "idsc:USE" },
        "ids:postDuty": {
          "@type": "ids:Duty",
          "ids:assigner": { "@id": "https://example.org/some-participant/" },
          "ids:action": { "@id": "idsc:LOG" }
        }
      }
    }
  }
];

class UsageControl extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      executedUpdate: false,
      updateSuccess: false,
      usageControlDropdown: '',
      inputUC: 'Select an example to view the usage control examples'
    }
  }

  selectUsageControl = (event) => {
    this.setState({ usageControlDropdown: event.target.value });
    usageControlMap.map(q => {
      if (q.display === event.target.value)
        this.setState({ inputUC: JSON.stringify(q.usageControl, undefined, 4) });
    })
  }

  executeUpdate() {
    // code to submit change here
    this.setState({
      updateSuccess: true,
      executeUpdate: true
    });
  }

  renderResult() {
    return (
      this.state.updateSuccess
        ? <span className="msg-success">Successfully updated!</span>
        : this.executedUpdate ? <span className="msg-error">Update failed!</span> : ""
    )
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const usageControl = (
      <div>
        <h3>Usage Control</h3>
        <div style={{ margin: 20 }}>
          <Select
            id="demo-simple-select"
            displayEmpty
            variant="outlined"
            value={this.state.usageControlDropdown}
            style={{ width: 300 }}
            onChange={this.selectUsageControl}>
            <MenuItem value="" disabled>Please select a value</MenuItem>
            {
              usageControlMap.map(e => {
                return <MenuItem value={e.display} key={e.display}>{e.display}</MenuItem>
              })
            }
          </Select>
          <br />
          <br />
          <TextField
            id="outlined-multiline-static"
            label="Usage control template"
            multiline
            rows={15}
            value={this.state.inputUC}
            onChange={this.handleChange}
            variant="outlined"
            style={{ width: 800 }}
          />
          <br />
          <br />
          <Button href="#" color="primary" variant="outlined" onClick={() =>
            this.executeUpdate()
          }>
            Update
                </Button>
          <br />
          <br />
          {this.renderResult()}
        </div>
      </div>
    );
    return (
      <Fragment>
        {isAuthenticated ?
          usageControl : <Four03 msg="Login to see this page" />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(UsageControl)
