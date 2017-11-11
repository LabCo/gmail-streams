import {} from "jest"
import {gmailMessagesStream} from '../lib'

import {Helper} from "../lib/gAuthHelper"
import * as google from 'googleapis'

describe("testing list streams", () => {

  it("do something", done => {
    const params = {
      before: "2017/01/01",
      after: "2016/12/01"
    }

    Helper.getClient().then( client => {
      const stream = gmailMessagesStream(client, params)

      let counter = 0
      stream.on("data", data => {
        console.log("snippet:", data.snippet)
        console.log("date:", new Date( parseInt(data.internalDate)) ) 
        
        counter += 1;
      })
      stream.on("error", (error:any) => {
        done.fail(error)
      })
      stream.on("end", () => {
        expect(counter).toEqual(42)
        done()
      })

    }).catch( error => {
      done(error)
    })

  })
  
})