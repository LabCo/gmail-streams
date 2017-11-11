/// <reference types="node" />
import { Transform, TransformOptions } from 'stream';
export declare class FullThreadToMessageStream extends Transform {
    auth: any;
    constructor(auth: any, options?: TransformOptions);
    _transform(fullThread: any, encoding: string, done: Function): void;
}
