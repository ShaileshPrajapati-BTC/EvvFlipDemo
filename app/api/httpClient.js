import axios from 'axios' 
import CONFIG from '../config/config.js';
// var MockAdapter = require('axios-mock-adapter');

// // This sets the mock adapter on the default instance
// var mock = new MockAdapter(axios);

// // Mock any GET request to /users
// // arguments for reply are (status, data, headers)
// mock.onGet('http://localhost:3000/api/todos').reply(200, {
//   todos: [
//     {title: "first", description: "first", date: new Date()},
//     {title: "second", description: "second", date: new Date()}
//   ]
// });

// mock.onPost('http://localhost:3000/api/todos').reply(200, {
//   todo: {title: "hello", description: "hello", date: new Date()}
// });


//Create a Http Client using Axios. Further modifications in this layer can be done later like Authorization.

const base_url = CONFIG.BASE_URL

const post = (url = '', data = '', config = {}) => {
  return axios.post(url, data, config)
}

const get = (url='', data='', config={}) => {
  config.params = data;
  config.method = "get";
  return axios.get(url,config)
}

const put = (url = '', data = '', config = {}) => {
  return axios.put(url, data, config)
}

//Cannot contain a delete method - Cause delete is a keyword.

const del = (url = '', config = {}) => {
  return axios.delete(url, config)
}

//Encapsulating in a JSON object

const HttpClient = {
  post,
  get,
  put,
  delete: del,
  base_url
}

export {HttpClient}