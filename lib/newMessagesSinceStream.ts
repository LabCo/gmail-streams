import * as google from 'googleapis'
const gmail = google.gmail('v1');

import {PaginatedGoogleApiStream} from './paginatedGoogleApiStream'

export class NewMessagesSinceStream extends PaginatedGoogleApiStream<google.gmail.v1.ListHistoryResponse, google.gmail.v1.Message> {

  historyId: string;

  constructor(auth: any, historyId: string, maxPages?: number) {
    const fetchFn = gmail.users.history.list

    const objectsExtractor = (body:google.gmail.v1.ListHistoryResponse) => {
      const history = body && body.history
      const addedMessages = history && history.map(h => h.messagesAdded.map( (ma) => ma.message))
        .reduce( (prev, curr) => prev.concat(curr)) // have to flatten the arrays
      return addedMessages
    }
    const initialParams = { auth: auth, userId: "me", startHistoryId: historyId, historyTypes: 'messageAdded', maxResults:1000 }

    super(fetchFn, initialParams, objectsExtractor, 'new messages list', maxPages);
    this.historyId = historyId
  }
}