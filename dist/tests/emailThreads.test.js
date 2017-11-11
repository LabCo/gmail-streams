"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const gAuthHelper_1 = require("../lib/gAuthHelper");
describe("testing list streams", () => {
    it("do something", done => {
        const params = {
            before: "2017/01/01",
            after: "2016/12/01"
        };
        gAuthHelper_1.Helper.getClient().then(client => {
            const stream = lib_1.gmailMessagesStream(client, params);
            let counter = 0;
            stream.on("data", (data) => {
                console.log("DATA:", JSON.stringify(data, null, 2));
                counter += 1;
            });
            stream.on("error", (error) => {
                done.fail(error);
            });
            stream.on("end", () => {
                expect(counter).toEqual(42);
                done();
            });
        }).catch(error => {
            done(error);
        });
    });
});
