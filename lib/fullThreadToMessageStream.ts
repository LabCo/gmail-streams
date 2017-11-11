import { Transform, TransformOptions } from 'stream'
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';

/**
 * @param {google.gmail.v1.Thread} in
 * @param {google.gmail.v1.Message} out
 */
export class FullThreadToMessageStream extends Transform {

  auth: any;

  constructor(auth: OAuth2Client, options?: TransformOptions) {
    super({objectMode: true});
    this.auth = auth
  }

  _transform(fullThread: any, encoding: string, done: Function) {
    const messages = fullThread.messages as any[]
    if(messages == null) {
      const errorMsg = "full thread object is missing messages"
      this.emit('error', errorMsg);
    } else {
      messages.forEach(message => this.push(message))
    }
    done()
  };

}