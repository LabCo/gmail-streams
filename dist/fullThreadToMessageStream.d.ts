/// <reference types="node" />
import { Transform, TransformOptions } from 'stream';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
export declare class FullThreadToMessageStream extends Transform {
    auth: any;
    constructor(auth: OAuth2Client, options?: TransformOptions);
    _transform(fullThread: any, encoding: string, done: Function): void;
}
