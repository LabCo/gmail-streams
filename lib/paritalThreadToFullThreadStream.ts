import {google} from 'googleapis'
const gmail = google.gmail('v1');

import * as LeakyBucket from 'leaky-bucket'
import { LabLogger } from "winston-lab"
import * as winston from "winston"

import {Transform} from 'stream'
import ParallelTransform, {ParallelTransformOptions} from './parallelTransform'
import {OAuth2Client} from 'google-auth-library'

import {Thread} from './types'


export declare interface ParitalThreadToFullThreadStream {
  on(event: 'data', listener: (message: Thread) => void): this;
  on(event: string, listener: Function): this;  
}

/**
 * @param {Thread} in
 * @param {Thread} out
 */
export class ParitalThreadToFullThreadStream extends ParallelTransform {

  auth: any
  limiter: any
  logger: winston.LoggerInstance

  additionalParams: any;

  constructor(auth: OAuth2Client, additionalParams: any, logLevel?: string) {
    const withObjOptions = { objectMode:true, maxParallel: 40 }
    super(withObjOptions);
    this.auth = auth
    this.limiter = new LeakyBucket(200, 1, 100000);
    this.additionalParams = additionalParams;

    this.logger = LabLogger.createFromClass(this, logLevel)
  }

  _parallelTransform(partialThread: Thread, encoding: string, done: Function) {
		const threadId = partialThread.id
    const defaultParams = { userId: "me", auth: this.auth, id:threadId, format:'metadata' }
    const params = Object.assign({}, defaultParams, this.additionalParams)

    this.limiter.throttle(10).then( (v:any) => {
      gmail.users.threads.get(params, (error:any, response:any) => {
        const body = response.data
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