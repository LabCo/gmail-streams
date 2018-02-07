/// <reference types="node" />
import { Transform } from 'stream';
import { OAuth2Client } from 'google-auth-library';
import { Message } from './types';
export interface FullThreadToMessageStream {
    on(event: 'data', listener: (message: Message) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {Thread} in
 * @param {Message} out
 */
export declare class FullThreadToMessageStream extends Transform {
    auth: any;
    constructor(auth: OAuth2Client);
    _transform(fullThread: any, encoding: string, done: Function): void;
}
