"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
const googleAuth = require("google-auth-library");
class GoogleAuthTestHelper {
    static readFileP(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, content) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(content);
                }
            });
        });
    }
    static getClient() {
        return this._getClient(false);
    }
    static createClient() {
        return this._getClient(true);
    }
    static _getClient(createNew) {
        return this.readFileP('conf/client_secret.json').then(content => {
            const parsed = JSON.parse(content);
            return this.authorize(parsed, createNew);
        }).catch(error => {
            console.log('Error loading client secret file:', error);
            return Promise.reject(error);
        });
    }
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     */
    static authorize(credentials, createNew) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        // Check if we have previously stored a token.
        const readFileP = new Promise((resolve, reject) => {
            fs.readFile(this.TOKEN_PATH, function (err, token) {
                if (err) {
                    reject(err);
                }
                else {
                    oauth2Client.credentials = JSON.parse(token);
                    resolve(oauth2Client);
                }
            });
        });
        if (createNew) {
            return readFileP.catch(e => this.getNewToken(oauth2Client));
        }
        else {
            return readFileP;
        }
    }
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     */
    static getNewToken(oauth2Client) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve, reject) => {
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oauth2Client.getToken(code, (err, token) => {
                    if (err) {
                        console.log('Error while trying to retrieve access token', err);
                        return;
                    }
                    oauth2Client.credentials = token;
                    this.storeToken(token);
                    resolve(oauth2Client);
                });
            });
        });
    }
    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    static storeToken(token) {
        try {
            fs.mkdirSync(this.TOKEN_DIR);
        }
        catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + this.TOKEN_PATH);
    }
}
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json  
GoogleAuthTestHelper.SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/admin.directory.user.alias.readonly'];
GoogleAuthTestHelper.TOKEN_DIR = 'conf/.credentials/';
GoogleAuthTestHelper.TOKEN_PATH = GoogleAuthTestHelper.TOKEN_DIR + 'gmail-auth.json';
exports.GoogleAuthTestHelper = GoogleAuthTestHelper;
