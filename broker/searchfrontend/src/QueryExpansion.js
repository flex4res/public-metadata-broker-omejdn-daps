import QueryTemplate from "./QueryTemplate";

export default class QueryExpansion {
  constructor() {
    this.dbpedia_spotlight_url = "https://model.dbpedia-spotlight.org/en/annotate?text=";
    this.dbpedia_sparql_url = "//dbpedia.org/sparql?query=";
    this.timer = null;
    this.annotationResources = [];
  }

  //send the resultant query to dbpedia sparql endpoint
  sparqlQuery(query) {
    fetch(this.dbpedia_sparql_url + encodeURIComponent(query), {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => {
        if (res.status >= 400) {
          console.log("Bad response from server");
        }
        return res.json();
      })
      .then(json => {
        console.log(json);
      })
      .catch(error => {
        console.log(error);
      });
  }

  //annotate the query term using dbpedia spotlight
  annotateText(url) {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => {
        if (res.status >= 400) {
          console.log("Bad response from server");
        }
        return res.json();
      })
      //parse the resultant json to obtain uri of the location
      .then(res => {
        this.annotationResources = res.Resources ? res.Resources : () => { };
        if (this.annotationResources.length > 0) {
          return this.annotationResources.map(function (p, index) {
            return p["@URI"];
          });
        }
      })
      //embed the resultant uri to query template
      .then(uri => {
        if (uri.length > 0) {
          console.log("uri: " + uri);
          let template = new QueryTemplate(uri);
          this.sparqlQuery(template.retrieveSparqlQuery);
        }
      })
      .catch(error => {
        console.log(error);
        this.annotationResources = [];
      });
  }

  triggerFetch(textVal) {
    clearTimeout(this.timer);
    if (textVal.trim().length > 0) {
      this.timer = setTimeout(() => {
        this.annotateText(this.dbpedia_spotlight_url + textVal);
      }, 3000);
    }
  }
}
