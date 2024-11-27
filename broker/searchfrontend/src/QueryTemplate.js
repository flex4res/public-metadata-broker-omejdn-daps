/**
 * The following query is used as a template to insert the connector's physicalLocation and the search term used in order to provide the semantic capabilities of handling a query
prefix dct: <http://purl.org/dc/terms/>
prefix skos: <http://www.w3.org/2004/02/skos/core#>

select distinct ?connectorDesc ?queryTerm where {
    {
        # connectorDesc --subject--> cat <--subject-- queryTerm

        ?connectorDesc dct:subject ?cat .
        ?queryTerm dct:subject ?cat .
        FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )
        FILTER ( ?queryTerm IN (<http://dbpedia.org/resource/Germany> ) ).
    } UNION {
        # connectorDesc --p--> something --subject--> cat <--subject-- queryTerm

        ?connectorDesc ?p ?o .
        ?o dct:subject ?cat1 .
        ?queryTerm dct:subject ?cat1 .
        FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )
        FILTER ( ?queryTerm IN (<http://dbpedia.org/resource/Germany> ) ).
    } UNION {
        # connectorDesc --p--> something --subject--> cat1 --broader--> cat2 <--subject-- queryTerm

        ?connectorDesc ?p ?o .
        ?o dct:subject ?cat1 .
        ?queryTerm dct:subject ?cat2 .
        ?cat1 skos:broader ?cat2 .
        FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )
        FILTER ( ?queryTerm IN (<http://dbpedia.org/resource/Germany> ) )
    } UNION {
        # connectorDesc --subject--> cat1 --broader--> cat2 <--subject-- queryTerm

        ?connectorDesc dct:subject ?cat1 .        
        ?queryTerm dct:subject ?cat2 .
        ?cat1 skos:broader ?cat2 .
        FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )
        FILTER ( ?queryTerm IN (<http://dbpedia.org/resource/Germany> ) )
    } UNION {
        # connectorDesc --p1--> something1 --subject--> cat1 --broader--> cat2 <--subject-- something2 <--p2-- queryTerm

        ?connectorDesc ?p1 ?o1 .
        ?o1 dct:subject ?cat1 .
        ?queryTerm ?p2 ?o2 .
        ?o2 dct:subject ?cat2 .
        ?cat1 skos:broader ?cat2 .
        FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )
        FILTER ( ?queryTerm IN (<http://dbpedia.org/resource/Germany> ) )
    }
}
 */

export default class QueryTemplate {
  constructor(uri) {
    this.template =
      "select distinct ?connectorDesc ?queryTerm where {\n" +
      "{\n" +
      "?connectorDesc dct:subject ?cat .\n" +
      "?queryTerm dct:subject ?cat .\n" +
      "FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )\n" +
      "FILTER ( ?queryTerm IN (<" +
      uri +
      "> ) ).\n" +
      "} UNION {\n" +
      "?connectorDesc ?p ?o .\n" +
      "?o dct:subject ?cat1 ." +
      "?queryTerm dct:subject ?cat1 .\n" +
      "FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )\n" +
      "FILTER ( ?queryTerm IN (<" +
      uri +
      "> ) ).\n" +
      "} UNION {\n" +
      "?connectorDesc ?p ?o .\n" +
      "?o dct:subject ?cat1 .\n" +
      "?queryTerm dct:subject ?cat2 .\n" +
      "?cat1 skos:broader ?cat2 .\n" +
      "FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )" +
      "FILTER ( ?queryTerm IN (<" +
      uri +
      "> ) ).\n" +
      "} UNION {\n" +
      "?connectorDesc dct:subject ?cat1 .\n" +
      "?queryTerm dct:subject ?cat2 ." +
      "?cat1 skos:broader ?cat2 .\n" +
      "FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )\n" +
      "FILTER ( ?queryTerm IN (<" +
      uri +
      "> ) ).\n" +
      "} UNION {\n" +
      "?connectorDesc ?p1 ?o1 .\n" +
      "?o1 dct:subject ?cat1 .\n" +
      "?queryTerm ?p2 ?o2 .\n" +
      "?o2 dct:subject ?cat2 .\n" +
      "?cat1 skos:broader ?cat2 .\n" +
      "FILTER ( ?connectorDesc  IN (<http://dbpedia.org/resource/Sankt_Augustin>, <http://dbpedia.org/resource/Bonn> ) )\n" +
      "FILTER ( ?queryTerm IN (<" +
      uri +
      "> ) ).\n" +
      "}\n" +
      "}";
  }

  get retrieveSparqlQuery() {
    return this.template;
  }
}
