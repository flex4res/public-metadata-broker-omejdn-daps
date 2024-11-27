import React from "react";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

export default class ResourceClassification extends React.Component {

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

    render() {
        return (
            <div className="connectors-list">
                <React.Fragment>
                    {
                        this.props.classificationResources.map(res => (
                            res.resources.length !== 0 ?
                                <React.Fragment>
                                    {res.resources.map(resource => (
                                        <Link to={'/classification/resource?id=' + encodeURIComponent(resource.resourceID)} target="_blank" >
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
                </React.Fragment>
            </div >
        )
    }
}