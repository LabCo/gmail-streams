/// <reference types="node" />
import { ReadableOptions } from "stream";
import { PaginatedGoogleApiStream } from './paginatedGoogleApiStream';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
export interface ThreadListStream {
    on(event: 'data', listener: (message: google.gmail.v1.Thread) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {google.gmail.v1.Thread} out
 */
export declare class ThreadListStream extends PaginatedGoogleApiStream<google.gmail.v1.ListThreadsResponse, google.gmail.v1.Thread> {
    constructor(auth: OAuth2Client, query: any, options?: ReadableOptions);
}
