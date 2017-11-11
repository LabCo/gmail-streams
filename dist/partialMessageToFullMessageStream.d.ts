import ParallelTransform from './parallelTransform';
/**
 *
 * @param {google.gmail.v1.}
 *
 */
export declare class PartialMessageToFullMessageStream extends ParallelTransform {
    auth: any;
    limiter: any;
    constructor(auth: any, options?: any);
    _parallelTransform(partialMessage: any, encoding: string, done: Function): void;
}
