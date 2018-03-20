"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("googleapis");
const gmail = google.gmail('v1');
const LeakyBucket = require("leaky-bucket");
const winston_lab_1 = require("winston-lab");
const parallelTransform_1 = require("./parallelTransform");
/**
 * @param {Thread} in
 * @param {Thread} out
 */
class ParitalThreadToFullThreadStream extends parallelTransform_1.default {
    constructor(auth, additionalParams, logLevel) {
        const withObjOptions = { objectMode: true, maxParallel: 40 };
        super(withObjOptions);
        this.auth = auth;
        this.limiter = new LeakyBucket(200, 1, 100000);
        this.additionalParams = additionalParams;
        this.logger = winston_lab_1.LabLogger.createFromClass(this, logLevel);
    }
    _parallelTransform(partialThread, encoding, done) {
        const threadId = partialThread.id;
        const defaultParams = { userId: "me", auth: this.auth, id: threadId, format: 'metadata' };
        const params = Object.assign({}, defaultParams, this.additionalParams);
        this.limiter.throttle(10).then((v) => {
            gmail.users.threads.get(params, (error, response) => {
                const body = response.data;
                if (error) {
                    this.logger.error("Failed to fetch thread", threadId, "error:", error);
                    // do not want to emit an error becasue the will break processing, so just label as done and emit nothing
                    done();
                }
                else if (body.error) {
                    this.logger.error("Failed to fetch thread", threadId, "error:", body.error);
                    // do not want to emit an error becasue that will break processing, so just label as done and emit nothing
                    done();
                }
                else {
                    const fullThread = body;
                    // this.push()
                    done(null, fullThread);
                }
            });
        }).catch((error) => {
            this.logger.error("Could not throttle gmail api call", error);
            done(error);
        });
    }
}
exports.ParitalThreadToFullThreadStream = ParitalThreadToFullThreadStream;
