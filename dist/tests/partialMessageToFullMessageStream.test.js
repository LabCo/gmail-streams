"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const pumpify = require("pumpify");
const partialMessageToFullMessageStream_1 = require("../lib/partialMessageToFullMessageStream");
const lib_1 = require("../lib");
let client = null;
describe("testing getting full message", () => {
    it("fail gradual when accessing a not found messages", () => __awaiter(this, void 0, void 0, function* () {
        client = yield lib_1.GoogleAuthTestHelper.getClient();
        const bareMessage = {
            id: "161b49b3be396056"
        };
        var inStream = new stream_1.Readable({ objectMode: true });
        const toMessageStream = new partialMessageToFullMessageStream_1.PartialMessageToFullMessageStream(client, "info");
        const stream = pumpify.obj(inStream, toMessageStream);
        const messages = [];
        const errors = [];
        const res = yield new Promise((resolve, reject) => {
            inStream.push(bareMessage);
            inStream.push(null);
            stream.on("data", (data) => messages.push(data));
            stream.on("error", (error) => errors.push(error));
            stream.on("end", () => resolve(true));
        });
        expect(messages.length).toEqual(0);
        expect(errors.length).toEqual(0);
    }));
});
