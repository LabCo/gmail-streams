import ParallelTransform, { ParallelTransformOptions } from './parallelTransform';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
export declare class ParitalThreadToFullThreadStream extends ParallelTransform {
    auth: any;
    limiter: any;
    constructor(auth: OAuth2Client, options?: ParallelTransformOptions);
    _parallelTransform(partialThread: any, encoding: string, done: Function): void;
}
