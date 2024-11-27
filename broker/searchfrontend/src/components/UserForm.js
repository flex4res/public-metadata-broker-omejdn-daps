import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, InputLabel,
        Button, Select, Modal } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { updateUser, deleteUser } from '../actions/userActions';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '40ch',
    },
    '& .deleteButtonWrapper': {
      width: '100%',
      // marginLeft: '1ch',
      margin: theme.spacing(1)
    }
  }
});

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.user._id,
      username: props.user.username,
      firstname: props.user.firstname,
      surname: props.user.surname,
      ids_participants: props.user.ids_participants,
      role: props.user.role,
      modal: false
    };

  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onDelete = id => {
    this.props.deleteUser(id);
  }

  onUpdate = user => {
    const { id, firstname, surname, ids_participants, role} = this.state;

    user = {
      id,
      firstname,
      surname,
      ids_participants,
      role
    }
    this.props.updateUser(user);
    this.props.open(false);
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Box margin={1}>
          <div className="participant-details"
               participant={this.state.username}>
              <div className="participant-detail">
                <InputLabel className="change">Firstname</InputLabel>
                <Input defaultValue={this.state.firstname} name="firstname"
                       onChange={this.onChange} />
              </div>
              <div className="participant-detail">
                <InputLabel className="change">Surname</InputLabel>
                <Input defaultValue={this.state.surname} name="surname"
                       onChange={this.onChange} />
              </div>
              <div className="participant-detail">
                <InputLabel className="change" htmlFor="ids_participants">
                  IDS Participant
                </InputLabel>
                <Select
                  native
                  value={this.state.ids_participants}
                  onChange={this.onChange}
                  inputProps={{
                    name: 'ids_participants',
                    id:'ids_participants'
                  }}
                  style={{minWidth:200}}
                >
                  <option aria-label="None" value="" />
                  <option value="CAB">CAB</option>
                  <option value="IHG">IHG</option>
                  <option value="KLM">KLM</option>
                  <option value="WYX">WYX</option>
                </Select>
              </div>
              <div className="participant-detail">
                <InputLabel className="change" htmlFor="role">
                  Role
                </InputLabel>
                <Select
                  native
                  value={this.state.role}
                  onChange={this.onChange}
                  inputProps={{
                    name: 'role',
                    id:'role'
                  }}
                  style={{minWidth:200}}
                >
                  <option value="standard">standard</option>
                  <option value="admin">admin</option>
                </Select>
              </div>
              <Box pb={5}>
                <Button color="primary" variant="outlined" className="submit"
                        onClick={this.onUpdate.bind(this, this.props.user)}>Update
                </Button>
                {
                  this.props.user._id === this.props.auth.user._id ?
                  null :   <Button color="primary" variant="outlined" className="submit"
                            onClick={this.toggle}>Delete
                    </Button>
                }
                <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={this.state.modal}
                  onClose={this.toggle}
                >
                  <div
                    style={getModalStyle()}
                    className={classes.paper}
                    ref={el => { this.myEl = el; }}
                  >
                    <div>
                      Are you sure to delete this user?
                    </div>
                      <Box mt={5}>
                        <Button type="submit"
                            color="primary"
                            variant="outlined"
                            onClick={this.onDelete.bind(this, this.state.id)}>
                          Delete
                        </Button>
                      </Box>
                  </div>
                </Modal>
              </Box>
          </div>
      </Box>
    );
  }
}

UserForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    surname: PropTypes.string,
    ids_participants: PropTypes.string,
    role: PropTypes.string.isRequired,
    __v: PropTypes.number,
    _id: PropTypes.string.isRequired
  }).isRequired,
  open: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { updateUser, deleteUser }
)(withStyles(styles)(UserForm))
