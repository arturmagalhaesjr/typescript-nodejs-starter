import session = require('express-session');
import bodyParser = require('body-parser');
import compression = require('compression');
import dotenv = require('dotenv');
import JWTHandler from './jwt/JWTHandler';
import { HelloWorldController } from './controller/HelloWorldController';
import { Request, Response } from 'express';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
const MemoryStore = require('memorystore')(session);
const jwtHandler = new JWTHandler((token: string) => {
    return new Promise((resolve: any, reject: any) => {
        if (token === process.env.TOKEN_AUTHENTICATION) {
            resolve();
        } else {
            reject();
        }
    });
});
dotenv.config();
const apiSuffix = '/api/v0';
const app = createExpressServer({
    cors: true,
    routePrefix: apiSuffix,
    authorizationChecker: jwtHandler.verify.bind(jwtHandler),
    controllers: [HelloWorldController], // we specify controllers we want to use
});
const SESSION_SECRET = process.env['SESSION_SECRET'];
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET as string,
        store: new MemoryStore({
            checkPeriod: 86400000, // prune expired entries every 24h
        }),
    }),
);
// health-check
app.get('/health-check', (request: Request, response: Response) => {
    response.send('OK');
});

app.post(apiSuffix + '/login', jwtHandler.registry.bind(jwtHandler));
module.exports = app;
