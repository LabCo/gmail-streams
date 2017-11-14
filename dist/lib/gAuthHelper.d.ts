export declare class GoogleAuthTestHelper {
    static SCOPES: string[];
    static TOKEN_DIR: string;
    static TOKEN_PATH: string;
    static readFileP(fileName: string): Promise<any>;
    static getClient(): Promise<any>;
    static createClient(): Promise<any>;
    private static _getClient(createNew);
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     */
    private static authorize(credentials, createNew);
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     */
    private static getNewToken(oauth2Client);
    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    private static storeToken(token);
}
