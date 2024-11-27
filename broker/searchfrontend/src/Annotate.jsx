import React from "react";
import TextField from '@material-ui/core/TextField';
import QueryExpansion from "./QueryExpansion";

export default class Annotate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      annotationText: "",
      expandQuery: new QueryExpansion()
    };
    this.handleChange = this.handleChange.bind(this);
    this.timer = null;
  }

  componentDidMount() {
    // retrive physicalLocation of all connectors from fuseki on loading the browser
  }

  handleChange(event) {
    this.setState({ annotationText: event.target.value });
    //fetch the annotation of the text from dbpedia spotlight
    this.state.expandQuery.triggerFetch(event.target.value);
  }

  render() {
    return (
      <div>
        <div>
          <h3>Location-based search</h3>
          <TextField
            id="outlined-multiline-static"
            label="Text"
            multiline
            rows={5}
            value={this.state.annotationText}
            onChange={this.handleChange}
            variant="outlined"
            style={{ width: 800 }}
          />
          {/* <br /> */}
          {/* <Button type="primary" onClick={() => this.annotateText(this.dbpedia_url+this.state.annotationText)}>Annotate</Button> */}
        </div>
        {/* {this.renderTable()} */}
      </div>
    );
  }
}
