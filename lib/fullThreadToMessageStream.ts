import { Transform, TransformOptions } from 'stream'

export class FullThreadToMessageStream extends Transform {

  auth: any;

  constructor(auth: any, options?: TransformOptions) {
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