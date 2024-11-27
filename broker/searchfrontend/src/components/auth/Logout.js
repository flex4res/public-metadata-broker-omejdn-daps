import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {

    backgroundColor: '#E96A22', color: '#FFF', fontWeight: 'bold', borderRadius: 32,
    boxShadow: 'none',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#FDF0E8',
      color: '#EF935E',
      boxShadow: 'none',
    }

  }
});

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  }

  render() {
    const { classes } = this.props;
    return (
      <Button className={classes.button}
        onClick={this.props.logout}>Logout</Button>
    )
  }
}

export default connect(
  null,
  { logout }
)(withStyles(styles)(Logout))
