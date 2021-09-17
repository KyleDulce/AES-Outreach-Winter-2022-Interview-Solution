//constants
const port = process.env.PORT || 3000;

console.log("Loading Libraries");

import express from "express";
import http from 'http';

console.log("Starting Server");

const app = express();
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});