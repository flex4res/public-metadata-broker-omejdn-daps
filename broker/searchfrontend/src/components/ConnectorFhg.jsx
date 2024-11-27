import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Container } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import axios from 'axios';

import { connect } from 'react-redux';
import { logging } from '../actions/logging';

function FhgResourceView(props) {

    const { user } = props.auth;
    const resID = props.location.pathname.split('/').slice(-1)[0];

    //useEffect and useState helps in managing the states of the corresponding resource
    useEffect(() => {
        prepareResource();
    }, []); //the [] braces means to run it when the component is mounted/loaded

    useEffect(() => {
      if(user) logging(user.username, 'Resource', resID);
    }, [props.auth.user]);

    let [resource, setResource] = useState({});

    const prepareResource = () => {
        let resourceId = decodeURIComponent(props.location.search);
        if (resourceId !== null && resourceId !== "") {
            resourceId = resourceId.split("=")[1];
        }
        //find and get the respective resourceID in Elastic search
        axios
            .get(props.es_url + "/fhgresources/_search?size=1000&pretty", {
                data: {
                    query: {
                        term: {
                            _id: resourceId
                        }
                    }
                }
            })
            .then(response => {
                if (response.status === 200) {
                    const resVal = response.data.hits.hits.find(({ _id }) => _id === resourceId);
                    if (resVal !== null)
                        setResource(resVal._source.resources[0])
                }
            })
            .catch(err => {
                console.log("An error occured: " + err);
            })
    }

    let resource_title = resource.mainTitle || resource.title_en || resource.title || resource.title_de;
    let resource_description = resource.description_en || resource.description_de || resource.description;

    //define function handle field display
    function displayField(fieldLabel, fieldVal) {
        return (
            <div className="inline-attributes">
                <h5>{fieldLabel}</h5>
                <p>{fieldVal}</p>
            </div>
        );
    }

    function displayDate(fieldLabel, fieldVal) {
        return (
            <div className="frame-bottom-right">
                <h5 style={{ fontWeight: "bold" }}>{fieldLabel}&nbsp;&nbsp;</h5>
                <p>{fieldVal}</p>
            </div>
        );
    }

    function displayURI(fieldLabel, fieldVal) {
        return (
            <div className="inline-attributes">
                <h5>{fieldLabel}</h5>
                <p><a rel="noopener noreferrer" href={`${fieldVal}`} target="_blank">{fieldVal}</a></p>
            </div>
        );
    }

    function displayEmails(fieldLabel, fieldVal) {
        return (
            <div className="inline-attributes">
                <h5>{fieldLabel}</h5>
                <p><a rel="noopener noreferrer" href={`mailto:${fieldVal}`} target="_blank">{fieldVal}</a></p>
            </div>
        );
    }

    function displayHeadlines(fieldVal) {
        return (
            <div className="display-headlines">
                <h4>{fieldVal}</h4>
            </div>
        );
    }

    function getKeywords() {
        let resource_keywords = "";
        if (resource.keyword) {
            for (var i = 0, len = resource.keyword.length; i < len; i++) {
                if (i === 0)
                    resource_keywords = resource.keyword[i];
                else
                    resource_keywords = resource.keyword[i] + ", " + resource_keywords;
            }
        }
        return resource_keywords;
    }

    //convert bytes to kb, mb accordingly: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    function getByteSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        var k = 1024,
            decimal = 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i];
    }

    return (
        <div>
            {
                props.showBackButton ?
                    <IconButton aria-label="go back" size="medium" onClick={() => { props.history.goBack(); }}>
                        <ArrowBackIcon fontSize="inherit" />
                    </IconButton> : ""
            }
            <Container className="connector-view">
                {
                    resource_title ?
                        <Typography variant="h5" display="block" gutterBottom>
                            {resource_title}
                        </Typography> :
                        <Typography variant="h5" display="block" gutterBottom>
                            "Unknown Resource"
                        </Typography>
                }
                <div className="metadata-frame">
                    {
                        displayHeadlines("Meta Data")
                    }
                    {
                        resource_description ?
                            <div className="inline-attributes" style={{ width: "1665px", height: "auto" }}>
                                <h5>Resource Description</h5>
                                <p>
                                    {resource_description}
                                </p>
                            </div>
                            : ""
                    }
                    <br />
                    {
                        resource.researchDT ? displayField("Research Data Type", resource.researchDT.labelResearchDataType) : ""
                    }
                    {
                        resource.fraunhoferProjectResource && resource.fraunhoferProjectResource.classificationEnglishLabel ?
                            displayField("Science Classification", resource.fraunhoferProjectResource.classificationEnglishLabel.map(val => val.split("@")[0]).join(", "))
                            : ""
                    }
                    {
                        resource.customLicense ? displayURI("Custom License", resource.customLicense) : ""
                    }
                    {
                        resource.labelStandardLicense ? displayField("Standard License", resource.labelStandardLicense.map(val => val.split("_").join(" "))) : ""
                    }
                    {
                        getKeywords() ? displayField("Keywords", getKeywords()) : ""
                    }
                    {
                        resource.usageDateLimit ? displayField("Usage Date Limit", resource.usageDateLimit.split(" ")[0]) : ""
                    }
                    {
                        resource.usageScope ? displayField("Allowed Usage Scope", resource.usageScope.labelUsageScope) : ""
                    }
                    {
                        resource.usageType ? displayField("Allowed Usage Type", resource.usageType.labelUsageType) : ""
                    }
                    <br />
                    {
                        resource.resourceOntologyReference ?
                            <span>
                                {
                                    resource.resourceOntologyReference.map(ontology => (
                                        <React.Fragment>
                                            <div className="inline-attributes" style={{ width: "1000px", height: "120px" }}>
                                                <h5>Ontology Reference</h5>
                                                <p><a rel="noopener noreferrer" href={`${ontology}`} target="_blank">{ontology}</a></p>

                                                <Button color="primary" variant="outlined" style={{ color: "#def3ee", backgroundColor: "#009374", justifyContent: "center", margin: "0px", marginRight: "20px" }} rel="noopener noreferrer" href={`${ontology}`} target="_blank">
                                                    Open Ontology
                                                </Button>
                                                <Button color="primary" variant="outlined" style={{ color: "#def3ee", backgroundColor: "#009374", justifyContent: "center", margin: "0px" }} rel="noopener noreferrer" href={`https://demo1.iais.fraunhofer.de/fraunhofer/visualization/#opts=doc=0;#iri=${ontology}`} target="_blank">
                                                    Visualize Ontology
                                                </Button>
                                            </div>
                                            <br />
                                        </React.Fragment>
                                    ))
                                }
                            </span> : ""
                    }
                    {
                        resource.modifiedDate ? displayDate("Last modified date (meta data):", resource.modifiedDate.split(" ")[0]) : ""
                    }
                    <br />
                </div>
                <br />
                {
                    resource.representation ?
                        <span>
                            {resource.representation.map(represent => (
                                <div className="metadata-frame">
                                    {
                                        displayHeadlines("Data Set")
                                    }
                                    {
                                        represent.instance ?
                                            <span>
                                                {represent.instance.map(inst => (
                                                    <React.Fragment>
                                                        {
                                                            inst.filename ? displayField("Filename", inst.filename) : ""
                                                        }
                                                        {
                                                            inst.bytesize ? displayField("Size", getByteSize(inst.bytesize)) : ""
                                                        }
                                                    </React.Fragment>
                                                ))}
                                            </span> : ""
                                    }
                                    {
                                        represent.labelMediatype ? displayField("Mime Type", represent.labelMediatype) : ""
                                    }
                                    {
                                        resource.labelLanguage ? displayField("Language", resource.labelLanguage.join(', ')) : ""
                                    }
                                    {
                                        resource.creatortool ? displayField("Creator Tool", resource.creatortool.join(', ')) : ""
                                    }
                                    <br />
                                    {
                                        represent.datasetModified ? displayDate("Last modified date (data set):", represent.datasetModified.split(" ")[0]) : ""
                                    }
                                    <br />
                                </div>
                            ))}
                        </span> : ""
                }
                <br />
                {
                    resource.fraunhoferProjectResource && resource.fraunhoferProjectResource.fhgContact ?
                        <div className="metadata-frame">
                            {
                                displayHeadlines("Contact Details")
                            }
                            {
                                resource.fraunhoferProjectResource.fhgContact.fhgContactFirstname ? displayField("First Name", resource.fraunhoferProjectResource.fhgContact.fhgContactFirstname) : ""
                            }
                            {
                                resource.fraunhoferProjectResource.fhgContact.fhgContactSurname ? displayField("Surname", resource.fraunhoferProjectResource.fhgContact.fhgContactSurname) : ""
                            }
                            {
                                resource.fraunhoferProjectResource.fhgContact.fhgOfficeEmail ? displayEmails("E-mail", resource.fraunhoferProjectResource.fhgContact.fhgOfficeEmail) : ""
                            }
                            {
                                resource.fraunhoferProjectResource.fhgContact.fhgContactPhone ? displayField("Phone", resource.fraunhoferProjectResource.fhgContact.fhgContactPhone) : ""
                            }
                            {
                                resource.fraunhoferProjectResource.fhgContact.fhgContactEmployer ? displayField("Institute", resource.fraunhoferProjectResource.fhgContact.fhgContactEmployer) : ""
                            }
                            {
                                resource.fraunhoferProjectResource.fhgContact.fhgDirectory ? displayURI("Directory Link", resource.fraunhoferProjectResource.fhgContact.fhgDirectory) : ""
                            }
                        </div>
                        : ""
                }
            </Container>
        </div >
    );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(FhgResourceView);
