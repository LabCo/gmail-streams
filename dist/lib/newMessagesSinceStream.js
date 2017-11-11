"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("googleapis");
const gmail = google.gmail('v1');
const paginatedGoogleApiStream_1 = require("./paginatedGoogleApiStream");
class NewMessagesSinceStream extends paginatedGoogleApiStream_1.PaginatedGoogleApiStream {
    constructor(auth, historyId, maxPages) {
        const fetchFn = gmail.users.history.list;
        const objectsExtractor = (body) => {
            const history = body && body.history;
            const addedMessages = history && history.map(h => h.messagesAdded.map((ma) => ma.message))
                .reduce((prev, curr) => prev.concat(curr)); // have to flatten the arrays
            return addedMessages;
        };
        const initialParams = { auth: auth, userId: "me", startHistoryId: historyId, historyTypes: 'messageAdded', maxResults: 1000 };
        super(fetchFn, initialParams, objectsExtractor, 'new messages list', maxPages);
        this.historyId = historyId;
    }
}
exports.NewMessagesSinceStream = NewMessagesSinceStream;
