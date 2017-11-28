import * as google from 'googleapis'
const gmail = google.gmail('v1');

import * as winston from "winston"
import { LabLogger } from "winston-lab"

const LeakyBucket = require('leaky-bucket');

import ParallelTransform from './parallelTransform'

/**
 * @param {google.gmail.v1.Message} in
 * @param {google.gmail.v1.Message} out
 */
export declare interface PartialMessageToFullMessageStream {
  on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
  on(event: string, listener: Function): this;  
}

export class PartialMessageToFullMessageStream extends ParallelTransform {

  auth: any
  limiter: any
  logger: winston.LoggerInstance

  constructor(auth: any, logLevel:string) {
    const withObjOptions = { maxParallel: 20, objectMode:true }
    super(withObjOptions);
    this.auth = auth
    this.limiter = new LeakyBucket(200, 1, 100000);

    this.logger = LabLogger.createFromClass(this, logLevel)
  }

  _parallelTransform(partialMessage: google.gmail.v1.Message, encoding: string, done: Function) {
		const messageId = partialMessage.id

    if(messageId == null) {
      this.push("message id is null")
      return
    }

    const params = { userId: "me", auth: this.auth, id:messageId, format:'metadata' }

    this.limiter.throttle(5).then( (v:any) => {
      gmail.users.messages.get(params, (error, body, response) => {
        if(error) {
          // some messages might have been deleted, so skip 404 errors
          if(response.statusCode == 404) {
            done()
          } else {
            this.logger.error("Failed to fetch message", messageId, "error:", error)
            // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
            done()
          }
        }
        else if((<any>body).error) {
          // some messages might have been deleted, so skip 404 errors
          if((<any>body).error.code == 404) {
            done()
          } else {
            this.logger.error("Failed to fetch message", messageId, "error:", (<any>body).error)
            // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
            done()
          }
        }
        else {
          const fullMessage = body
          done(null, fullMessage)
        }
      })
    }).catch( (error:any) => {
      this.logger.error("Could not throttle gmail message api call", error)
      done(error)
    })

	}

}