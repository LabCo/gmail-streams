"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const threadListStream_1 = require("./threadListStream");
const paritalThreadToFullThreadStream_1 = require("./paritalThreadToFullThreadStream");
const fullThreadToMessageStream_1 = require("./fullThreadToMessageStream");
const newMessagesSinceStream_1 = require("./newMessagesSinceStream");
const partialMessageToFullMessageStream_1 = require("./partialMessageToFullMessageStream");
const pumpify = require("pumpify");
function gmailMessagesStream(account, auth, params) {
    if (auth == null) {
        throw new Error("auth is not defined");
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
    const threadListStream = new threadListStream_1.ThreadListStream(auth, qString);
    const fullThreadStream = new paritalThreadToFullThreadStream_1.ParitalThreadToFullThreadStream(auth);
    const gmailMessageStream = new fullThreadToMessageStream_1.FullThreadToMessageStream(auth);
    const messagesStream = pumpify(threadListStream, fullThreadStream, gmailMessageStream);
    // // threadListStream.on( "data",  (thread) => console.log("thread:", thread) )
    // threadListStream.on( "error", error => console.error( chalk.red.bold("ERROR: failed fetching thread list,"), error ) );
    // threadListStream.on( "end", end => console.log( chalk.green.dim( "finished fetchng threads:" ) ) );
    // // fullThreadStream.on( "data",  (thread) => console.log("thread id:", thread.id) )
    // fullThreadStream.on( "error", error => console.error( chalk.red.bold( "ERROR: failed fetching full thread," ), error ) );
    // fullThreadStream.on( "end", end => console.log( chalk.green.dim( "finished fetchng full threads:" ) ) );
    // let messagesCount = 0
    // gmailMessageStream.on( "data",  (message) => messagesCount += 1 )
    // gmailMessageStream.on( "error", error => console.error( chalk.red.bold( "ERROR: failed extracting messages from thread," ), error ) );
    // gmailMessageStream.on( "end", end => console.log( chalk.green.dim( `finished extracting ${messagesCount} messgaes from threads` ) ) );
    // const stream = threadListStream.pipe(fullThreadStream).pipe(gmailMessageStream)
    return messagesStream;
}
exports.gmailMessagesStream = gmailMessagesStream;
function gmailMessagesSinceHistoryIdStream(account, auth, historyId, disableLogging) {
    if (auth == null) {
        throw new Error("auth is not defined");
    }
    if (historyId == null) {
        throw new Error("historyId is not defined");
    }
    if (!(typeof historyId === 'string')) {
        throw new Error("historyId is not a string");
    }
    const newMessagesStream = new newMessagesSinceStream_1.NewMessagesSinceStream(auth, historyId);
    const gmailMessageStream = new partialMessageToFullMessageStream_1.PartialMessageToFullMessageStream(auth);
    let newMessageCount = 0;
    newMessagesStream.on("data", (message) => newMessageCount += 1);
    newMessagesStream.on("error", error => console.log(chalk_1.default.red.bold(`ERROR: failed to fetch messages since ${historyId}`), error));
    newMessagesStream.on("end", (end) => {
        if (!disableLogging) {
            console.log(chalk_1.default.green.bold(`finished fetchng ${newMessageCount} new messages since ${historyId} for ${account}`));
        }
    });
    // gmailMessageStream.on( "data",  (message) => console.log("fetched full message:", message.id) )
    gmailMessageStream.on("error", error => console.log(chalk_1.default.red.bold("ERROR: failed fetching full messages"), error));
    gmailMessageStream.on("end", (end) => {
        if (!disableLogging) {
            console.log(chalk_1.default.green.bold("finished fetchng full messages"));
        }
    });
    const stream = newMessagesStream.pipe(gmailMessageStream);
    return stream;
}
exports.gmailMessagesSinceHistoryIdStream = gmailMessagesSinceHistoryIdStream;
