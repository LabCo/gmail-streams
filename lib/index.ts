import chalk from 'chalk'
import * as google from 'googleapis';

import { Transform } from "stream"

import {ThreadListStream} from './threadListStream'
import {ParitalThreadToFullThreadStream} from './paritalThreadToFullThreadStream'
import {FullThreadToMessageStream} from './fullThreadToMessageStream'
import {NewMessagesSinceStream} from './newMessagesSinceStream'
import {PartialMessageToFullMessageStream} from './partialMessageToFullMessageStream'
import pumpify = require('pumpify')
import {OAuth2Client} from 'google-auth-library'

import {Message} from './types'


export interface IGmailMsgsParams {
  from?: string,
  after?: number | string,
  before?: number | string
}

export declare interface GmailMessageStream extends NodeJS.ReadableStream {
  on(event: 'data', listener: (message: any) => void): this;
  on(event: string, listener: Function): this;  
}

export {GoogleAuthTestHelper} from "./gAuthHelper"

export class GmailStreams {

  private static logLevel = "warn"

  static setLogLevel(level: string) {
    this.logLevel = level
  }

  /**
   * @param authClient 
   * @param params 
   * 
   * @returns stream with {Message} as data
   */
  static messages(authClient: OAuth2Client, params?: IGmailMsgsParams): GmailMessageStream {
    if(authClient == null) {
      throw new Error("authClient is not defined")
    }

    const qArray:string[] = []
    if(params && params.from) { qArray.push(`from:${params.from}`) }
    if(params && params.before) { qArray.push(`before:${params.before}`) }
    if(params && params.after) { qArray.push(`after:${params.after}`) }
    const qString = (qArray.length > 0) ? qArray.join(" ") : null

    const threadListStream = new ThreadListStream(authClient, qString, undefined, this.logLevel)
    const fullThreadStream = new ParitalThreadToFullThreadStream(authClient, this.logLevel)
    const gmailMessageStream = new FullThreadToMessageStream(authClient) 

    const messagesStream = pumpify.obj(threadListStream, fullThreadStream, gmailMessageStream)
    return messagesStream as GmailMessageStream
  }

 /**
   * @param authClient 
   * @param historyId 
   * 
   * @returns stream with {Message} as data
   */
  static messagesSince(authClient: OAuth2Client, historyId:string) {
    if(historyId == null) { throw new Error("historyId is not defined") }
    if (! (typeof historyId === 'string') ) {
      throw new Error("historyId is not a string")
    }

    const newMessagesStream = new NewMessagesSinceStream(authClient, historyId, undefined, this.logLevel)
    const gmailMessageStream = new PartialMessageToFullMessageStream(authClient, this.logLevel)
    const dummyStream = new DummyTransform()    

    // have to pass a dummy transform because pumpify does not work when the last stream
    // is a ParallelTransform 
    const stream = pumpify.obj(newMessagesStream, gmailMessageStream, dummyStream)
    return stream as GmailMessageStream
  }

}

class DummyTransform extends Transform {

  constructor() {
    super({ objectMode:true });
  }

  _transform(data: any, encoding: string, done: Function) {
    done(null, data)
  }

}