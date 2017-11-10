/// <reference types="node" />
import { PartialMessageToFullMessageStream } from './partialMessageToFullMessageStream';
export interface IGmailMsgsParams {
    from?: string;
    after?: number | string;
    before?: number | string;
}
export declare function gmailMessagesStream(account: string, auth: any, params?: IGmailMsgsParams): NodeJS.ReadableStream;
export declare function gmailMessagesSinceHistoryIdStream(account: string, auth: any, historyId: string | String, disableLogging?: boolean): PartialMessageToFullMessageStream;
