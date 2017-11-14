import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';
export interface IGmailMsgsParams {
    from?: string;
    after?: number | string;
    before?: number | string;
}
export interface GmailMessageStream extends NodeJS.ReadableStream {
    on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
    on(event: string, listener: Function): this;
}
export declare module GmailStreams {
    /**
     * @param authClient
     * @param params
     *
     * @returns stream with {google.gmail.v1.Message} as data
     */
    function messages(authClient: OAuth2Client, params?: IGmailMsgsParams): GmailMessageStream;
    /**
      * @param authClient
      * @param historyId
      *
      * @returns stream with {google.gmail.v1.Message} as data
      */
    function messagesSince(authClient: OAuth2Client, historyId: string): GmailMessageStream;
}
