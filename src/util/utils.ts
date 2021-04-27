import {Request, Response} from "express";

export const getApiLinks = (req: Request) => {
    return [
        {
            "rel": "self",
            "href": req.protocol + '://' + req.host + req.path
        }
    ]
}

export const errorHandler = (res: Response, message: string, status = 500) => {
    res.status(500).send({
        status: status,
        error: message
    })
}
