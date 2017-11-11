/// <reference types="node" />
import { Transform, TransformOptions } from "stream";
export declare type ParallelTransformOptions = TransformOptions & {
    maxParallel?: number;
};
export default class ParallelTransform extends Transform {
    /**
     * ParallelTransform instance
     * All child classes must implement the `_parallelTransform` function.
     * Child classes should not implement the `_transform` and `_flush` functions.
     *
     * @param {Object} options Options which will be passed to the
     *                         `stream.Transform` constructor
     **/
    constructor(options?: ParallelTransformOptions);
    /**
     * Helper function for easily creating ParallelTransform streams
     *
     * @param {Function} transform The stream's _transform function
     * @param {Function} flush The stream's _flush function
     * @param {Object} defaultOptions Default options for the class constructor
     * @returns {ParallelTransform} A ParallelTransform class
     **/
    /**
     * Destroys the stream
     * The results of all pending transformations will be discarded
     **/
    destroy(): void;
    /**
     * Parallises calls to this._transformFunction
     * @param {?}        chunk The chunk of data to be transformed
     * @param {string}   encoding Encoding, if `chunk` is a string
     * @param {Function} done Callback to be called when finished
     **/
    _transform(chunk: any, encoding: string, done: Function): void;
    /**
     * Called when all items have been processed
     * @param {Function} done Callback to signify when done
     **/
    _flush(done: Function): void;
    /**
     * Fire the `data` event for buffered items, in order
     * The buffer will be cleared in such a way that the
     * order of the input items is preserved. This means that calling
     * `drain` does not necessarily clear the entire buffer, as it will
     * have to wait for further results if a transformation has not yet finished
     * This function should never be called from outside this class
     **/
    _drain(): void;
    /**
     * Checks whether or not the buffer is drained
     * While receiving chunks, the buffer counts as drained as soon as
     * no more than `maxParallel` items are buffered.
     * When the stream is being flushed, the buffer counts as drained
     * if and only if it is entirely empty.
     * @return {boolean} true if drained
     **/
    _drained(): boolean;
    /**
     * The _transform function of the ParallelTransform stream
     * This function must be overriden by child classes
     * @param {?}        data Data to be transformed
     * @param {string}   encoding Encoding, if `chunk` is a string
     * @param {Function} done Callback which must be executed
     *                        when transformations have finished
     **/
    _parallelTransform(data: any, encoding: string, done: Function): void;
    /**
     * The _flush function of the ParallelTransform stream
     * This function may optionally be overriden by child classes
     * @param {Function} done Callback which must be executed
     *                        when finished
     **/
    _parallelFlush(done: Function): void;
}
