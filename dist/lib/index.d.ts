import { OAuth2Client } from 'google-auth-library';
export interface IGmailMsgsParams {
    from?: string;
    after?: number | string;
    before?: number | string;
}
export interface GmailMessageStream extends NodeJS.ReadableStream {
    on(event: 'data', listener: (message: any) => void): this;
    on(event: string, listener: Function): this;
}
export { GoogleAuthTestHelper } from "./gAuthHelper";
export declare class GmailStreams {
    private static logLevel;
    static setLogLevel(level: string): void;
    /**
     * @param authClient
     * @param params
     *
     * @returns stream with {Message} as data
     */
    static messages(authClient: OAuth2Client, params?: IGmailMsgsParams, messageLookupParams?: any): GmailMessageStream;
    /**
      * @param authClient
      * @param historyId
      *
      * @returns stream with {Message} as data
      */
    static messagesSince(authClient: OAuth2Client, historyId: string, messageLookupParams?: any): GmailMessageStream;
}
