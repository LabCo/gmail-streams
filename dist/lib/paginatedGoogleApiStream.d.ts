/// <reference types="node" />
import { Readable, ReadableOptions } from 'stream';
export declare type GApiCallback<T> = (error: any, body: T, response: any) => void;
export interface GApiRes {
    nextPageToken: string;
}
export interface GApiOptions {
    maxResults: number;
}
export declare class PaginatedGoogleApiStream<T extends GApiRes, O> extends Readable {
    fetchFn: (params: any, cb: GApiCallback<T>) => void;
    initialParams: any;
    objectsExtractor: (body: T) => O[];
    objectsName: string;
    currentPage: number;
    maxPages?: number;
    fetchedObjects: any;
    nextPageToken?: string;
    constructor(fetchFn: (params: any, cb: GApiCallback<T>) => void, initialParams: any, objectsExtractor: (body: T) => O[], objectsName: string, maxPages?: number, options?: ReadableOptions);
    pushObject(): void;
    fetchInNextPage(): void;
    _read(size: number): void;
}
