import React from "react";
import {
    SelectedFilters,
    DataSearch,
    MultiList
} from "@appbaseio/reactivesearch";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { propertyArray } from '../propertyArray';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { ReactiveList } from "@appbaseio/reactivesearch";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { Divider } from "@material-ui/core";

export default class SearchFhgResources extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        };
    }

    handleSearch = value => {
        this.setState({
            searchValue: value
        }, () => {
            window.localStorage.setItem('SearchValue', this.state.searchValue);
        });
    };

    processResourceID = id => {
        let resId;
        try {
            resId = new URL(id);
        }
        catch (_) {
            return id;
        }
        return resId.pathname.split('/').pop();
    }

    componentDidMount() {
        this.setState({
            searchValue: window.localStorage.getItem('SearchValue')
        })
    }

    renderFhgData = ({ data }) => {
        return (
            <React.Fragment>
                {
                    data.map(res => (
                        res.resources.length !== 0 ?
                            <React.Fragment>
                                {res.resources.map(resource => (
                                    <Link to={'/query/resource?id=' + encodeURIComponent(resource.resourceID)} >
                                        <Card key={resource.resourceID} variant="outlined">
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography variant="caption" style={{ color: '#009374' }}>
                                                        {resource.researchDT ? resource.researchDT.labelResearchDataType : ""}
                                                    </Typography>
                                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                                        {resource.title_en || resource.title || resource.title_de}
                                                    </Typography>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {resource.description_en || resource.description || resource.description_de}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        License: {resource.labelStandardLicense ? resource.labelStandardLicense.map(val => val.split("_").join(" "))
                                                            :
                                                            resource.customLicense ? resource.customLicense : ""
                                                        }
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Date of Creation: {resource.createdDate ? resource.createdDate.split(" ")[0] : ""}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Modified Date: {resource.modifiedDate ? resource.modifiedDate.split(" ")[0] : ""}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                ))}
                            </React.Fragment>
                            : ""
                    ))
                }
            </React.Fragment >
        );
    }

    render() {
        let tenant = process.env.REACT_APP_TENANT || 'eis';
        tenant = tenant.toLowerCase();
        let propsFromApp = this.props;
        return (
            <div className="connectors-list">
                <React.Fragment>
                    <DataSearch
                        componentId="search"
                        dataField={propertyArray[tenant]['dataField']}
                        fieldWeights={propertyArray[tenant]['fieldWeights']}
                        debounce={100}
                        highlight={true}
                        highlightField={propertyArray[tenant]['highlightField']}
                        style={{
                            marginBottom: 20
                        }}
                        value={this.state.searchValue}
                        autosuggest={true}
                        URLParams={true}
                        queryFormat="or"
                        onChange={this.handleSearch}
                        onValueChange={
                            function (value) {
                                if (propsFromApp.location.pathname.indexOf('query') === -1) {
                                    propsFromApp.history.push("/query");
                                }
                            }
                        }
                    />
                    <SelectedFilters />
                    <Grid container>
                        {/* List of resources in the /query page */}
                        <Grid item className="conn-list" lg={9} md={9} xs={12}>
                            <ReactiveList
                                componentId="result"
                                dataField="resources.mainTitle.keyword"
                                pagination={true}
                                URLParams={true}
                                react={{
                                    and: ["search", "list-4", "list-5", "list-6", "list-7"]
                                }}
                                render={this.renderFhgData}
                                size={10}
                                style={{
                                    marginTop: 20
                                }}
                                sortOptions={[
                                    {
                                        label: "Most Relevant",
                                        dataField: "resources.title.keyword" || "resources.mainTitle.keyword",
                                        sortBy: "desc"
                                    },
                                    {
                                        label: "Modified (data set) - Most recent first",
                                        dataField: "resources.representation.unparsedDatasetModified",
                                        sortBy: "desc"
                                    },
                                    {
                                        label: "Modified (data set) - Oldest first",
                                        dataField: "resources.representation.unparsedDatasetModified",
                                        sortBy: "asc"
                                    },
                                    {
                                        label: "Size - low to high",
                                        dataField: "resources.representation.instance.bytesize",
                                        sortBy: "asc"
                                    },
                                    {
                                        label: "Size - high to low",
                                        dataField: "resources.representation.instance.bytesize",
                                        sortBy: "desc"
                                    }
                                ]}
                            />
                        </Grid>
                        {/* Filter section on the right-side of /query page */}
                        <Grid item lg={3} md={3} xs={12}>
                            <Card>
                                <React.Fragment>
                                    <Divider />
                                    <MultiList
                                        componentId="list-4"
                                        dataField="resources.fraunhoferProjectResource.fhgInstitute.instituteName.keyword"
                                        style={{
                                            margin: 20
                                        }}
                                        title="Institute"
                                        URLParams={true}
                                    />
                                    <Divider />
                                    <MultiList
                                        componentId="list-5"
                                        dataField="resources.researchDT.labelResearchDataType.keyword"
                                        style={{
                                            margin: 20
                                        }}
                                        title="Resource Data Type/Category"
                                        URLParams={true}
                                    />
                                    <Divider />
                                    <MultiList
                                        componentId="list-6"
                                        dataField="resources.labelLanguage.keyword"
                                        style={{
                                            margin: 20
                                        }}
                                        title="Data Set Language"
                                        URLParams={true}
                                    />
                                    <Divider />
                                    <MultiList
                                        componentId="list-7"
                                        dataField="resources.representation.labelMediatype.keyword"
                                        style={{
                                            margin: 20
                                        }}
                                        title="Data Format"
                                        URLParams={true}
                                    />
                                </React.Fragment>
                            </Card>
                        </Grid>
                    </Grid>
                </React.Fragment>
            </div >
        )
    }
}