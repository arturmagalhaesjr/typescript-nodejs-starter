import { Request, Response } from 'express';

export const getApiLinks = (req: Request): Array<any> => {
    return [
        {
            rel: 'self',
            href: req.protocol + '://' + req.hostname + req.path,
        },
    ];
};

export const errorHandler = (res: Response, message: string, status = 500): void => {
    res.status(500).send({
        status: status,
        error: message,
    });
};
