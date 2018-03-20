import {} from "jest"
import {GmailStreams, GoogleAuthTestHelper} from '../lib'

import * as google from 'googleapis'
import { setTimeout } from "timers";

import {Message} from '../lib/types'

describe("testing messages stream", () => {

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
      const stream = GmailStreams.messages(myClient, params)
      stream.on("data", data => messages.push(data))
      stream.on("error", (error:any) => done.fail(error))
      stream.on("end", () => done() )
    })
  });

  it("fetch the expected number of messages", done => {
    expect(messages.length).toEqual(74)

    const firstMsg = messages[0]

    expect(firstMsg.snippet).toEqual("Resin Talk A brief summary of Resin Talk since your last visit on December 7 Popular posts Roombots - RPi2 and Roomba powered networked robots Projects This time it&#39;s not my own project, but")
    expect(firstMsg.internalDate).toEqual("1481757691000")

    // must not have parts as the default is only to get meta data
    expect(firstMsg.payload).toBeDefined()
    expect(firstMsg.payload.parts).toBeUndefined()

    done()
  })
  
})

describe("testing messages stream with body", () => {

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
      const stream = GmailStreams.messages(myClient, params, { format: "full" })
      stream.on("data", data => messages.push(data))
      stream.on("error", (error:any) => done.fail(error))
      stream.on("end", () => done() )
    })
  });

  it("fetch the expected number of messages", done => {
    expect(messages.length).toEqual(74)

    const firstMsg = messages[0]

    expect(firstMsg.snippet).toEqual("Resin Talk A brief summary of Resin Talk since your last visit on December 7 Popular posts Roombots - RPi2 and Roomba powered networked robots Projects This time it&#39;s not my own project, but")
    expect(firstMsg.internalDate).toEqual("1481757691000")
    
    // must have parts
    expect(firstMsg.payload).toBeDefined()
    expect(firstMsg.payload.parts).toBeDefined()
    expect(firstMsg.payload.parts.length).toBeGreaterThan(0) 

    // must have some sext parts
    const textParts = firstMsg.payload.parts.filter(p => p.mimeType && p.mimeType == "text/plain")
    textParts.forEach(tp => {
      expect(tp.body).toBeDefined()
      expect(tp.body.data).toBeDefined()
      expect(tp.body.data).not.toBeNull()
      expect(tp.body.data.length).toBeGreaterThan(0)
    })

    done()
  })
  
})