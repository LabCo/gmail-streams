import {} from "jest"
import {GmailStreams, GoogleAuthTestHelper} from '../lib'

import { setTimeout } from "timers";

import {Message} from '../lib/types'
import { resolve } from "url";

import {google} from 'googleapis'
const gmail = google.gmail('v1');

import * as moment from "moment"

describe("testing getting messages since a history id", () => {

  // const messages:Message[] = []
  // let client: any = null
  // beforeAll( done => {
  //   GmailStreams.setLogLevel("error")

  //   const params = {
  //     before: "2016/12/15",
  //     after: "2016/12/08"
  //   }

  //   GoogleAuthTestHelper.getClient().then( myClient => {     
  //     client = myClient
  //     const stream = GmailStreams.messagesSince(myClient, "0")
  //     stream.on("data", data => { messages.push(data) })
  //     stream.on("error", (error:any) => done.fail(error))
  //     stream.on("end", () => done() )
  //   })
  // }, 40000);

  // it("recover from failing to fetch by history id by fetcing the last month", () => {
  //   const d = new Date()
  //   d.setMonth(d.getMonth() - 1);    
    
  //   expect(messages.length).toBeGreaterThan(0)

  //   const lastMessage = messages[messages.length - 1]
  //   const lastDate = new Date( parseInt(lastMessage.internalDate) )

  //   expect(lastDate.getTime()).toBeGreaterThanOrEqual(d.getTime())
  // })

  let client: any = null
  let historyMessages: any[] = []
  let rootMsg:any = null

  beforeAll( async () => {
    GmailStreams.setLogLevel("error")


    const client = await GoogleAuthTestHelper.getClient()

    let params = { userId: "me", auth: client, maxResults:100 }
    const messagesRes:any = await new Promise( (resolve, resject) => {
      gmail.users.messages.list(params, {}, (error: any, res: any) => {
        if(error) { resject(error) }
        else { resolve(res) }
      })
    })
    
    const messages = messagesRes.data
    expect(messages.messages).not.toBeNull()
    expect(messages.messages.length).toBeGreaterThan(0)

    const message = messages.messages[20]

    // fetch in the message
    let messageParams = { userId: "me", auth: client, id:message.id }
    const messageRes:any = await new Promise( (resolve, reject) => {
      gmail.users.messages.get(messageParams, {}, (error: any, res: any) => {
        if(error) { reject(error) }
        else { resolve(res) }
      })
    })
    const foundMessage = messageRes.data
    rootMsg = foundMessage
    expect(foundMessage).not.toBeNull()
    expect(foundMessage.historyId).not.toBeNull()

    const historyId = foundMessage.historyId
    // console.log("HISTORY ID:", historyId)
    // console.log("MESSAGE ID:", foundMessage.id)
    // console.log("Snippet:", foundMessage.snippet)
    // console.log("internalDate ID:", foundMessage.internalDate)

    const stream = GmailStreams.messagesSince(client, historyId)

    const messagesSince = await new Promise<Message[]>( (resolve, reject) => {
      const found:Message[] = []
      let lastError:any = null

      stream.on("data", data => { 
        found.push(data)
       })
      stream.on("error", (error:any) => {
        console.error("ERROR:", error)
        lastError = error
      })
      
      stream.on("end", () => {
        if(lastError) { reject(lastError)}
        else { resolve(found) }
      })
    })
    historyMessages = messagesSince


  }, 40000);

  it("get historical messages", () => {
    expect(historyMessages.length).toBeGreaterThan(0)

    // historyMessages.forEach( m => {
    //   const rootMsgDate = moment(rootMsg.internalDate, "x")
    //   const msgDate = moment(m.internalDate,  "x")

    //   console.log(moment.duration(rootMsgDate.diff(msgDate)).humanize());
    //   console.log(m.id, m.internalDate, m.snippet)
    // })
  })

})