/// <reference types="node" />
import { ReadableOptions } from "stream";
import { PaginatedGoogleApiStream } from './paginatedGoogleApiStream';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
/**
 * @param {google.gmail.v1.Thread} out
 */
export declare class ThreadListStream extends PaginatedGoogleApiStream<google.gmail.v1.ListThreadsResponse, google.gmail.v1.Thread> {
    constructor(auth: OAuth2Client, query: any, options?: ReadableOptions);
}
