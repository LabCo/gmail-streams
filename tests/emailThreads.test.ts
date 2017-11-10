import {} from "jest"
import {gmailMessagesStream} from '../lib'

describe("testing list streams", () => {

  it("do something", done => {
    const params = {
      before: "2017/01/01",
      after: "2016/12/01"
    }
    const stream = gmailMessagesStream("michael@lablablab.com", {}, params)

    let counter = 0
    stream.on("data", data => {
      counter += 1;
    })
    stream.on("error", error => {
      done.fail(error)
    })
    stream.on("end", () => {
      expect(counter).toEqual(42)
      done()
    })
  })
  
})