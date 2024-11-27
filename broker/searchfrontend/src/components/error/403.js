import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class Four03 extends Component {
  static propTypes = {
    msg: PropTypes.string
  }

  render() {
    return (
      <Fragment>
        403 - { this.props.msg ? this.props.msg : "Not authorized!"}
      </Fragment>
    )
  }
}
