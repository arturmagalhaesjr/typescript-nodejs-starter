import express = require('express');
import session = require("express-session");
import bodyParser = require("body-parser");
import compression = require("compression");
import cors = require("cors");
import dotenv = require('dotenv');
import JWTHandler from "./jwt/JWTHandler";
import {Request, Response} from "express";
const MemoryStore = require('memorystore')(session);
dotenv.config();
const app = express();
const SESSION_SECRET = process.env["SESSION_SECRET"];
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET as string,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    })
}));
app.use((req, res, next) => {
    // Access-Control-Allow-Methods: GET, POST, PUT, DELETE
    // Access-Control-Allow-Headers: Authorization
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});
// health-check
app.get("/health-check", (request: Request, response: Response) => {
    response.send("OK")
});

const apiSuffix = '/api/v0'
const jwtHandler = new JWTHandler();

jwtHandler.handleCheckToken = (token: string) => {
    return new Promise((resolve: any, reject: any) => {
        if (token === process.env.TOKEN_AUTHENTICATION) {
            resolve();
        } else {
            reject();
        }
    });
}
app.post(apiSuffix + '/login', jwtHandler.registry.bind(jwtHandler));
app.get(apiSuffix, jwtHandler.verify.bind(jwtHandler), (req, res) => {
    res.send({
        status: 200,
        message: 'ok'
    })
});
module.exports = app;
