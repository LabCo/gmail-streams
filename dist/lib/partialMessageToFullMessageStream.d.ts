/// <reference types="winston" />
import * as winston from "winston";
import ParallelTransform from './parallelTransform';
import { Message } from './types';
/**
 * @param {Message} in
 * @param {Message} out
 */
export interface PartialMessageToFullMessageStream {
    on(event: 'data', listener: (message: Message) => void): this;
    on(event: string, listener: Function): this;
}
export declare class PartialMessageToFullMessageStream extends ParallelTransform {
    auth: any;
    limiter: any;
    logger: winston.LoggerInstance;
    additionalParams: any;
    constructor(auth: any, logLevel: string, additionalParams?: any);
    _parallelTransform(partialMessage: Message, encoding: string, done: Function): void;
}
