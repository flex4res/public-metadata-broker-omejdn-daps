import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function createData(
    username,
    email,
    participantURI,
    id,
    corporate_website,
    password,
    other) {
    // If you need to modify row values
    return {
        username,
        email,
        participantURI,
        id,
        corporate_website,
        password,
        other
    };
}

function Row(props) {
    const { row, update, remove } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    let row_change = {
        id: row.id,
        username: row.username,
        email: row.email,
        participantURI: row.participantURI,
        corporate_website: row.corporate_website,
        password: row.password,
        cpassword: row.password,
        other: row.other
    };

    function handleUpdateChange(event) {
        row_change[event.target.name] = event.target.value;
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.participantURI}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <div className="participant-details" participant={row_change.id}>
                                <div className="participant-detail"><InputLabel className="change">ID</InputLabel><Input defaultValue={row_change.id} name="id" onChange={handleUpdateChange} /></div>
                                <div className="participant-detail"><InputLabel className="change">Username</InputLabel><Input defaultValue={row_change.username} name="username" onChange={handleUpdateChange} /></div>
                                <div className="participant-detail"><InputLabel className="change">Email</InputLabel><Input defaultValue={row_change.email} name="email" onChange={handleUpdateChange} /></div>
                                <div className="participant-detail"><InputLabel className="change">Participant URI</InputLabel><Input defaultValue={row_change.participantURI} name="participantURI" onChange={handleUpdateChange} /></div>
                                <div className="participant-detail"><InputLabel className="change">Corporate Website</InputLabel><Input defaultValue={row_change.corporate_website} name="corporate_website" onChange={handleUpdateChange} /></div>
                                <div className="participant-detail"><InputLabel className="change">Password</InputLabel><Input type='password' defaultValue={row_change.password} name="password" onChange={handleUpdateChange} /></div>
                                <div className="participant-detail"><InputLabel className="change">Cpnfirm Password</InputLabel><Input type='password' defaultValue={row_change.cpassword} name="cpassword" onChange={handleUpdateChange} /></div>
                                <div className="participant-detail"><InputLabel className="change">Other details</InputLabel><Input defaultValue={row_change.other} name="other" onChange={handleUpdateChange} /></div>
                                <br />
                                <Button color="primary" variant="outlined" className="submit" onClick={update}>Update</Button>
                                <Button color="primary" variant="outlined" className="submit" onClick={remove} rowId={row.id}>Delete</Button>
                                <br /><br /><br />
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        participantURI: PropTypes.string.isRequired
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
        }
    },
    '& .error-message': {
        color: "#B22222"
    }
});

class ParticipantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            updates: [],
            open: false,
            id: "",
            name: "",
            email: "",
            participant_uri: "",
            corporate_website: "",
            password: "",
            cpassword: "",
            other_details: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        // call backend for data here and create rows
        let participants = [{
            id: 'e1123',
            name: 'Jim Corbett',
            email: 'JimCorbett@gmail.com',
            participant_uri: 'www.dummyuri.com',
            corporate_website: 'www.dummy.com',
            password: 'password',
            other: 'other participant attributes'
        }, {
            id: 'r1233',
            name: 'Martha Stewart',
            email: 'MarthaStewart@gmail.com',
            participant_uri: 'www.dummyuri.com',
            corporate_website: 'www.dummy.com',
            password: 'password',
            other: 'other participant attributes'
        }, {
            id: 's3223',
            name: 'Phil Howard',
            email: 'PhilHoward@gmail.com',
            participant_uri: 'www.dummyuri.com',
            corporate_website: 'www.dummy.com',
            password: 'password',
            other: 'other participant attributes'
        }];

        let rows = []
        for (var participant of participants) {
            rows.push(createData(
                participant.name,
                participant.email,
                participant.participant_uri,
                participant.id,
                participant.corporate_website,
                participant.password,
                participant.other
            ))
        }
        this.setState({
            rows: rows,
            update: participants
        });
    }

    handleOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        this.setState({ open: false });
    };

    handleChange(event) {
        console.log("handlechange --");

        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        let updated_rows = this.state.rows;

        if (this.state.password !== this.state.cpassword) {
            document.getElementById("error-message").innerHTML = "Passwords do not match!";
            event.preventDefault();
            return;
        }

        updated_rows.push(
            createData(
                this.state.name,
                this.state.email,
                this.state.participant_uri,
                this.state.id,
                this.state.corporate_website,
                this.state.password,
                this.state.other_details
            )
        );

        this.setState({
            rows: updated_rows,
            id: "",
            name: "",
            email: "",
            participant_uri: "",
            corporate_website: "",
            password: "",
            cpassword: "",
            other_details: ""
        });
        this.handleClose();

        event.preventDefault();
    }

    handleUpdate(event) {
        // let form = event.target.parentNode;
        let details = event.target.closest(".participant-details").children
        let updated_row = {
            id: "",
            name: "",
            email: "",
            participant_uri: "",
            corporate_website: "",
            password: "",
            cpassword: "",
            other_details: ""
        };
        let updated_rows = this.state.rows;

        for (var detail of details) {
            if (detail.className === "participant-detail") {
                updated_row[detail.children[1].children[0].name] = detail.children[1].children[0].value;
            }
        }
        for (var index in updated_rows) {
            if (updated_rows[index].id === updated_row.id) {
                updated_rows[index] = updated_row;
            }
        }

        this.setState({
            row: updated_rows
        });
    }

    handleDelete(event) {
        let sure = window.confirm("Are you sure?");
        if (sure === false) {
            return;
        }
        console.log("handle delete row");
        console.log(event.target.attributes.rowId)

        let rowId = event.target.attributes.rowId ? event.target.attributes.rowId.value : event.target.parentNode.attributes.rowId.value;
        let updated_rows = this.state.rows;
        console.log(updated_rows);

        for (var row of updated_rows) {
            if (row.id === rowId) {
                updated_rows = updated_rows.filter(function (el) { return el.id !== rowId; });
            }
        }
        console.log(updated_rows);

        this.setState({
            rows: updated_rows
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="query-editor">
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Participant URI</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map((row) => (
                                <Row key={row.name} row={row} update={this.handleUpdate} remove={this.handleDelete} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br />
                <div><Button color="primary" variant="outlined" className="submit right" onClick={this.handleOpen.bind(this)}>Add</Button></div>
                <br /><br /><br />
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose.bind(this)}
                    onAfterOpen={() => this.myEl && this.myEl.focus()}
                >
                    <div
                        style={getModalStyle()}
                        className={classes.paper}
                        ref={el => { this.myEl = el; }}
                    // tabIndex="-1"
                    // onKeyDown={this.handleKeyInput}
                    >

                        <h3>Add New Participant:</h3>
                        <div class="error-message" id="error-message"></div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="participant-details">outlined
                                <div><TextField label="ID" name="id" value={this.state.id} onChange={this.handleChange} /></div>
                                <div><TextField label="Name" name="name" value={this.state.name} onChange={this.handleChange} /></div>
                                <div><TextField label="Email" name="email" value={this.state.email} onChange={this.handleChange} /></div>
                                <div><TextField label="Participant URI" name="participant_uri" value={this.state.participant_uri} onChange={this.handleChange} /></div>
                                <div><TextField label="Corporate Website" name="corporate_website" value={this.state.corporate_website} onChange={this.handleChange} /></div>
                                <div><TextField type='password' label="Password" name="password" value={this.state.password} onChange={this.handleChange} /></div>
                                <div><TextField type='password' label="Confirm Password" name="cpassword" value={this.state.cpassword} onChange={this.handleChange} /></div>
                                <div><TextField label="Other details" name="other_details" value={this.state.other_details} onChange={this.handleChange} /></div>
                                <br />
                                <Button type="submit" color="primary" variant="outlined" className="submit">Submit</Button>
                                <br /><br /><br />
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        )
    }
}


ParticipantList.propTypes = {
    classes: PropTypes.object.isRequired,
};

const ParticipantListWrapped = withStyles(styles)(ParticipantList);

export default ParticipantListWrapped;
