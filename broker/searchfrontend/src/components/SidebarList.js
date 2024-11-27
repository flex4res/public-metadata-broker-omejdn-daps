import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItem, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
    SupervisorAccount as SupervisorAccountIcon,
    Dashboard as DashboardIcon,
    Search as SearchIcon,
    QueryBuilder as QueryBuilderIcon,
    DataUsage as DataUsageIcon,
    List as ListIcon
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { logging } from '../actions/logging';
import Typography from '@material-ui/core/Typography';
import iconSet from "../assets/icons/selection.json"
import IcomoonReact, { iconList } from "icomoon-react";
import LinkIcon from '@material-ui/icons/Link';

const styles = theme => ({

    container: {
        display: 'flex',
        alignItems: 'left',
        flexWrap: 'wrap',
        height: '80px',
        width: '100%'
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: '24px',
        fontSize: 18,
    }

})

const BrokerToolTip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: 'rgba(255, 255, 255, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}))(Tooltip);

class SidebarList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1
        };
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        tenant: PropTypes.string
    }

    handleListItemClick = (event, index) => {
        this.setState({
            selectedIndex: index
        })
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const username = user ? user.username : 'Anonymous';
        const { classes } = this.props;
        const selectedIndex = this.state.selectedIndex;

        return (
            <List className="sidebar-list" component="nav">
             {  (this.props.tenant === "eis")
                 ?
                 <ListItem button selected={selectedIndex === 6} onClick={(event) => this.handleListItemClick(event, 6)}>
                    <div className={classes.container}>
                        <Link to="/browse" style={{ textDecoration: 'none' }}>
                            <IcomoonReact iconSet={iconSet} size={25} icon="app"
                                onClick={() => logging(username, "Dashboard")} />
                            <Typography className={classes.text}>Dashboard</Typography>
                        </Link>

                    </div>
                </ListItem>
               :  ""
                }
                {  (this.props.tenant === "eis" || this.props.tenant === "mobids")
                                   ?
                    <ListItem button selected={selectedIndex === 0} onClick={(event) => this.handleListItemClick(event, 0)}>
                            <div className={classes.container}>
                                <Link to="/resources" style={{ textDecoration: 'none' }}>
                                    <IcomoonReact iconSet={iconSet} size={25} icon="aktentasche" />
                                    <Typography className={classes.text}>Resources</Typography>
                                </Link>

                            </div>

                        </ListItem>
                    : ""
                }
                 {  (this.props.tenant === "eis" || this.props.tenant === "mobids")
                 ?
                <ListItem button selected={selectedIndex === 1} onClick={(event) => this.handleListItemClick(event, 1)}>
                    <div className={classes.container}>
                        <Link to="/connector" style={{ textDecoration: 'none' }}>
                            <IcomoonReact iconSet={iconSet} size={25} icon="link" onClick={() => logging(username, "Connectors")} />
                            <Typography className={classes.text}>Connectors</Typography>
                        </Link>

                    </div>
                </ListItem>
                : ""
                }
                             {  (this.props.tenant === "mobids")
                                 ?
                                 <ListItem button selected={selectedIndex === 6} onClick={(event) => this.handleListItemClick(event, 6)}>
                                    <div className={classes.container}>
                                        <Link to="/browse" style={{ textDecoration: 'none' }}>
                                            <IcomoonReact iconSet={iconSet} size={25} icon="app"
                                                onClick={() => logging(username, "Dashboard")} />
                                            <Typography className={classes.text}>Dashboard</Typography>
                                        </Link>

                                    </div>
                                </ListItem>
                               :  ""
                                }
                                 {  (this.props.tenant === "paris")
                                 ?
                                <ListItem button selected={selectedIndex === 7} onClick={(event) => this.handleListItemClick(event, 7)}>
                                    <div className={classes.container}>
                                        <Link to="/participants" style={{ textDecoration: 'none' }}>
                                            <SupervisorAccountIcon onClick={() => logging(username, "Participants")} />
                                            <Typography className={classes.text}>Participants</Typography>
                                        </Link>

                                    </div>
                                </ListItem>
                                : ""
                                }
                {
                    isAuthenticated && user.role === "admin"
                        ? <ListItem button selected={selectedIndex === 2} onClick={(event) => this.handleListItemClick(event, 2)}>
                            <div className={classes.container}>
                                <Link to="/admin" style={{ textDecoration: 'none' }}>
                                    <SupervisorAccountIcon
                                        onClick={() => logging(username, "Admin")} />
                                    <Typography className={classes.text}>Admin</Typography>
                                </Link>

                            </div>
                        </ListItem>
                        : ""
                }

                {
                    (this.props.tenant === "eis" || this.props.tenant === "mobids") && isAuthenticated && user.role === "admin"
                        ? <ListItem button selected={selectedIndex === 3} onClick={(event) => this.handleListItemClick(event, 3)}>
                            <div className={classes.container}>
                                <Link to="/maintainer" style={{ textDecoration: 'none' }}>
                                    <QueryBuilderIcon
                                        onClick={() => logging(username, "Maintainer")} />
                                    <Typography className={classes.text}>Maintainer</Typography>
                                </Link>

                            </div>
                        </ListItem>
                        : ""
                }
                {
                    (this.props.tenant === "eis") && isAuthenticated
                        ? <ListItem button selected={selectedIndex === 4} onClick={(event) => this.handleListItemClick(event, 4)}>
                            <div className={classes.container}>
                                <Link to="/usage-control" style={{ textDecoration: 'none' }}>
                                    <DataUsageIcon
                                        onClick={() => logging(username, "Usage Control")} />
                                    <Typography className={classes.text}>Usage Control</Typography>
                                </Link>

                            </div>
                        </ListItem>
                        : ""
                }
                {
                    (this.props.tenant === "paris") && isAuthenticated
                        ? <ListItem button selected={selectedIndex === 5} onClick={(event) => this.handleListItemClick(event, 5)}>
                            <div className={classes.container}>
                                <Link to="/participant-list" style={{ textDecoration: 'none' }}>
                                    <ListIcon />
                                    <Typography className={classes.text}>Participant List</Typography>
                                </Link>

                            </div>
                        </ListItem>
                        : ""
                }

            </List>

        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(SidebarList));