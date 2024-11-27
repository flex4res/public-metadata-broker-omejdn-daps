import React, { Component, Fragment } from "react";
import Query from "../Query.jsx";

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Four03 from './error/403';

class Maintainer extends Component {
    static propTypes = {
      auth: PropTypes.object.isRequired
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const maintainer = (
          <div className="query-editor">
              <Query />
          </div >
        );
        return (
          <Fragment>
            { isAuthenticated && user.role === "admin" ?
              maintainer : <Four03 msg="Only admin allowed to see this page"/>}
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
)(Maintainer)
