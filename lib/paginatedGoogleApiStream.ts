import chalk from  "chalk"
import { Readable, ReadableOptions } from 'stream'
import { LabLogger } from "winston-lab"
import * as winston from "winston"

export type GApiCallback<T> = (error: any, body: T, response: any) => void

export interface GApiRes {
  nextPageToken: string
}

export interface GApiOptions {
  maxResults: number
}

export abstract class PaginatedGoogleApiStream<T extends GApiRes, O> extends Readable {

  protected fetchFn: (params:any, cb:GApiCallback<T>) => void
  protected initialParams: any
  protected objectsExtractor: (body:T) => O[]
  objectsName: string
  currentPage: number
  maxPages?: number
  fetchedObjects: any
  nextPageToken?: string

  protected logLevel: string | undefined
  logger: winston.LoggerInstance

  constructor(fetchFn: (params:any, cb:GApiCallback<T>) => void, 
              initialParams: any, 
              objectsExtractor: (body:T) => O[], 
              objectsName: string, 
              maxPages?: number, 
              logLevel?:string,
              options?:ReadableOptions ) {
    const withObjOptions = Object.assign({}, options, { objectMode:true })
    super(withObjOptions);

    this.fetchFn = fetchFn
    this.initialParams = initialParams
    this.objectsExtractor = objectsExtractor
    this.objectsName = objectsName

    this.currentPage = 0
    this.maxPages = maxPages
    
    this.fetchedObjects = null
    this.nextPageToken = undefined//withObjOptions && withObjOptions.nextPageToken
    this.logLevel = logLevel

    this.logger = LabLogger.createFromClass(this, this.logLevel)
  }

  pushObject() {
    // if there are still threads buffered, push the buffered thread
    if(this.fetchedObjects && this.fetchedObjects.length > 0) {
      const object = this.fetchedObjects.shift()

      this.logger.debug("serving:\n", JSON.stringify(object, null, 2))
      this.push(object)
    }
    else if(this.fetchedObjects == null) {
      // no obects have been fetched in, do initial fetch
      this.fetchInNextPage(true)
    }
    else if(this.fetchedObjects.length <= 0) {
      if(this.nextPageToken && (this.maxPages == null || this.currentPage < this.maxPages) ) {
        // no more threads but there is still a next page, fetch in the next page
        this.fetchInNextPage(false)
      } else {
        // no more threads and no more next page token, so we are done
        this.push(null)
        this.logger.debug("serving null")
        // this.emit('end', null);        
      }
    }
  }

  protected fetchInNextPage(isInitialFetch: boolean) {
    let params = Object.assign({}, this.initialParams)
    if(this.nextPageToken) { params.pageToken = this.nextPageToken }

    let paramsWOutAuth = Object.assign({}, params)
    delete paramsWOutAuth["auth"]

    this.logger.info(chalk.blue.dim("Fetching next"), chalk.blue(this.objectsName), chalk.blue.dim("page with params"), JSON.stringify(paramsWOutAuth))

    this.fetchFn(params, (error, body) => {
      this.logger.debug("responded for fetching", JSON.stringify(paramsWOutAuth))

      if(error) {
        this.logger.error("failed to fetch for", JSON.stringify(paramsWOutAuth), error)

        this.fetchedObjects = []
        isInitialFetch ? this._onFirstFetchError(error) : this._onError(error)
      }
      else if((<any>body).error) {
        this.logger.error("failed to fetch for", JSON.stringify(paramsWOutAuth), error)        

        this.fetchedObjects = []
        isInitialFetch ? this._onFirstFetchError((<any>body).error) : this._onError((<any>body).error)
      }
      else {
        // no errors emitt the threads

        // add the fetched threads
        let objects = this.objectsExtractor(body)
        // objects can not be null becasue that will create an infinite loop because null means nothingwas fetched
        // of they are null, make them an empty array
        if(objects == null) { objects = [] }

        this.fetchedObjects = (this.fetchedObjects) ? this.fetchedObjects.concat(objects) : objects

        if(body.nextPageToken) {
          this.logger.info(chalk.blue.dim("Fetched page for"), chalk.blue(this.objectsName), chalk.blue.dim("next page is:"), body.nextPageToken)
        } else {
          this.logger.info(chalk.blue.dim("Fetched the last page for"), chalk.blue(this.objectsName))
        }

        // update the next page token
        if(body.nextPageToken) { this.nextPageToken = body.nextPageToken }
        else { this.nextPageToken = undefined }

        this.currentPage += 1
        this.pushObject()
      }
    })
  }

  _onFirstFetchError(error: any) {
    this.logger.debug("emitting error", error)
    this.emit('error', error);        
  }

  _onError(error: any) {
    this.logger.debug("emitting error", error)    
    this.emit('error', error);    
  }

  _read(size: number) {
    this.pushObject()
  }
}