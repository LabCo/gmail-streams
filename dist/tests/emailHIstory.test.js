"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe("testing getting messages since a history id", () => {
    const messages = [];
    let client = null;
    beforeAll(done => {
        lib_1.GmailStreams.setLogLevel("error");
        const params = {
            before: "2016/12/15",
            after: "2016/12/08"
        };
        lib_1.GoogleAuthTestHelper.getClient().then(myClient => {
            client = myClient;
            const stream = lib_1.GmailStreams.messagesSince(myClient, "0");
            stream.on("data", data => { messages.push(data); });
            stream.on("error", (error) => done.fail(error));
            stream.on("end", () => done());
        });
    }, 20000);
    it("recover from failing to fetch by history id by fetcing the last month", () => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        console.log("length:", messages.length);
        expect(messages.length).toBeGreaterThan(0);
        const lastMessage = messages[messages.length - 1];
        const lastDate = new Date(parseInt(lastMessage.internalDate));
        expect(lastDate.getTime()).toBeGreaterThanOrEqual(d.getTime());
    });
});
