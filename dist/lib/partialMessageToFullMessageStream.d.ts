import ParallelTransform from './parallelTransform';
/**
 *
 * @param {google.gmail.v1.Message}
 *
 */
export interface PartialMessageToFullMessageStream {
    on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
    on(event: string, listener: Function): this;
}
export declare class PartialMessageToFullMessageStream extends ParallelTransform {
    auth: any;
    limiter: any;
    constructor(auth: any, options?: any);
    _parallelTransform(partialMessage: any, encoding: string, done: Function): void;
}
