import { Transform, TransformOptions } from 'stream'
import {OAuth2Client} from 'google-auth-library'
import {Message, Thread} from './types'

export declare interface FullThreadToMessageStream {
  on(event: 'data', listener: (message: Message) => void): this;
  on(event: string, listener: Function): this;  
}

/**
 * @param {Thread} in
 * @param {Message} out
 */
export class FullThreadToMessageStream extends Transform {

  auth: any;

  constructor(auth: OAuth2Client) {
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