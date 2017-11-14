import chalk from 'chalk'
import * as google from 'googleapis';

import {ThreadListStream} from './threadListStream'
import {ParitalThreadToFullThreadStream} from './paritalThreadToFullThreadStream'
import {FullThreadToMessageStream} from './fullThreadToMessageStream'
import {NewMessagesSinceStream} from './newMessagesSinceStream'
import {PartialMessageToFullMessageStream} from './partialMessageToFullMessageStream'
import pumpify = require('pumpify')
import pump = require('pump')
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';

export interface IGmailMsgsParams {
  from?: string,
  after?: number | string,
  before?: number | string
}

export declare interface GmailMessageStream extends NodeJS.ReadableStream {
  on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
  on(event: string, listener: Function): this;  
}

export module GmailStreams {

  /**
   * @param authClient 
   * @param params 
   * 
   * @returns stream with {google.gmail.v1.Message} as data
   */
  export function messages(authClient: OAuth2Client, params?: IGmailMsgsParams): GmailMessageStream {
    if(authClient == null) {
      throw new Error("authClient is not defined")
    }

    const qArray:string[] = []
    if(params && params.from) { qArray.push(`from:${params.from}`) }
    if(params && params.before) { qArray.push(`before:${params.before}`) }
    if(params && params.after) { qArray.push(`after:${params.after}`) }
    const qString = (qArray.length > 0) ? qArray.join(" ") : null

    const threadListStream = new ThreadListStream(authClient, qString)
    const fullThreadStream = new ParitalThreadToFullThreadStream(authClient)
    const gmailMessageStream = new FullThreadToMessageStream(authClient)

    const messagesStream = pumpify.obj(threadListStream, fullThreadStream, gmailMessageStream)
    return messagesStream as GmailMessageStream
  }

 /**
   * @param authClient 
   * @param historyId 
   * 
   * @returns stream with {google.gmail.v1.Message} as data
   */
  export function messagesSince(authClient: OAuth2Client, historyId:string) {
    if(historyId == null) { throw new Error("historyId is not defined") }
    if (! (typeof historyId === 'string') ) {
      throw new Error("historyId is not a string")
    }

    const newMessagesStream = new NewMessagesSinceStream(authClient, historyId)
    const gmailMessageStream = new PartialMessageToFullMessageStream(authClient)

    const stream = pumpify.obj(newMessagesStream, gmailMessageStream)
    return stream as GmailMessageStream
  }

}