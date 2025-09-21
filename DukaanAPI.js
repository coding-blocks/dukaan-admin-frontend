import axios from 'axios';
import {init, captureMessage} from "@sentry/browser";
import env from "./config";

// Configure axios
axios.defaults.baseURL = env.dukaan_backend.domain;
axios.defaults.withCredentials = true;

// Configure sentry
init({
    dsn: process.env.SENTRY_DSN
})

export {axios}