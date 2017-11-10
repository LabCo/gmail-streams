import chalk from 'chalk'

import {ThreadListStream} from './threadListStream'
import {ParitalThreadToFullThreadStream} from './paritalThreadToFullThreadStream'
import {FullThreadToMessageStream} from './fullThreadToMessageStream'
import {NewMessagesSinceStream} from './newMessagesSinceStream'
import {PartialMessageToFullMessageStream} from './partialMessageToFullMessageStream'
import pumpify = require('pumpify')

export interface IGmailMsgsParams {
  from?: string,
  after?: number | string,
  before?: number | string
}

export function gmailMessagesStream(account: string, auth: any, params?: IGmailMsgsParams) {
  if(auth == null) {
    throw new Error("auth is not defined")
  }

  const qArray:string[] = []
  if(params && params.from) { qArray.push(`from:${params.from}`) }
  if(params && params.before) { qArray.push(`before:${params.before}`) }
  if(params && params.after) { qArray.push(`after:${params.after}`) }
  const qString = (qArray.length > 0) ? qArray.join(" ") : null

  const threadListStream = new ThreadListStream(auth, qString)
  const fullThreadStream = new ParitalThreadToFullThreadStream(auth)
  const gmailMessageStream = new FullThreadToMessageStream(auth)

  const messagesStream = pumpify(threadListStream, fullThreadStream, gmailMessageStream)

  // // threadListStream.on( "data",  (thread) => console.log("thread:", thread) )
  // threadListStream.on( "error", error => console.error( chalk.red.bold("ERROR: failed fetching thread list,"), error ) );
  // threadListStream.on( "end", end => console.log( chalk.green.dim( "finished fetchng threads:" ) ) );

  // // fullThreadStream.on( "data",  (thread) => console.log("thread id:", thread.id) )
  // fullThreadStream.on( "error", error => console.error( chalk.red.bold( "ERROR: failed fetching full thread," ), error ) );
  // fullThreadStream.on( "end", end => console.log( chalk.green.dim( "finished fetchng full threads:" ) ) );

  // let messagesCount = 0
  // gmailMessageStream.on( "data",  (message) => messagesCount += 1 )
  // gmailMessageStream.on( "error", error => console.error( chalk.red.bold( "ERROR: failed extracting messages from thread," ), error ) );
  // gmailMessageStream.on( "end", end => console.log( chalk.green.dim( `finished extracting ${messagesCount} messgaes from threads` ) ) );

  // const stream = threadListStream.pipe(fullThreadStream).pipe(gmailMessageStream)
  return messagesStream as NodeJS.ReadableStream
}


export function gmailMessagesSinceHistoryIdStream(account:string, auth:any, historyId:string | String, disableLogging?:boolean) {
  if(auth == null) { throw new Error("auth is not defined") }
  if(historyId == null) { throw new Error("historyId is not defined") }
  if (! (typeof historyId === 'string') ) {
    throw new Error("historyId is not a string")
  }

  const newMessagesStream = new NewMessagesSinceStream(auth, historyId)
  const gmailMessageStream = new PartialMessageToFullMessageStream(auth)

  let newMessageCount = 0
  newMessagesStream.on( "data",  (message) => newMessageCount += 1 )
  newMessagesStream.on( "error", error => console.log( chalk.red.bold( `ERROR: failed to fetch messages since ${historyId}` ), error ) );
  newMessagesStream.on( "end", (end:any) => {
    if(!disableLogging) { console.log( chalk.green.bold( `finished fetchng ${newMessageCount} new messages since ${historyId} for ${account}` ) ) }  
  });

  // gmailMessageStream.on( "data",  (message) => console.log("fetched full message:", message.id) )
  gmailMessageStream.on( "error", error => console.log( chalk.red.bold( "ERROR: failed fetching full messages" ), error ) );
  gmailMessageStream.on( "end", (end:any) => {
    if(!disableLogging) { 
      console.log( chalk.green.bold( "finished fetchng full messages" ) ) 
    }
  });

  const stream = newMessagesStream.pipe(gmailMessageStream)
  return stream
}