import { PaginatedGoogleApiStream } from './paginatedGoogleApiStream';
export declare class NewMessagesSinceStream extends PaginatedGoogleApiStream<google.gmail.v1.ListHistoryResponse, google.gmail.v1.Message> {
    historyId: string;
    constructor(auth: any, historyId: string, maxPages?: number);
}
