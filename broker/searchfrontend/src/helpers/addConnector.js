import connectorTemplate from './data/connectorTemplate.json';
import axios from 'axios';

const BROKER_CORE_URL = "http://localhost:8080/connectors/";

const addConnector = () => {
    let config = {
        headers: {
            'ids-senderAgent': 'http://senderAgent.org/',
            'ids-modelVersion': '4.0.0',
            'ids-issued': '2020-09-17T13:20:00Z',
            'ids-issuerConnector': 'https://bab.hessen.connector.de.dg'
        }
    }
    axios
        .post(BROKER_CORE_URL, connectorTemplate, config)
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

export default addConnector;