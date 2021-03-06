import {} from "jest"
import {Readable} from "stream"
import * as pumpify from 'pumpify'

import {ThreadListStream} from '../lib/threadListStream'
import {PartialMessageToFullMessageStream} from '../lib/partialMessageToFullMessageStream'

import {GmailStreams, GoogleAuthTestHelper} from "../lib"
import * as google from 'googleapis'
import { setTimeout } from "timers";

import {Thread, Message} from '../lib/types'


let client:any = null
describe("testing getting full message", () => {


  it("pass through the deleted message", async () => {
    client = await GoogleAuthTestHelper.getClient()

    const bareMessage = {
      id: "161b49b3be396056"
    }

    var inStream = new Readable( { objectMode: true} )
    const toMessageStream = new PartialMessageToFullMessageStream(client, "warn")
    const stream = pumpify.obj(inStream, toMessageStream)


    const messages: Message[] = []
    const errors: any[] = []
    const res = await new Promise( (resolve, reject) => {
      inStream.push(bareMessage);
      inStream.push(null);

      stream.on("data", (data:Message) => {
        messages.push(data)
      });
      stream.on("error", (error:any) => errors.push(error));
      stream.on("end", () => resolve(true));
    })

    expect(messages.length).toEqual(1)
    expect(errors.length).toEqual(0)

    const message = messages[0]
    expect(message.id).toEqual("161b49b3be396056")
    expect(message.deleted).toBeTruthy()
  })


})