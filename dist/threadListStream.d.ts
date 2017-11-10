/// <reference types="node" />
import { ReadableOptions } from "stream";
import { PaginatedGoogleApiStream } from './paginatedGoogleApiStream';
export declare class ThreadListStream extends PaginatedGoogleApiStream {
    constructor(auth: any, query: any, options?: ReadableOptions);
}
