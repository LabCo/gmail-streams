import * as google from 'googleapis'
const gmail = google.gmail('v1');

import * as LeakyBucket from 'leaky-bucket'

import ParallelTransform, {ParallelTransformOptions} from './parallelTransform'

export class ParitalThreadToFullThreadStream extends ParallelTransform {

  auth: any
  limiter: any

  constructor(auth: any, options?:ParallelTransformOptions) {
    const withObjOptions = Object.assign({}, options, { maxParallel: 15, objectMode:true })
    super(withObjOptions);
    this.auth = auth
    this.limiter = new LeakyBucket(200, 1, 100000);
  }

  _parallelTransform(partialThread: any, encoding: string, done: Function) {
		const threadId = partialThread.id
    const params = { userId: "me", auth: this.auth, id:threadId, format:'metadata' }

    this.limiter.throttle(10).then( (v:any) => {
      gmail.users.threads.get(params, (error:any, body:any) => {
        if(error) {
          console.error("Failed while fetching entire thread", threadId, "error:", error)
          // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
          done()
        }
        else if(body.error) {
          console.error("Failed while fetching entire thread", threadId, "error:", body.error)
          // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
          done()
        }
        else {
          const fullThread = body
          // this.push()
          done(null, fullThread)
        }
      })
    }).catch( (error:any) => {
      console.error("Could not throttle gmail api call", error)
      done(error)
    })

	}

}