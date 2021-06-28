import session = require('express-session');
import bodyParser = require('body-parser');
import compression = require('compression');
import dotenv = require('dotenv');
import JWTHandler from './jwt/JWTHandler';
import * as express from 'express';
import cors = require('cors');
import { HelloWorldController } from './controller/HelloWorldController';
import { Request, Response } from 'express';
import { useExpressServer } from 'routing-controllers';
import 'reflect-metadata';
import { ErrorHandlerMiddleware } from './middleware/ErrorHandlerMiddleware';
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

const SESSION_SECRET = process.env['SESSION_SECRET'];
declare module 'express-serve-static-core' {
    interface Request {
        _session?: any;
    }
}
const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET as string,
        store: new MemoryStore({
            checkPeriod: 86400000, // prune expired entries every 24h
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            secure: process.env.NODE_ENV === 'production',
        },
        proxy: true,
    }),
);
// health-check
app.get('/health-check', (request: Request, response: Response) => {
    response.send('OK');
});

app.post(apiSuffix + '/login', jwtHandler.registry.bind(jwtHandler));
useExpressServer(app, {
    cors: true,
    routePrefix: apiSuffix,
    authorizationChecker: jwtHandler.verify.bind(jwtHandler),
    defaultErrorHandler: false,
    validation: true,
    errorOverridingMap: {
        ForbiddenError: {
            message: 'Access is denied',
        },
        ValidationError: {
            httpCode: '400',
            message: 'Oops, Validation failed.',
        },
    },
    middlewares: [ErrorHandlerMiddleware],
    controllers: [HelloWorldController],
});
app.all('/*', (request: Request, response: Response) => {
    response.status(404).send({
        error: 404,
        message: 'Resource not found',
    });
});

module.exports = app;
