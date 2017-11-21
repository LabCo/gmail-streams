import { PaginatedGoogleApiStream } from './paginatedGoogleApiStream';
export interface NewMessagesSinceStream {
    on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {google.gmail.v1.Message} out
 */
export declare class NewMessagesSinceStream extends PaginatedGoogleApiStream<any, google.gmail.v1.Message> {
    test: google.Request;
    historyId: string;
    constructor(auth: any, historyId: string, maxPages?: number);
    _onFirstFetchError(error: any): void;
    private switchToMessagesFetch();
}
