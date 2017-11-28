/// <reference types="winston" />
import * as winston from "winston";
import ParallelTransform from './parallelTransform';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
export interface ParitalThreadToFullThreadStream {
    on(event: 'data', listener: (message: google.gmail.v1.Thread) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {google.gmail.v1.Thread} in
 * @param {google.gmail.v1.Thread} out
 */
export declare class ParitalThreadToFullThreadStream extends ParallelTransform {
    auth: any;
    limiter: any;
    logger: winston.LoggerInstance;
    constructor(auth: OAuth2Client, logLevel?: string);
    _parallelTransform(partialThread: google.gmail.v1.Thread, encoding: string, done: Function): void;
}
