import React from "react";
import {
    ReactiveList
} from "@appbaseio/reactivesearch";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Container } from "@material-ui/core";

export function ParisConnectorView(props) {

    let obj = props.connector;
    let participant = obj.participant;

    //function to display field/URI based on 'div' classname
    function displayField(fieldLabel, fieldVal, classVal) {
        return (
            <div className={classVal}>
                <Typography variant="body2" gutterBottom>{fieldLabel}</Typography>
                <Typography variant="h6" gutterBottom>{fieldVal}</Typography>
            </div>
        );
    }

    function displayURI(fieldLabel, fieldVal, classVal) {
        return (
            <div className={classVal}>
                <Typography variant="body2" gutterBottom>{fieldLabel}</Typography>
                <Typography variant="h6" gutterBottom><a rel="noopener noreferrer" href={`${fieldVal}`} target="_blank">{fieldVal}</a></Typography>
            </div>
        );
    }


    function displayEmails(fieldLabel, fieldVal, classVal) {
        return (
            <div className={classVal}>
                <Typography variant="subtitle2" gutterBottom>{fieldLabel}</Typography>
                {
                    fieldVal.length !== 0 ?
                        fieldVal.map(val => (
                            <Typography variant="body2" gutterBottom><a rel="noopener noreferrer" href={`mailto:${val}`} target="_blank">{val}</a></Typography>
                        )) : ""
                }
            </div>
        );
    }

    return (
        <div>
            <IconButton aria-label="go back" size="medium" onClick={() => props.updateCurrentConnector({})}>
                <ArrowBackIcon fontSize="inherit" />
            </IconButton>
            <Container className="connector-view">
                {
                    participant.title ?
                        <Typography variant="h4" display="block" gutterBottom>
                            {participant.title.join(", ")}
                        </Typography> : ""
                }
                {
                    participant.description ? displayField("Participant Description", participant.description.join(", "), "flow-attributes") : ""
                }
                 {
                    participant.corporateHomepage ? displayURI("Corporate Homepage", participant.corporateHomepage, "flow-attributes") : ""
                }
               {
                     participant.primarySite ? displayField("Site address", participant.primarySite, "flow-attributes") : ""
               }

                    {
                        participant.corporateEmailAddress ? displayEmails("Corporate E-mail", participant.corporateEmailAddress, "inline-attributes") : ""
                    }

                    {
                        participant.labelIndustrialClassification ? displayField("Industrial Classification", participant.labelIndustrialClassification.join(", "), "inline-attributes") : ""
                    }

                    {
                        participant.version ? displayField("Version", participant.version, "inline-attributes") : ""
                    }

                    {
                        participant.memberParticipant ? displayURI("Member participant", participant.memberParticipant.join(", "), "flow-attributes") : ""
                    }
                             <br />

                                {

                                 participant.certification ?
                                <div className="rounded-borders">
                            <Typography variant="h5" gutterBottom align="center">Certification</Typography>

                                     {
                                       participant.certification.description ? displayField("Description", participant.certification.description, "flow-attributes") : ""
                                    }
                                    {
                                       participant.certification.labelCertificationLevel ? displayField("Certification level", participant.certification.labelCertificationLevel, "flow-attributes") : ""
                                    }
                                    {
                                         participant.certification.lastValidDate ? displayField("Valid Until", participant.certification.lastValidDate.split("T")[0], "flow-attributes") : ""
                                    }
                                     {
                                                                             participant.certification.evaluationFacility ? displayField("Evaluation Facility", participant.certification.evaluationFacility, "flow-attributes") : ""
                                                                        }

                                 </div> : ""
                            }

                {
                    participant.memberPerson ?
                        <div className="rounded-borders">
                            <Typography variant="h5" gutterBottom align="center">Associated Members</Typography>
                            {participant.memberPerson.map(person => (
                                <React.Fragment>
                                    {
                                        person.familyName ? displayField("Family name", person.familyName, "flow-attributes") : ""
                                    }
                                    {
                                        person.givenName ? displayField("First name", person.givenName, "flow-attributes") : ""
                                    }
                                    {
                                        person.emailAddress ? displayEmails("E-mail", person.emailAddress, "inline-attributes") : ""
                                    }
                                    {
                                        person.phoneNumber ? displayField("Contact number", person.phoneNumber.join(", "), "inline-attributes") : ""
                                    }
                                    {
                                        person.homepage ? displayURI("Homepage", person.homepage, "inline-attributes") : ""
                                    }
                                </React.Fragment>
                            ))}
                        </div> : ""
                }
            </Container>
        </div>
    );
}

export function ParisFilter(props) {
    return (
        <React.Fragment>
            {/* <MultiList
                componentId="list-2"
                dataField="resources.keywords.keyword"
                style={{
                    marginBottom: 20
                }}
                title="Keyword"
            /> */}
        </React.Fragment>
    )
}

export function SearchParis(props) {
    function handleParisClick(e) {
        props.updateCurrentConnector(e);
    }

    function renderParisData(res) {
        let participant = res.participant;
        let id = res._id;
        return (
            <Card key={res._id} variant="outlined" onClick={() => handleParisClick(res)}>
                <CardActionArea>
                    <CardContent>
                        <Typography variant="caption">
                            {id}
                        </Typography>
                        <Typography variant="h5" component="h2">
                         {
                                            participant.title ?
                                                <Typography variant="h4" display="block" gutterBottom>
                                                    {participant.title.join(", ")}
                                                </Typography> : ""
                          }
                        </Typography>

                                            {
                                                participant.corporateHomepage ?

                                                 <Typography variant="subtitle1" gutterBottom>
                                                 {participant.corporateHomepage}
                                                 </Typography>  : ""
                                            }

                        <Typography variant="body1" gutterBottom>
                         {participant.description}
                         </Typography>
                                    {
                                               participant.certification.labelCertificationLevel ?

                                                 <Typography variant="subtitle1" gutterBottom>
                                                 {participant.certification.labelCertificationLevel}
                                                 </Typography>  : ""
                                            }

                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
    return (
        <ReactiveList
            componentId="result"
            dataField="participant.title"
            pagination={true}
            react={{
                and: ["search"]
            }}
            renderItem={renderParisData}
            size={10}
            style={{
                marginTop: 20
            }}
        />
    )
}