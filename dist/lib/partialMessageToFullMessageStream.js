"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("googleapis");
const gmail = google.gmail('v1');
const winston_lab_1 = require("winston-lab");
const LeakyBucket = require('leaky-bucket');
const parallelTransform_1 = require("./parallelTransform");
class PartialMessageToFullMessageStream extends parallelTransform_1.default {
    constructor(auth, logLevel) {
        const withObjOptions = { objectMode: true, maxParallel: 40 };
        super(withObjOptions);
        this.auth = auth;
        this.limiter = new LeakyBucket(200, 1, 100000);
        this.logger = winston_lab_1.LabLogger.createFromClass(this, logLevel);
    }
    _parallelTransform(partialMessage, encoding, done) {
        const messageId = partialMessage.id;
        if (messageId == null) {
            this.push("message id is null");
            return;
        }
        const params = { userId: "me", auth: this.auth, id: messageId, format: 'metadata' };
        this.limiter.throttle(5).then((v) => {
            gmail.users.messages.get(params, {}, (error, response) => {
                const body = response.data;
                if (error) {
                    // some messages might have been deleted, so skip 404 errors
                    if (response.status == 404) {
                        this.logger.debug(`message ${messageId} was deleted`);
                        done();
                    }
                    else {
                        this.logger.error("Failed to fetch message", messageId, "error:", error);
                        // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
                        done();
                    }
                }
                else if (body.error) {
                    // some messages might have been deleted, so skip 404 errors
                    if (body.error.code == 404) {
                        done();
                    }
                    else {
                        this.logger.error("Failed to fetch message", messageId, "error:", body.error);
                        // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
                        done();
                    }
                }
                else {
                    const fullMessage = body;
                    done(null, fullMessage);
                }
            });
        }).catch((error) => {
            this.logger.error("Could not throttle gmail message api call", error);
            done(error);
        });
    }
}
exports.PartialMessageToFullMessageStream = PartialMessageToFullMessageStream;
