import { PaginatedGoogleApiStream, GApiOptions } from './paginatedGoogleApiStream';
import { OAuth2Client } from 'google-auth-library';
import { Thread, ListThreadsResponse } from './types';
export interface ThreadListStream {
    on(event: 'data', listener: (message: Thread) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {Thread} out
 */
export declare class ThreadListStream extends PaginatedGoogleApiStream<ListThreadsResponse, Thread> {
    constructor(auth: OAuth2Client, query: any, params?: GApiOptions, logLevel?: string);
}
