"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const threadListStream_1 = require("../lib/threadListStream");
const gAuthHelper_1 = require("../lib/gAuthHelper");
describe("testing list streams", () => {
    let client = null;
    beforeAll(done => {
        gAuthHelper_1.Helper.getClient().then(myClient => {
            client = myClient;
            done();
        }).catch(error => {
            done.fail(error);
        });
    });
    it("test pagination", done => {
        const threads = [];
        const query = "before:1481961600 after:1481270400";
        let counter = 0;
        const stream = new threadListStream_1.ThreadListStream(client, query, { maxResults: 4 });
        stream.on("data", data => threads.push(data));
        stream.on("error", (error) => done.fail(error));
        stream.on("end", () => {
            expect(threads.length).toEqual(12);
            const expectedThreadIds = [
                "1590aced2ab21e98",
                "15908ee5516a6e14",
                "15904392f0b2dbb0",
                "159031e7d34bfe26",
                "158ffa4158aa29f9",
                "158ff9653416e19f",
                "158f9739b9fc892e",
                "158f8cfcc43f8c98",
                "158f8b959f7ab276",
                "158e5a91ee482b66",
                "158e56007499acc7",
                "158e11590493f05a"
            ];
            const threadIds = threads.map(t => t.id);
            expect(threadIds).toEqual(expectedThreadIds);
            const messages = threads.map(t => t.messages).filter(v => v != null);
            expect(messages.length).toEqual(0);
            const snippets = threads.map(t => t.snippet).filter(v => v != null);
            const expectedSnippets = [
                "OpenWeatherMap.org Thank you for the subscription to OpenWeatherMap Free service! Dear Customer, Your account and API key are activated for operating with OpenWeatherMap Free weather services. Endpoint",
                "Hi Michael, We&#39;re always looking for new ways to improve how you create and work together using Dropbox. That&#39;s why we recently launched several new productivity tools and sharing features. And",
                "View in Browser December 2016 Announcing the New Heroku CLI: Performance and Readability Enhancements Learn how to take advantage of the CLI&#39;s faster performance and new usability features. Apache",
                "It&#39;s your complete design to development workflow. We recently shared Inspect, a tool that lets you and the developers on your team generate code, gather key information—like font names, hex codes,",
                "Resin Talk A brief summary of Resin Talk since your last visit on December 7 Popular posts Roombots - RPi2 and Roomba powered networked robots Projects This time it&#39;s not my own project, but",
                "A brief summary since your last visit on December 7 Resin.io Forums Since your last visit 3 4 1 New Topics Unread Notifications Unread Messages Popular Topics Projects December 9 Roombots - RPi2 and",
                "Nylas N1 - Love your inbox Hi there—Michael here, co-founder and CEO of Nylas. I&#39;ve got some great news to share. The Nylas N1 Salesforce integration is now available for everyone! Even more",
                "Hello! We try to send emails as rarely as possible, but the thing is, this simple two-question survey is one of the easiest ways for us to keep track of how Slack is working for people, and how we can",
                "Plus getting crazy with rotate copies in Sketch, using your closet as your personal design style guide, and more! View in browser InVision App This Week at InVision DEC. 12 - DEC. 16, 2016 Getting",
                "Take a look. Your Outside camera spotted a person at 2:16 PM on 12/9/16. Activity Detected! CHECK VIDEO HISTORY You got this email because you&#39;re signed up for camera alerts. Change your settings",
                "Take a look. Your Outside camera thinks it spotted a person at 12:56 PM on 12/9/16. Activity Detected! CHECK VIDEO HISTORY You got this email because you&#39;re signed up for camera alerts. Change your",
                "Take a look. Your Outside camera noticed some Close Zone activity at 3:14 PM on 12/9/16. Activity Detected! CHECK VIDEO HISTORY You got this email because you&#39;re signed up for camera alerts. Change"
            ];
            expect(snippets).toEqual(expectedSnippets);
            done();
        });
    }, 10000);
});
