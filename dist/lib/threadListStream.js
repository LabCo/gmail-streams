"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("googleapis");
const gmail = google.gmail('v1');
const paginatedGoogleApiStream_1 = require("./paginatedGoogleApiStream");
/**
 * @param {google.gmail.v1.Thread} out
 */
class ThreadListStream extends paginatedGoogleApiStream_1.PaginatedGoogleApiStream {
    constructor(auth, query, params) {
        const fetchFn = gmail.users.threads.list;
        const objectsExtractor = (body) => body.threads;
        const maxResults = (params && params.maxResults) ? params.maxResults : 500;
        let initialParams = { userId: "me", auth: auth, maxResults: maxResults };
        if (query) {
            initialParams.q = query;
        }
        super(fetchFn, initialParams, objectsExtractor, 'threads list');
    }
}
exports.ThreadListStream = ThreadListStream;
