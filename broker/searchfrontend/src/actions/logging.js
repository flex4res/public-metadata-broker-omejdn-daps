import axios from 'axios';
import { mongodb_handlerURL } from '../urlConfig';

export const logging = (user, component) => {

  const time = new Date().toLocaleString();

  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  const body = JSON.stringify({msg: `User ${user} accessed to Component ${component} at ${time}`});

  axios
    .post(mongodb_handlerURL + '/proxy/logging', body, config)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}
