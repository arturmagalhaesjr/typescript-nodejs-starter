import jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { getApiLinks } from '../util/utils';
import { Action } from 'routing-controllers';

export default class JWTHandler {
    private handleCheckToken: (token: string) => Promise<any>;

    constructor(handleCheckToken: (token: string) => Promise<any>) {
        this.handleCheckToken = handleCheckToken;
    }

    public unauthorizedError(res: Response): void {
        res.status(401).send({
            status: 401,
            error: 'Unauthorized for this request, please check if the token is valid',
        });
    }

    public getToken(req: Request): string {
        let token = req.headers.authorization;
        if (!token || token.length === 0) {
            token = '';
        } else {
            token = token.replace('Bearer ', '');
        }
        return token;
    }

    public registry(req: Request, res: Response): void {
        this.handleCheckToken(this.getToken(req))
            .then(() => {
                const id = new Date().getUTCMilliseconds();
                const secret = process.env.SESSION_SECRET;
                const expires = 300;
                const jwtToken = jwt.sign({ id }, secret as string, {
                    expiresIn: expires, // expires in 5min
                });
                res.status(200).send({
                    access_token: jwtToken,
                    token_type: 'bearer',
                    expires_in: expires,
                    time: new Date(),
                    links: getApiLinks(req),
                });
            })
            .catch(() => {
                this.unauthorizedError(res);
            });
    }

    public async verify(action: Action, roles: string[]): Promise<boolean> {
        const req = action.request;
        const token = this.getToken(req);
        if (!token || token.length === 0) {
            return false;
        } else {
            const secret = process.env.SESSION_SECRET;
            try {
                jwt.verify(token, secret as string);
                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        }
    }
}
