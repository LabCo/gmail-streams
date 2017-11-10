"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("googleapis");
const gmail = google.gmail('v1');
const paginatedGoogleApiStream_1 = require("./paginatedGoogleApiStream");
class ThreadListStream extends paginatedGoogleApiStream_1.PaginatedGoogleApiStream {
    constructor(auth, query, options) {
        const fetchFn = gmail.users.threads.list;
        const objectsExtractor = (body) => body.threads;
        let initialParams = { userId: "me", auth: auth, maxResults: 1000 };
        if (query) {
            initialParams.q = query;
        }
        super(fetchFn, initialParams, objectsExtractor, 'threads list');
    }
}
exports.ThreadListStream = ThreadListStream;
