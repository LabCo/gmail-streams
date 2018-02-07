/// <reference types="winston" />
import * as winston from "winston";
import ParallelTransform from './parallelTransform';
import { OAuth2Client } from 'google-auth-library';
import { Thread } from './types';
export interface ParitalThreadToFullThreadStream {
    on(event: 'data', listener: (message: Thread) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {Thread} in
 * @param {Thread} out
 */
export declare class ParitalThreadToFullThreadStream extends ParallelTransform {
    auth: any;
    limiter: any;
    logger: winston.LoggerInstance;
    constructor(auth: OAuth2Client, logLevel?: string);
    _parallelTransform(partialThread: Thread, encoding: string, done: Function): void;
}
