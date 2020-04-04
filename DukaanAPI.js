import axios from 'axios';
import env from "./config";

// Configure axios
axios.defaults.baseURL = env.dukaan_backend.domain;
axios.defaults.withCredentials = true;


export {axios}
