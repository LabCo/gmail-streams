/// <reference types="node" />
import { Readable, ReadableOptions } from 'stream';
export declare type GApiCallback = (error: any, body: any) => void;
export declare class PaginatedGoogleApiStream extends Readable {
    fetchFn: (params: any, cb: GApiCallback) => void;
    initialParams: any;
    objectsExtractor: any;
    objectsName: string;
    currentPage: number;
    maxPages?: number;
    fetchedObjects: any;
    nextPageToken?: string;
    constructor(fetchFn: (params: any, cb: GApiCallback) => void, initialParams: any, objectsExtractor: any, objectsName: string, maxPages?: number, options?: ReadableOptions);
    pushObject(): void;
    fetchInNextPage(): void;
    _read(size: number): void;
}
