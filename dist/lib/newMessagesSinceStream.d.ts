import { Message } from './types';
import { PaginatedGoogleApiStream } from './paginatedGoogleApiStream';
export interface NewMessagesSinceStream {
    on(event: 'data', listener: (message: Message) => void): this;
    on(event: string, listener: Function): this;
}
/**
 * @param {Message} out
 */
export declare class NewMessagesSinceStream extends PaginatedGoogleApiStream<any, Message> {
    historyId: string;
    extractedHistoryId?: string;
    constructor(auth: any, historyId: string, maxPages?: number, logLevel?: string);
    _onFirstFetchError(error: any): void;
    private switchToMessagesFetch();
}
