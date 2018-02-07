"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
/**
 * @param {Thread} in
 * @param {Message} out
 */
class FullThreadToMessageStream extends stream_1.Transform {
    constructor(auth) {
        super({ objectMode: true });
        this.auth = auth;
    }
    _transform(fullThread, encoding, done) {
        const messages = fullThread.messages;
        if (messages == null) {
            const errorMsg = "full thread object is missing messages";
            this.emit('error', errorMsg);
        }
        else {
            messages.forEach(message => this.push(message));
        }
        done();
    }
    ;
}
exports.FullThreadToMessageStream = FullThreadToMessageStream;
