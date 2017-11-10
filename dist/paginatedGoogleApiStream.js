"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const stream_1 = require("stream");
class PaginatedGoogleApiStream extends stream_1.Readable {
    constructor(fetchFn, initialParams, objectsExtractor, objectsName, maxPages, options) {
        const withObjOptions = Object.assign({}, options, { objectMode: true });
        super(withObjOptions);
        this.fetchFn = fetchFn;
        this.initialParams = initialParams;
        this.objectsExtractor = objectsExtractor;
        this.objectsName = objectsName;
        this.currentPage = 0;
        this.maxPages = maxPages;
        this.fetchedObjects = null;
        this.nextPageToken = undefined; //withObjOptions && withObjOptions.nextPageToken
    }
    pushObject() {
        // if there are still threads buffered, push the buffered thread
        if (this.fetchedObjects && this.fetchedObjects.length > 0) {
            // do nothing
        }
        else if (this.fetchedObjects == null) {
            // no obects have been fetched in, do initial fetch
            this.fetchInNextPage();
        }
        else if (this.fetchedObjects.length <= 0) {
            if (this.nextPageToken && (this.maxPages == null || this.currentPage < this.maxPages)) {
                // no more threads but there is still a next page, fetch in the next page
                this.fetchInNextPage();
            }
            else {
                // no more threads and no more next page token, so we are done
                this.push(null);
                // this.emit('end', null);        
            }
        }
    }
    fetchInNextPage() {
        let params = Object.assign({}, this.initialParams);
        if (this.nextPageToken) {
            params.pageToken = this.nextPageToken;
        }
        let paramsWOutAuth = Object.assign({}, params);
        delete paramsWOutAuth["auth"];
        console.log(chalk_1.default.blue.dim("Fetching next"), chalk_1.default.blue(this.objectsName), chalk_1.default.blue.dim("page with params"), JSON.stringify(paramsWOutAuth));
        this.fetchFn(params, (error, body) => {
            if (error) {
                this.fetchedObjects = [];
                // console.error(`Failed while getting ${this.objectsName}:`, error)
                // this.push(error, null)
                // this.push(null, null)
                this.emit('error', error);
                // this.push()
            }
            else if (body.error) {
                this.fetchedObjects = [];
                // console.error(`Failed while getting ${this.objectsName}:`, body)
                // this.push(body.error, null)
                // this.push(null, null)
                this.emit('error', body.error);
                // this.push()
            }
            else {
                // no errors emitt the threads
                // add the fetched threads
                let objects = this.objectsExtractor(body);
                // objects can not be null becasue that will create an infinite loop because null means nothingwas fetched
                // of they are null, make them an empty array
                if (objects == null) {
                    objects = [];
                }
                this.fetchedObjects = (this.fetchedObjects) ? this.fetchedObjects.concat(objects) : objects;
                if (body.nextPageToken) {
                    console.log(chalk_1.default.blue.dim("Fetched page for"), chalk_1.default.blue(this.objectsName), chalk_1.default.blue.dim("next page is:"), body.nextPageToken);
                }
                else {
                    console.log(chalk_1.default.blue.dim("Fetched the last page for"), chalk_1.default.blue(this.objectsName));
                }
                // update the next page token
                if (body.nextPageToken) {
                    this.nextPageToken = body.nextPageToken;
                }
                else {
                    this.nextPageToken = undefined;
                }
                this.currentPage += 1;
                this.pushObject();
            }
        });
    }
    _read(size) {
        this.pushObject();
    }
}
exports.PaginatedGoogleApiStream = PaginatedGoogleApiStream;
