import { PaginatedGoogleApiStream } from './paginatedGoogleApiStream';
export declare class NewMessagesSinceStream extends PaginatedGoogleApiStream {
    historyId: string;
    constructor(auth: any, historyId: string, maxPages?: number);
}
