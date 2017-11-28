/// <reference types="winston" />
import * as winston from "winston";
import ParallelTransform from './parallelTransform';
/**
 * @param {google.gmail.v1.Message} in
 * @param {google.gmail.v1.Message} out
 */
export interface PartialMessageToFullMessageStream {
    on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
    on(event: string, listener: Function): this;
}
export declare class PartialMessageToFullMessageStream extends ParallelTransform {
    auth: any;
    limiter: any;
    logger: winston.LoggerInstance;
    constructor(auth: any, logLevel: string);
    _parallelTransform(partialMessage: google.gmail.v1.Message, encoding: string, done: Function): void;
}
