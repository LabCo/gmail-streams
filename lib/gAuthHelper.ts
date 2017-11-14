import * as fs from 'fs'
import * as readline from 'readline'

import googleAuth = require('google-auth-library')

export class GoogleAuthTestHelper {

  // If modifying these scopes, delete your previously saved credentials
  // at ~/.credentials/gmail-nodejs-quickstart.json  
  static SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/admin.directory.user.alias.readonly'];
  static TOKEN_DIR = 'conf/.credentials/';
  static TOKEN_PATH = GoogleAuthTestHelper.TOKEN_DIR + 'gmail-auth.json';

  static readFileP(fileName: string): Promise<any> {
    return new Promise( (resolve, reject) => {
      fs.readFile(fileName, (err, content) => {
        if(err) { reject(err) }
        else { resolve(content) }
      })
    })
  }

  static getClient() {
    return this._getClient(false)
  }

  static createClient() {
    return this._getClient(true)
  }

  private static _getClient(createNew: boolean) {
    return this.readFileP('conf/client_secret.json').then( content => {
      const parsed = JSON.parse(content as any)
      return this.authorize(parsed, createNew)
    }).catch( error => {
      console.log('Error loading client secret file:', error);
      return Promise.reject(error)
    })
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   *
   * @param {Object} credentials The authorization client credentials.
   */
  private static authorize(credentials: any, createNew:boolean): Promise<any> {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth()
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    const readFileP = new Promise( (resolve, reject) => {
      fs.readFile(this.TOKEN_PATH, function(err, token) {
        if (err) { 
          reject(err)
        } else {
          oauth2Client.credentials = JSON.parse(token as any);
          resolve(oauth2Client)
        }
      })
    })

    if(createNew) {
      return readFileP.catch( e => this.getNewToken(oauth2Client))      
    } else {
      return readFileP
    }
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   */
  private static getNewToken(oauth2Client: any): Promise<any> {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise( (resolve, reject) => {
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err:any, token:any) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
          }
          oauth2Client.credentials = token;
          this.storeToken(token);
          resolve(oauth2Client);
        });
      });
    })
  }

  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  private static storeToken(token: any) {
    try {
      fs.mkdirSync(this.TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    (fs as any).writeFile(this.TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + this.TOKEN_PATH);
  }

}