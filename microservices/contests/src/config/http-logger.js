import { v4 as uuidv4 } from 'uuid';
import pinoHttp from 'pino-http';

const httpLogger = pinoHttp ({
    logger,

    genReqId: (req) => req.headers['x-request-id'] || uuidv4(),

    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url
        }),

        res: (res) => ({
            statusCode: res.statusCode,
            responseTime: res.responseTime
        })
    },
});

export default httpLogger;