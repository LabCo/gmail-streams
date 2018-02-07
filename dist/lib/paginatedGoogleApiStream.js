"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const stream_1 = require("stream");
const winston_lab_1 = require("winston-lab");
class PaginatedGoogleApiStream extends stream_1.Readable {
    constructor(fetchFn, initialParams, objectsExtractor, objectsName, maxPages, logLevel, options) {
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
        this.logLevel = logLevel;
        this.logger = winston_lab_1.LabLogger.createFromClass(this, this.logLevel);
    }
    pushObject() {
        // if there are still threads buffered, push the buffered thread
        if (this.fetchedObjects && this.fetchedObjects.length > 0) {
            const object = this.fetchedObjects.shift();
            this.logger.debug("serving:\n", JSON.stringify(object, null, 2));
            this.push(object);
        }
        else if (this.fetchedObjects == null) {
            // no obects have been fetched in, do initial fetch
            this.fetchInNextPage(true);
        }
        else if (this.fetchedObjects.length <= 0) {
            if (this.nextPageToken && (this.maxPages == null || this.currentPage < this.maxPages)) {
                // no more threads but there is still a next page, fetch in the next page
                this.fetchInNextPage(false);
            }
            else {
                // no more threads and no more next page token, so we are done
                this.push(null);
                this.logger.debug("serving null");
                // this.emit('end', null);        
            }
        }
    }
    fetchInNextPage(isInitialFetch) {
        let params = Object.assign({}, this.initialParams);
        if (this.nextPageToken) {
            params.pageToken = this.nextPageToken;
        }
        let paramsWOutAuth = Object.assign({}, params);
        delete paramsWOutAuth["auth"];
        this.logger.info(chalk_1.default.blue.dim("Fetching next"), chalk_1.default.blue(this.objectsName), chalk_1.default.blue.dim("page with params"), JSON.stringify(paramsWOutAuth));
        this.fetchFn(params, null, (error, res) => {
            const body = res.data;
            this.logger.debug("responded for fetching", JSON.stringify(paramsWOutAuth));
            if (error) {
                this.logger.error("failed to fetch for", JSON.stringify(paramsWOutAuth), error);
                this.fetchedObjects = [];
                isInitialFetch ? this._onFirstFetchError(error) : this._onError(error);
            }
            else if (body.error) {
                this.logger.error("failed to fetch for", JSON.stringify(paramsWOutAuth), body.error);
                this.fetchedObjects = [];
                isInitialFetch ? this._onFirstFetchError(body.error) : this._onError(body.error);
            }
            else {
                this.logger.debug("fetched for", JSON.stringify(paramsWOutAuth));
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
                    this.logger.info(chalk_1.default.blue.dim("Fetched page for"), chalk_1.default.blue(this.objectsName), chalk_1.default.blue.dim("next page is:"), body.nextPageToken);
                }
                else {
                    this.logger.info(chalk_1.default.blue.dim("Fetched the last page for"), chalk_1.default.blue(this.objectsName));
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
    _onFirstFetchError(error) {
        this.logger.debug("emitting error", error);
        this.emit('error', error);
        // an error happend, so we also have to end the stream becasue an error does not end it     
        this.emit("end");
    }
    _onError(error) {
        this.logger.debug("emitting error", error);
        this.emit('error', error);
        // an error happend, so we also have to end the stream becasue an error does not end it     
        this.emit("end");
    }
    _read(size) {
        this.pushObject();
    }
}
exports.PaginatedGoogleApiStream = PaginatedGoogleApiStream;
