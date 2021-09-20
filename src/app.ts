//constants
const port = process.env.PORT || 3000;

//load libraries
console.log("Loading Libraries");

import express from "express";
import http from 'http';
import DoorManager from "./DoorManager";

//start server
console.log("Starting Server");

//open express
const app = express();
const server = http.createServer(app);

app.use(express.json());

app.post("/api/create", (req, res) => {
    const door_data: Array<number> = req.body.doors;
    const expiry: number = req.body.expiry;

    res.send({ AccessToken: doorManager.create(door_data, expiry) });
});

app.post("/api/validate", (req, res) => {
    const doorid: number = req.body.doorid;
    const accessToken: string = req.body.accessToken;

    res.send({ IsAuthorized: doorManager.validate(accessToken, doorid) })
});

//Start Door Manager
const doorManager = new DoorManager(() => {
    //Open http server when Door manager completed opening database
    server.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    });
});