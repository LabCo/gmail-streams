"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const gAuthHelper_1 = require("../lib/gAuthHelper");
describe("testing list streams", () => {
    const messages = [];
    let client = null;
    beforeAll(done => {
        const params = {
            before: "2016/12/15",
            after: "2016/12/08"
        };
        gAuthHelper_1.Helper.getClient().then(myClient => {
            client = myClient;
            const stream = lib_1.GmailStreams.messages(myClient, params);
            stream.on("data", data => messages.push(data));
            stream.on("error", (error) => done.fail(error));
            stream.on("end", () => done());
        });
    });
    it("fetch the expected number of messages", done => {
        expect(messages.length).toEqual(74);
        const firstMsg = messages[0];
        expect(firstMsg.snippet).toEqual("Resin Talk A brief summary of Resin Talk since your last visit on December 7 Popular posts Roombots - RPi2 and Roomba powered networked robots Projects This time it&#39;s not my own project, but");
        expect(firstMsg.internalDate).toEqual("1481757691000");
        done();
    });
});
