import * as google from 'googleapis'
const gmail = google.gmail('v1');

import {ReadableOptions} from "stream"
import {PaginatedGoogleApiStream} from './paginatedGoogleApiStream'

export class ThreadListStream extends PaginatedGoogleApiStream {
  constructor(auth: any, query: any, options?:ReadableOptions) {
    const fetchFn = gmail.users.threads.list
    const objectsExtractor = (body:any) => body.threads

    let initialParams: any = { userId: "me", auth: auth, maxResults:1000 }
    if(query) { initialParams.q = query }

    super(fetchFn, initialParams, objectsExtractor, 'threads list');
  }
}