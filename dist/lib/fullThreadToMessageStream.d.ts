/// <reference types="node" />
import { Transform, TransformOptions } from 'stream';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
export interface FullThreadToMessageStream {
    on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {google.gmail.v1.Thread} in
 * @param {google.gmail.v1.Message} out
 */
export declare class FullThreadToMessageStream extends Transform {
    auth: any;
    constructor(auth: OAuth2Client, options?: TransformOptions);
    _transform(fullThread: any, encoding: string, done: Function): void;
}
