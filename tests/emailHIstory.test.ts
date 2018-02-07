import {} from "jest"
import {GmailStreams, GoogleAuthTestHelper} from '../lib'

import * as google from 'googleapis'
import { setTimeout } from "timers";

import {Message} from '../lib/types'

describe("testing getting messages since a history id", () => {

  const messages:Message[] = []
  let client: any = null
  beforeAll( done => {
    GmailStreams.setLogLevel("error")

    const params = {
      before: "2016/12/15",
      after: "2016/12/08"
    }

    GoogleAuthTestHelper.getClient().then( myClient => {     
      client = myClient
      const stream = GmailStreams.messagesSince(myClient, "0")
      stream.on("data", data => { messages.push(data) })
      stream.on("error", (error:any) => done.fail(error))
      stream.on("end", () => done() )
    })
  }, 40000);

  it("recover from failing to fetch by history id by fetcing the last month", () => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1);    
    
    expect(messages.length).toBeGreaterThan(0)

    const lastMessage = messages[messages.length - 1]
    const lastDate = new Date( parseInt(lastMessage.internalDate) )

    expect(lastDate.getTime()).toBeGreaterThanOrEqual(d.getTime())
  })

})