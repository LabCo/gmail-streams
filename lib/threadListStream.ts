import * as google from 'googleapis'
const gmail = google.gmail('v1');

import {ReadableOptions} from "stream"
import {PaginatedGoogleApiStream} from './paginatedGoogleApiStream'
import { OAuth2Client } from 'google-auth-library/types/lib/auth/oauth2client';

/**
 * @param {google.gmail.v1.Thread} out
 */
export class ThreadListStream extends PaginatedGoogleApiStream<google.gmail.v1.ListThreadsResponse, google.gmail.v1.Thread> {
  constructor(auth: OAuth2Client, query: any, options?:ReadableOptions) {
    const fetchFn = gmail.users.threads.list
    const objectsExtractor = (body:any) => body.threads

    let initialParams: any = { userId: "me", auth: auth, maxResults:1000 }
    if(query) { initialParams.q = query }

    super(fetchFn, initialParams, objectsExtractor, 'threads list');
  }
}