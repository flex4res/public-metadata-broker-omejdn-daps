import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Login from './Login';
import Logout from './Logout';

class LoginOrLogout extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const guestLinks =  <Login />;
    const authLinks = (
      <Fragment>
        <span>
          <strong>{ user? `Hi ${user.username} `: ''}&nbsp;</strong>
        </span>
        <Logout />
      </Fragment>
    );

    return (
      <Fragment>
        { isAuthenticated ? authLinks:guestLinks}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(LoginOrLogout)
