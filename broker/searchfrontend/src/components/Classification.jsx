import React from 'react';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import ResourceClassification from './ResourceClassification';

const styles = theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
});

class Classification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classificationLevels: [],
            domainDataDropdown: [],
            fieldsDataDropdown: [],
            subFieldsDataDropDown: [],
            selectedDomain: '',
            selectedField: '',
            selectedSubField: '',
            isSearchButtonClicked: false,
            resourceClassificationIds: [],
            resourcesFromES: [],
            resourceSelected: {}
        };
    }

    async componentDidMount() {
        //get the classification values from ElasticSearch
        /***/
        axios
            .get(this.props.es_url + "/classifications/_search?size=1000&pretty")
            .then(response => {
                if (response.status === 200) {
                    const cl_levels = response.data.hits.hits;
                    this.setState({
                        classificationLevels: cl_levels
                    })
                    cl_levels.map(lev1 => {
                        //first level in science metric classification has no broader/upper attribute
                        if (!lev1._source.hasOwnProperty('broader')) {
                            let level1 = { displayName: lev1._source.englishLabel.split("@")[0], value: lev1._source.classificationId };
                            this.setState(prevState => ({
                                domainDataDropdown: prevState.domainDataDropdown.concat(level1).sort((a, b) => a.displayName.localeCompare(b.displayName))
                            }))
                        }
                        return null;
                    })
                }
                else {
                    console.log("Could not retrieve the classification indexes");
                }
            })
            .catch(err => {
                console.log("An error occured: " + err);
            })

        axios
            .get(this.props.es_url + "/fhgresources/_search?size=1000&pretty", {
                data: {
                    query: {
                        match_all: {}
                    }
                }
            })
            .then(response => {
                if (response.status === 200) {
                    // console.log("Obtained data " + JSON.stringify(response.data.hits.hits) + " length: " + response.data.hits.hits.length);
                    this.setState({
                        resourcesFromES: response.data.hits.hits
                    })
                    let resource_classification_id = [];
                    response.data.hits.hits.map(dat => {
                        let individual_data = dat._source.resources;
                        individual_data.map(attr => {
                            if (attr.fraunhoferProjectResource && attr.fraunhoferProjectResource.wissenschaft_klassificakation) {
                                let temp_res = { resID: attr.resourceID, clID: attr.fraunhoferProjectResource.wissenschaft_klassificakation }
                                resource_classification_id.push(temp_res);
                            }
                            return null;
                        })
                        return null;
                    })
                    this.setState({
                        resourceClassificationIds: resource_classification_id
                    })
                }
            })
            .catch(err => {
                console.log("An error occured: " + err);
            })

        /**DEBUG LOCAL - delete from here 
        if (classification_level.status === 200) {
            const cl_levels = classification_level.data.hits.hits;
            this.setState({
                classificationLevels: cl_levels
            })
            cl_levels.map(lev1 => {
                //first level in science metric classification has no broader/upper attribute
                if (!lev1._source.hasOwnProperty('broader')) {
                    let level1 = { displayName: lev1._source.englishLabel.split("@")[0], value: lev1._source.classificationId };
                    this.setState(prevState => ({
                        domainDataDropdown: prevState.domainDataDropdown.concat(level1).sort((a, b) => a.displayName > b.displayName)
                    }))
                }
                return null;
            })
        }
        else {
            console.log("Could not retrieve the classification indexes");
        }

        //getting data from ES
        this.setState({
            resourcesFromES: dataES
        })
        let resource_classification_id = [];
        dataES.map(dat => {
            let individual_data = dat._source.resources;
            individual_data.map(attr => {
                if (attr.fraunhoferProjectResource && attr.fraunhoferProjectResource.wissenschaft_klassificakation) {
                    let temp_res = { resID: attr.resourceID, clID: attr.fraunhoferProjectResource.wissenschaft_klassificakation }
                    resource_classification_id.push(temp_res);
                }
                return null;
            })
            return null;
        })
        await this.setState({
            resourceClassificationIds: resource_classification_id
        })*/
        /**delete until here */
    }

    handleDomainChange = (event) => {
        this.setState({
            selectedDomain: event.target.value,
            fieldsDataDropdown: [],
            selectedField: '',
            subFieldsDataDropDown: [],
            selectedSubField: '',
            isSearchButtonClicked: false
        });
        const temp_domain = this.state.classificationLevels.find(obj => obj._source.classificationId === event.target.value);
        temp_domain._source.narrowers.map(lev2 => {
            let level2 = { displayName: lev2.englishLabel.split("@")[0], value: lev2.classificationId };
            this.setState(prevState => ({
                fieldsDataDropdown: prevState.fieldsDataDropdown.concat(level2).sort((a, b) => a.displayName.localeCompare(b.displayName))
            }))
            return null;
        });
    }

    handleFieldChange = (event) => {
        this.setState({
            selectedField: event.target.value,
            subFieldsDataDropDown: [],
            selectedSubField: '',
            isSearchButtonClicked: false
        });
        const temp_field = this.state.classificationLevels.find(obj => obj._source.classificationId === event.target.value);
        temp_field._source.narrowers.map(lev3 => {
            let level3 = { displayName: lev3.englishLabel.split("@")[0], value: lev3.classificationId };
            this.setState(prevState => ({
                subFieldsDataDropDown: prevState.subFieldsDataDropDown.concat(level3).sort((a, b) => a.displayName.localeCompare(b.displayName))
            }))
            return null;
        })
    }

    handleSubFieldChange = (event) => {
        this.setState({
            selectedSubField: event.target.value,
            isSearchButtonClicked: false
        });
    }

    handleSearch = (event) => {
        this.setState({ isSearchButtonClicked: true });
    }

    handleReset = (event) => {
        this.setState({
            isSearchButtonClicked: false,
            selectedDomain: '',
            selectedField: '',
            fieldsDataDropdown: [],
            selectedSubField: '',
            subFieldsDataDropDown: []
        })
    }

    getExploreLevelValue = () => {
        if (this.state.selectedSubField.length !== 0)
            return this.state.selectedSubField;
        if (this.state.selectedField.length !== 0)
            return this.state.selectedField;
        if (this.state.selectedDomain.length !== 0)
            return this.state.selectedDomain;
    }

    getAllExplorationLevels = (val) => {
        let all_levels = [];
        this.state.classificationLevels.find(obj => {
            if (obj._source.classificationId === val) {
                if (obj._source.narrowers) {
                    obj._source.narrowers.map(arr => {
                        all_levels.push(arr.classificationId);
                        val = arr.classificationId;
                        return null;
                    })
                }
            }
            return null;
        })
        return all_levels;
    }

    prepareClassificationExploration = () => {
        //which level was selected
        const explore_level_value = this.getExploreLevelValue();

        /** two arrays to store all the exploration values of a level. 
        "explorations" variable stores only the immediate narrowers i.e., from its current level to the next level. 
        "all_explorations" stores all narrowers from the current level to its root level.*/

        let all_explorations = [explore_level_value];
        let explorations = this.getAllExplorationLevels(explore_level_value);

        if (explorations.length !== 0) {
            all_explorations = all_explorations.concat(explorations);
            explorations.map(exp => {
                let temp_arr = this.getAllExplorationLevels(exp);
                if (temp_arr.length !== 0) all_explorations = all_explorations.concat(temp_arr);
                return null;
            });
        }
        //filter duplicates
        all_explorations = Array.from(new Set(all_explorations));
        // console.log("Narrowers: " + JSON.stringify(all_explorations) + " \n Count: " + all_explorations.length);

        //check for the classification id's in resources with that of narrowers
        let exploreResource = [];
        this.state.resourceClassificationIds.map(resObj => {
            resObj.clID.find(cl => {
                if (all_explorations.indexOf(cl) >= 0) {
                    exploreResource.push(resObj.resID);
                }
                return null;
            })
            return null;
        })
        //filter duplicates
        exploreResource = Array.from(new Set(exploreResource));
        return exploreResource;
    }

    renderSearchResults = () => {
        if (this.state.isSearchButtonClicked) {
            //atleast the first level needs to be selected to carry out the exploration functionality
            if (this.state.selectedDomain === '' || this.state.selectedDomain === null) {
                return <p>Please select a domain to explore</p>
            }
            const exploreResourcesById = this.prepareClassificationExploration();
            // console.log("Final resources to explore: " + JSON.stringify(exploreResourcesById) + " length: " + exploreResourcesById.length);
            // console.log("Data from ES: " + JSON.stringify(this.state.resourcesFromES) + " length: " + this.state.resourcesFromES.length);
            let resourceAsWhole = [];
            exploreResourcesById.map(expRes => {
                this.state.resourcesFromES.find(res => {
                    if (expRes === res._id) {
                        // console.log("found resource: " + JSON.stringify(res));
                        resourceAsWhole.push(res._source);
                    }
                    return null;
                })
                return null;
            })
            // console.log("array of resources: " + JSON.stringify(resourceAsWhole) + " length: " + resourceAsWhole.length);

            if (resourceAsWhole.length === 0)
                return <p>No resources to display</p>
            else {
                return <ResourceClassification classificationResources={resourceAsWhole} />
            }
        }
        else
            return ""
    }

    render() {
        const { classes } = this.props;
        return (
            <div >
                <Typography variant="h5" display="block" gutterBottom align="center">Science Classification</Typography>
                <div className="classification-dropdown">
                    <div>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Typography variant="subtitle1" gutterBottom align="left">Domain</Typography>
                            <Select
                                id="demo-simple-select"
                                displayEmpty
                                variant="outlined"
                                value={this.state.selectedDomain}
                                onChange={this.handleDomainChange}
                            >
                                <MenuItem value="" disabled>Please select a Domain</MenuItem>
                                {
                                    this.state.domainDataDropdown.map(e => {
                                        return <MenuItem value={e.value} key={e.value}>{e.displayName}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Typography variant="subtitle1" gutterBottom align="left">Field</Typography>
                            <Select
                                id="demo-simple-select"
                                displayEmpty
                                variant="outlined"
                                value={this.state.selectedField}
                                onChange={this.handleFieldChange}
                            >
                                <MenuItem value="" disabled>Please select a Field</MenuItem>
                                {
                                    this.state.fieldsDataDropdown.map(e => {
                                        return <MenuItem value={e.value} key={e.value}>{e.displayName}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Typography variant="subtitle1" gutterBottom align="left">Sub field</Typography>
                            <Select
                                id="demo-simple-select"
                                displayEmpty
                                variant="outlined"
                                value={this.state.selectedSubField}
                                onChange={this.handleSubFieldChange}
                            >
                                <MenuItem value="" disabled>Please select a Subfield</MenuItem>
                                {
                                    this.state.subFieldsDataDropDown.map(e => {
                                        return <MenuItem value={e.value} key={e.value}>{e.displayName}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <br />
                <Grid container justify="center">
                    <span>
                        <Button href="#" color="primary" variant="outlined" onClick={this.handleSearch} style={{ justifyContent: "center", minWidth: "100px", marginRight: "10px" }}>
                            Explore
                        </Button>
                    </span>
                    <span>
                        <Button href="#" color="primary" variant="outlined" onClick={this.handleReset} style={{ justifyContent: "center", minWidth: "100px" }}>
                            Reset
                        </Button>
                    </span>
                </Grid>
                <br />
                <div>
                    {this.renderSearchResults()}
                </div>

            </div >
        )
    }
}

export default withStyles(styles)(Classification);