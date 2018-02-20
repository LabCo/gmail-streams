"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("googleapis");
const gmail = google.gmail('v1');
const paginatedGoogleApiStream_1 = require("./paginatedGoogleApiStream");
/**
 * @param {Message} out
 */
class NewMessagesSinceStream extends paginatedGoogleApiStream_1.PaginatedGoogleApiStream {
    constructor(auth, historyId, maxPages, logLevel) {
        const fetchFn = gmail.users.history.list;
        const objectsExtractor = (body) => {
            let history = body && body.history;
            if (history == null) {
                history = [];
            }
            const addedMessages = history && history.map(h => h.messages).reduce((prev, curr) => prev.concat(curr), []); // have to flatten the arrays
            // have to remove duplicates
            const dedupedMessagesMap = addedMessages.reduce(function (mById, m) {
                if (m.id == null)
                    return mById;
                const found = mById[m.id];
                if (!found) {
                    mById[m.id] = m;
                }
                return mById;
            }, {});
            const dedupedMessages = Object.keys(dedupedMessagesMap).map(k => dedupedMessagesMap[k]);
            return dedupedMessages;
        };
        // searching for only `messageAdded` does not work, because sometimes not everuy new messages comes throug, not sure why
        const initialParams = { auth: auth, userId: "me", startHistoryId: historyId, maxResults: 1000 };
        super(fetchFn, initialParams, objectsExtractor, 'new messages list', maxPages, logLevel);
        this.historyId = historyId;
    }
    _onFirstFetchError(error) {
        if (error && error.code != null && error.code == 404) {
            // fall back to fetching the last month of emails
            this.switchToMessagesFetch();
            this.fetchInNextPage(false);
        }
        else {
            super._onFirstFetchError(error);
        }
    }
    switchToMessagesFetch() {
        const fetchFn = gmail.users.messages.list;
        const objectsExtractor = (body) => {
            const messages = body && body.messages;
            return messages;
        };
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        const secondsTime = (d.getTime() / 1000).toFixed(0);
        const initialParams = { auth: this.initialParams.auth, userId: "me", q: `after: ${secondsTime}`, maxResults: 1000 };
        this.objectsExtractor = objectsExtractor;
        this.initialParams = initialParams;
        this.fetchFn = fetchFn;
    }
}
exports.NewMessagesSinceStream = NewMessagesSinceStream;
