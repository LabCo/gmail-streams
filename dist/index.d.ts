import { PartialMessageToFullMessageStream } from './partialMessageToFullMessageStream';
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
export interface IGmailMsgsParams {
    from?: string;
    after?: number | string;
    before?: number | string;
}
export declare function gmailMessagesStream(authClient: OAuth2Client, params: IGmailMsgsParams): any;
export declare function gmailMessagesSinceHistoryIdStream(account: string, auth: any, historyId: string | String, disableLogging?: boolean): PartialMessageToFullMessageStream;
