import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: HttpError, request: any, response: any, next: (err: any) => any): void {
        console.log(error.httpCode);
        const statusCode = error.httpCode ? error.httpCode : 500;
        response.status(statusCode).send({
            statusCode: statusCode,
            message: error.message,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : null,
        });
        // next(error);
    }
}
