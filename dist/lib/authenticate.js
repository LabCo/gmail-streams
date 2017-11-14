"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gAuthHelper_1 = require("./gAuthHelper");
gAuthHelper_1.GoogleAuthTestHelper.createClient().then(client => {
    console.log("Sucessfully authenticated");
}).catch(error => {
    console.log("ERROR, could not authenticate with gmail", error);
});
