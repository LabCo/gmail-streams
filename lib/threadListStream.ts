import * as google from 'googleapis'
const gmail = google.gmail('v1');

import {ReadableOptions} from "stream"
import {PaginatedGoogleApiStream, GApiOptions} from './paginatedGoogleApiStream'
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';

export declare interface ThreadListStream {
  on(event: 'data', listener: (message: google.gmail.v1.Thread) => void): this;
  on(event: string, listener: Function): this;  
}

/**
 * @param {google.gmail.v1.Thread} out
 */
export class ThreadListStream extends PaginatedGoogleApiStream<google.gmail.v1.ListThreadsResponse, google.gmail.v1.Thread> {
  constructor(auth: OAuth2Client, query: any, params?:GApiOptions) {
    const fetchFn = gmail.users.threads.list
    const objectsExtractor = (body:any) => body.threads

    const maxResults = (params && params.maxResults) ? params.maxResults : 500

    let initialParams: any = { userId: "me", auth: auth, maxResults:maxResults }
    if(query) { initialParams.q = query }

    super(fetchFn, initialParams, objectsExtractor, 'threads list');
  }
}