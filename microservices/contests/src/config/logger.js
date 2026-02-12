import pino from 'pino';

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const transport = process.env.NODE_ENV === 'production' ? undefined : {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' }
};

const redact = {
    paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["set-cookie"]',
        'password',
        '*.password',
        'accessToken',
        '*.accessToken',
        'refreshToken',
        '*.refreshToken'
    ],
    censor: '[REDACTED]'
};

const logger = pino ({level, transport, redact});

global.logger = logger;

export default logger;