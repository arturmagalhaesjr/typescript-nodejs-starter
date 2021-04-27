import jwt = require('jsonwebtoken')
import { NextFunction, Request, Response } from "express";
import { getApiLinks } from "../util/utils";
export default class JWTHandler {

    public handleCheckToken:Function;

    public unauthorizedError (res: Response): void {
        res.status(401).send({
            status: 401,
            error: 'Unauthorized for this request, please check if the token is valid'
        })
    }

    public getToken (req: Request): string {
        let token = req.headers.authorization
        if (!token || token.length === 0) {
            token = ""
        } else {
            token = token.replace("Bearer ", "")
        }
        return token
    }

    public registry (req: Request, res: Response) :void {
        if (this.handleCheckToken) {
            this.handleCheckToken(this.getToken(req)).then(() => {
                const id = new Date().getUTCMilliseconds()
                const secret = process.env.SESSION_SECRET
                const expires = 300
                const jwtToken = jwt.sign({ id }, secret as string, {
                    expiresIn: expires // expires in 5min
                });
                res.status(200).send({
                    access_token: jwtToken,
                    token_type: "bearer",
                    expires_in: expires,
                    time: new Date(),
                    links: getApiLinks(req)
                })
            }).catch(() => {
                this.unauthorizedError(res);
            })
        } else {
            this.unauthorizedError(res);
        }
    }
    public verify (req: Request, res: Response, next: NextFunction): void {
        const token = this.getToken(req)
        if (!token || token.length === 0) {
            this.unauthorizedError(res)
        } else {
            const secret = process.env.SESSION_SECRET
            jwt.verify(token, secret as string, (err: any) => {
                if (err) {
                    this.unauthorizedError(res)
                } else {
                    next()
                }
            })
        }
    }
}
