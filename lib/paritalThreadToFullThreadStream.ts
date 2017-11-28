import * as google from 'googleapis'
const gmail = google.gmail('v1');

import * as LeakyBucket from 'leaky-bucket'
import { LabLogger } from "winston-lab"
import * as winston from "winston"

import ParallelTransform, {ParallelTransformOptions} from './parallelTransform'
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';


export declare interface ParitalThreadToFullThreadStream {
  on(event: 'data', listener: (message: google.gmail.v1.Thread) => void): this;
  on(event: string, listener: Function): this;  
}

/**
 * @param {google.gmail.v1.Thread} in
 * @param {google.gmail.v1.Thread} out
 */
export class ParitalThreadToFullThreadStream extends ParallelTransform {

  auth: any
  limiter: any
  logger: winston.LoggerInstance

  constructor(auth: OAuth2Client, logLevel?: string) {
    const withObjOptions = { maxParallel: 15, objectMode:true }
    super(withObjOptions);
    this.auth = auth
    this.limiter = new LeakyBucket(200, 1, 100000);

    this.logger = LabLogger.createFromClass(this, logLevel)
  }

  _parallelTransform(partialThread: google.gmail.v1.Thread, encoding: string, done: Function) {
		const threadId = partialThread.id
    const params = { userId: "me", auth: this.auth, id:threadId, format:'metadata' }

    this.limiter.throttle(10).then( (v:any) => {
      gmail.users.threads.get(params, (error, body) => {
        if(error) {
          this.logger.error("Failed to fetch thread", threadId, "error:", error)
          // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
          done()
        }
        else if((<any>body).error) {
          this.logger.error("Failed to fetch thread", threadId, "error:", (<any>body).error)          
          // do not want to emit an error becasue that will break processing, so just label as done and emit nothing
          done()
        }
        else {
          const fullThread = body
          // this.push()
          done(null, fullThread)
        }
      })
    }).catch( (error:any) => {
      this.logger.error("Could not throttle gmail api call", error)
      done(error)
    })

	}

}