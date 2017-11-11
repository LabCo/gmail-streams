import ParallelTransform, { ParallelTransformOptions } from './parallelTransform';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
/**
 * @param {google.gmail.v1.Thread} in
 * @param {google.gmail.v1.Thread} out
 */
export declare class ParitalThreadToFullThreadStream extends ParallelTransform {
    auth: any;
    limiter: any;
    constructor(auth: OAuth2Client, options?: ParallelTransformOptions);
    _parallelTransform(partialThread: google.gmail.v1.Thread, encoding: string, done: Function): void;
}
