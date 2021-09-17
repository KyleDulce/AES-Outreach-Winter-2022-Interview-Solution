//constants
const port = process.env.PORT || 3000;

console.log("Loading Libraries");

import express from "express";
import http from 'http';
import DoorManager from "./DoorManager";

console.log("Starting Server");

let doorManager = new DoorManager();

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.post("/api/create", (req, res) => {
    const door_data : Array<number> = req.body.doors;

    res.send({AccessToken: doorManager.create(door_data)});
});

app.get("/api/validate", (req, res) => {
    const doorid : number = req.body.doorid;
    const accessToken: string = req.body.accessToken;

    res.send({IsAuthorized: doorManager.validate(accessToken, doorid)})
});

server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});