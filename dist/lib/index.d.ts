import { PartialMessageToFullMessageStream } from './partialMessageToFullMessageStream';
export interface IGmailMsgsParams {
    from?: string;
    after?: number | string;
    before?: number | string;
}
export declare function gmailMessagesStream(authClient: any, params: IGmailMsgsParams): any;
export declare function gmailMessagesSinceHistoryIdStream(account: string, auth: any, historyId: string | String, disableLogging?: boolean): PartialMessageToFullMessageStream;
