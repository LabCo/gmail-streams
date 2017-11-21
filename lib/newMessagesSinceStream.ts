import * as google from 'googleapis'
const gmail = google.gmail('v1');

import {PaginatedGoogleApiStream} from './paginatedGoogleApiStream'

export declare interface NewMessagesSinceStream {
  on(event: 'data', listener: (message: google.gmail.v1.Message) => void): this;
  on(event: string, listener: Function): this;  
}

/**
 * @param {google.gmail.v1.Message} out
 */
export class NewMessagesSinceStream extends PaginatedGoogleApiStream<any, google.gmail.v1.Message> {

  test: google.Request
  
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

  _onFirstFetchError(error: any) {    
    if(error && error.code != null && error.code == 404) {
      // fall back to fetching the last month of emails

      this.switchToMessagesFetch()
      this.fetchInNextPage(false)
    } else {
      super._onFirstFetchError(error)
    }
  }

  private switchToMessagesFetch() {
    const fetchFn = gmail.users.messages.list
    const objectsExtractor = (body:google.gmail.v1.ListMessagesResponse) => {
      const messages = body && body.messages
      return messages
    }

    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const secondsTime = (d.getTime() / 1000).toFixed(0)
    const initialParams = { auth: this.initialParams.auth, userId: "me", q:`after: ${secondsTime}`, maxResults:1000 }

    this.objectsExtractor = objectsExtractor
    this.initialParams = initialParams
    this.fetchFn = fetchFn
  }
  
}