import axios from "axios";

const HttpRequest = axios.create({
  baseURL: process.env.REACT_APP_DOMAIN_API,
});

HttpRequest.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default HttpRequest;
