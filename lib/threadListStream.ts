import * as google from 'googleapis'
const gmail = google.gmail('v1');

import {ReadableOptions} from "stream"
import {PaginatedGoogleApiStream, GApiOptions} from './paginatedGoogleApiStream'
import {OAuth2Client} from 'google-auth-library'

import {Thread, ListThreadsResponse} from './types'


export declare interface ThreadListStream {
  on(event: 'data', listener: (message: Thread) => void): this;
  on(event: string, listener: Function): this;  
}

/**
 * @param {Thread} out
 */
export class ThreadListStream extends PaginatedGoogleApiStream<ListThreadsResponse, Thread> {
  constructor(auth: OAuth2Client, query: any, params?:GApiOptions, logLevel?:string) {

    const fetchFn = gmail.users.threads.list
    const objectsExtractor = (body:any) => body.threads

    const maxResults = (params && params.maxResults) ? params.maxResults : 500

    let initialParams: any = { userId: "me", auth: auth, maxResults:maxResults }
    if(query) { initialParams.q = query }

    super(fetchFn, initialParams, objectsExtractor, 'threads list', undefined, logLevel);
  }
}