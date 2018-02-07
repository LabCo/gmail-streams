"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const threadListStream_1 = require("./threadListStream");
const paritalThreadToFullThreadStream_1 = require("./paritalThreadToFullThreadStream");
const fullThreadToMessageStream_1 = require("./fullThreadToMessageStream");
const newMessagesSinceStream_1 = require("./newMessagesSinceStream");
const partialMessageToFullMessageStream_1 = require("./partialMessageToFullMessageStream");
const pumpify = require("pumpify");
var gAuthHelper_1 = require("./gAuthHelper");
exports.GoogleAuthTestHelper = gAuthHelper_1.GoogleAuthTestHelper;
class GmailStreams {
    static setLogLevel(level) {
        this.logLevel = level;
    }
    /**
     * @param authClient
     * @param params
     *
     * @returns stream with {Message} as data
     */
    static messages(authClient, params) {
        if (authClient == null) {
            throw new Error("authClient is not defined");
        }
        const qArray = [];
        if (params && params.from) {
            qArray.push(`from:${params.from}`);
        }
        if (params && params.before) {
            qArray.push(`before:${params.before}`);
        }
        if (params && params.after) {
            qArray.push(`after:${params.after}`);
        }
        const qString = (qArray.length > 0) ? qArray.join(" ") : null;
        const threadListStream = new threadListStream_1.ThreadListStream(authClient, qString, undefined, this.logLevel);
        const fullThreadStream = new paritalThreadToFullThreadStream_1.ParitalThreadToFullThreadStream(authClient, this.logLevel);
        const gmailMessageStream = new fullThreadToMessageStream_1.FullThreadToMessageStream(authClient);
        const messagesStream = pumpify.obj(threadListStream, fullThreadStream, gmailMessageStream);
        return messagesStream;
    }
    /**
      * @param authClient
      * @param historyId
      *
      * @returns stream with {Message} as data
      */
    static messagesSince(authClient, historyId) {
        if (historyId == null) {
            throw new Error("historyId is not defined");
        }
        if (!(typeof historyId === 'string')) {
            throw new Error("historyId is not a string");
        }
        const newMessagesStream = new newMessagesSinceStream_1.NewMessagesSinceStream(authClient, historyId, undefined, this.logLevel);
        const gmailMessageStream = new partialMessageToFullMessageStream_1.PartialMessageToFullMessageStream(authClient, this.logLevel);
        const dummyStream = new DummyTransform();
        // have to pass a dummy transform because pumpify does not work when the last stream
        // is a ParallelTransform 
        const stream = pumpify.obj(newMessagesStream, gmailMessageStream, dummyStream);
        return stream;
    }
}
GmailStreams.logLevel = "debug";
exports.GmailStreams = GmailStreams;
class DummyTransform extends stream_1.Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(data, encoding, done) {
        done(null, data);
    }
}
