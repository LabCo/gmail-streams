import ParallelTransform, { ParallelTransformOptions } from './parallelTransform';
export declare class ParitalThreadToFullThreadStream extends ParallelTransform {
    auth: any;
    limiter: any;
    constructor(auth: any, options?: ParallelTransformOptions);
    _parallelTransform(partialThread: any, encoding: string, done: Function): void;
}
