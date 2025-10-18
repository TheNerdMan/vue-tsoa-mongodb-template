import logger from './logger';
import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include startTime
declare global {
    namespace Express {
        interface Request {
            startTime?: number;
        }
    }
}

// Middleware to log requests
const requestLogger = (req: Request, _: Response, next: NextFunction) => {
    const startTime = Date.now();
    req.startTime = startTime;
    
    const origin = req.headers.origin;
    const method = req.method;
    const url = req.url;
    
    logger.info(`Request received: ${method} ${url}`, {
        origin,
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer,
        timestamp: new Date(startTime).toISOString()
    });
    next();
};

// Middleware to log responses
const responseLogger = (req: Request, res: Response, next: NextFunction) => {
    const oldSend = res.send;
    res.send = function (data: Buffer | string | Object): Response<any, Record<string, any>> {
        const endTime = Date.now();
        const duration = req.startTime ? endTime - req.startTime : 0;
        
        logger.info(`Response sent for '${req.url}'`, {
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            durationMs: duration,
            timestamp: new Date(endTime).toISOString()
        });
        return oldSend.call(res, data);
    };
    next();
};

export { requestLogger, responseLogger };