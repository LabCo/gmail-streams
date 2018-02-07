/// <reference types="node" />
/// <reference types="winston" />
import { Readable, ReadableOptions } from 'stream';
import * as winston from "winston";
export declare type GApiCallback<T> = (error: any, body: {
    data: T;
}, response: any) => void;
export interface GApiRes {
    nextPageToken: string;
}
export interface GApiOptions {
    maxResults: number;
}
export declare abstract class PaginatedGoogleApiStream<T extends GApiRes, O> extends Readable {
    protected fetchFn: (params: any, options: any, cb: GApiCallback<T>) => void;
    protected initialParams: any;
    protected objectsExtractor: (body: T) => O[];
    objectsName: string;
    currentPage: number;
    maxPages?: number;
    fetchedObjects: any;
    nextPageToken?: string;
    protected logLevel: string | undefined;
    logger: winston.LoggerInstance;
    constructor(fetchFn: (params: any, options: any, cb: GApiCallback<T>) => void, initialParams: any, objectsExtractor: (body: T) => O[], objectsName: string, maxPages?: number, logLevel?: string, options?: ReadableOptions);
    pushObject(): void;
    protected fetchInNextPage(isInitialFetch: boolean): void;
    _onFirstFetchError(error: any): void;
    _onError(error: any): void;
    _read(size: number): void;
}
