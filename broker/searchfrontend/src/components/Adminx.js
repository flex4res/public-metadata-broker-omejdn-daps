import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, Collapse, IconButton, Table, TableBody, TableCell,
        TableContainer, TableHead, TableRow, Typography,Paper, Button,
        Modal, TextField, InputLabel, Select, FormControl }
        from '@material-ui/core';
import { KeyboardArrowDown as KeyboardArrowDownIcon,
         KeyboardArrowUp as KeyboardArrowUpIcon } from '@material-ui/icons';
import UserForm from './UserForm';
import { connect } from 'react-redux';
import { clearErrors } from '../actions/errorActions';
import { getUsers, addUser, clearUser } from '../actions/userActions';
import Four03 from './error/403';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { user } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small"
                      onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{user.username}</TableCell>
        <TableCell align="center">{user.firstname}</TableCell>
        <TableCell align="center">{user.surname}</TableCell>
        <TableCell align="center">{user.ids_participants}</TableCell>
        <TableCell align="center">{user.role}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                {user.username}
              </Typography>
              <UserForm user={user} open={setOpen}/>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    surname: PropTypes.string,
    ids_participants: PropTypes.string,
    role: PropTypes.string.isRequired.isRequired,
    __v: PropTypes.number,
    _id: PropTypes.string.isRequired
  }).isRequired,
};

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


class Adminx extends Component  {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    addUser: PropTypes.func.isRequired,
    clearUser: PropTypes.func.isRequired
  }

  state = {
    modal:false,
    username: '',
    password: '',
    firstname: '',
    surname: '',
    ids_participants: '',
    role: 'standard',
    msg: null
  };

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.props.clearUser();
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const { username, password, firstname,
      surname, ids_participants, role } = this.state;

    const user = {
      username,
      password,
      firstname,
      surname,
      ids_participants,
      role
    }

    // Attempt to register a new user
    this.props.addUser(user);

  }

  componentDidMount() {
    this.props.getUsers();
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if(error.id === 'ADD_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    if(this.state.modal) {
      if(this.props.user.userAdded) {
        this.toggle();
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { users } = this.props.user;
    const { isAuthenticated, user } = this.props.auth;
    const admin = (
      <Fragment>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Username</TableCell>
                <TableCell align="center">Firstname</TableCell>
                <TableCell align="center">Surname</TableCell>
                <TableCell align="center">IDS Participant</TableCell>
                <TableCell align="center">Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                users.map(
                    user => (<Row key={user.username}
                                  user={user} />)
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Box m={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={this.toggle}>
              Add
          </Button>
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
              {this.state.msg ? (
                  <div className="add-message">{this.state.msg}</div>
              ) : null}

              <form onSubmit={this.onSubmit}>
                <TextField
                  id="add-username"
                  label="Username"
                  variant="outlined"
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
                // required
                />
                <TextField
                  id="add-password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                // required
                />
                <TextField
                  id="add-firstname"
                  label="Firstname"
                  variant="outlined"
                  name="firstname"
                  value={this.state.firstname}
                  onChange={this.onChange}
                />
                <TextField
                  id="add-surname"
                  label="Surname"
                  variant="outlined"
                  name="surname"
                  value={this.state.surname}
                  onChange={this.onChange}
                />
                <FormControl variant="outlined"
                             className={classes.formControl}>
                  <InputLabel htmlFor="ids_participants">
                    IDS Participant
                  </InputLabel>
                  <Select
                    native
                    value={this.state.ids_participants}
                    onChange={this.onChange}
                    label="IDS Participant"
                    inputProps={{
                      name: 'ids_participants',
                      id: 'ids_participants',
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value="CAB">CAB</option>
                    <option value="IHG">IHG</option>
                    <option value="KLM">KLM</option>
                    <option value="WYX">WYX</option>
                  </Select>
                </FormControl>
                <FormControl variant="outlined"
                             className={classes.formControl}>
                  <InputLabel htmlFor="role">
                    Role
                  </InputLabel>
                  <Select
                    native
                    value={this.state.role}
                    onChange={this.onChange}
                    label="Role"
                    inputProps={{
                      name: 'role',
                      id: 'role',
                    }}
                  >
                    <option value="standard">standard</option>
                    <option value="admin">admin</option>
                  </Select>
                </FormControl>
                <div className="addButtonWrapper">
                  <Button type="submit" color="primary" variant="outlined">
                    Add
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </Box>
      </Fragment>
    );
    return (
      <Fragment>
        { isAuthenticated && user.role === "admin" ?
          admin : <Four03 msg="Only admin allowed to see this page"/>}
      </Fragment>
    );
  }
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
    '& .addButtonWrapper': {
      width: '100%',
      // marginLeft: '1ch',
      margin: theme.spacing(1)
    },
    '& .add-message': {
      color: "#B22222"
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 310,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error,
  user: state.user
});

export default connect(
    mapStateToProps,
    { getUsers, addUser, clearUser, clearErrors }
)(withStyles(styles)(Adminx));
