/* eslint-disable no-underscore-dangle */
import { Transform, TransformOptions } from "stream"
import * as cyclist from 'cyclist'


export type ParallelTransformOptions = TransformOptions & { maxParallel?: number }

const _maxParallel: WeakMap<ParallelTransform, number> = new WeakMap()
const _destroyed: WeakMap<ParallelTransform, boolean> = new WeakMap()
const _flushed: WeakMap<ParallelTransform, boolean> = new WeakMap()
const _buffer: WeakMap<ParallelTransform, any> = new WeakMap()
const _top: WeakMap<ParallelTransform, number> = new WeakMap()
const _bottom: WeakMap<ParallelTransform, number> = new WeakMap()
const _onDrain: WeakMap<ParallelTransform, any> = new WeakMap()

export default class ParallelTransform extends Transform {

  /**
   * ParallelTransform instance
   * All child classes must implement the `_parallelTransform` function.
   * Child classes should not implement the `_transform` and `_flush` functions.
   *
   * @param {Object} options Options which will be passed to the
   *                         `stream.Transform` constructor
   **/
  constructor(options:ParallelTransformOptions = {}) {
    const maxParallel = options.maxParallel || 5
    const defaultOptions: ParallelTransformOptions = {
      maxParallel,
      highWaterMark: Math.max(maxParallel, 16)
    };

    super(Object.assign({}, defaultOptions, options));    

    // set default properties
    _maxParallel.set(this, maxParallel);
    _destroyed.set(this, false);
    _flushed.set(this, false);
    _buffer.set(this, cyclist(maxParallel));
    _top.set(this, 0);
    _bottom.set(this, 0);
    _onDrain.set(this, null);
  }

  /**
   * Helper function for easily creating ParallelTransform streams
   *
   * @param {Function} transform The stream's _transform function
   * @param {Function} flush The stream's _flush function
   * @param {Object} defaultOptions Default options for the class constructor
   * @returns {ParallelTransform} A ParallelTransform class
   **/
  // static create(transform, flush = done => done(), defaultOptions = {}) {
  //   class Transform extends ParallelTransform {
  //     constructor(options) {
  //       super(Object.assign({}, defaultOptions, options));
  //     }

  //     _parallelTransform = transform;
  //     _parallelFlush = flush;
  //   }

  //   return Transform;
  // }

  /**
   * Destroys the stream
   * The results of all pending transformations will be discarded
   **/
  destroy() {
    if (_destroyed.get(this)) {
      return;
    }

    _destroyed.set(this, true);
    this.emit('close');
  }

  /**
   * Parallises calls to this._transformFunction
   * @param {?}        chunk The chunk of data to be transformed
   * @param {string}   encoding Encoding, if `chunk` is a string
   * @param {Function} done Callback to be called when finished
   **/
  _transform(chunk:any , encoding: string, done: Function) {
    const pos = _top.get(this);
    if(pos != null) { _top.set(this, pos + 1) };

    this._parallelTransform(chunk, encoding, (err: any, data: any) => {
      if (_destroyed.get(this)) {
        return;
      }

      // abort on error
      if (err) {
        this.emit('error', err);
        this.push(null);
        this.destroy();
        return;
      }

      // insert result into corresponding place in buffer
      const result = typeof data === 'undefined' ? null : data;
      _buffer.get(this).put(pos, result);

      // attempt to drain the buffer
      this._drain();
    });

    // immediatelly signal `done` if no more than `maxParallel` results buffered
    const topV = _top.get(this) || 0
    const bottomV = _bottom.get(this) || 0
    const maxParallelV = _maxParallel.get(this) || 0
    if (topV - bottomV < maxParallelV) {
      done();
      return;
    }

    // otherwise wait until a transformation finished
    _onDrain.set(this, done);
  }

  /**
   * Called when all items have been processed
   * @param {Function} done Callback to signify when done
   **/
  _flush(done: Function) {
    _flushed.set(this, true);
    _onDrain.set(this, () => {
      this._parallelFlush(done);
    });
    this._drain();
  }

  /**
   * Fire the `data` event for buffered items, in order
   * The buffer will be cleared in such a way that the
   * order of the input items is preserved. This means that calling
   * `drain` does not necessarily clear the entire buffer, as it will
   * have to wait for further results if a transformation has not yet finished
   * This function should never be called from outside this class
   **/
  _drain() {
    const buffer = _buffer.get(this);
    let bottom = _bottom.get(this) || 0;

    // clear the buffer until we reach an item who's result has not yet arrived
    while (typeof buffer.get(bottom) !== 'undefined') {
      const data = buffer.del(bottom++);
      _bottom.set(this, bottom);

      if (data === null) {
        continue;
      }

      this.push(data);
    }

    // call `onDrain` if the buffer is drained
    const onDrain = _onDrain.get(this);
    if (this._drained() && onDrain) {
      _onDrain.set(this, null);
      onDrain();
    }
  }

  /**
   * Checks whether or not the buffer is drained
   * While receiving chunks, the buffer counts as drained as soon as
   * no more than `maxParallel` items are buffered.
   * When the stream is being flushed, the buffer counts as drained
   * if and only if it is entirely empty.
   * @return {boolean} true if drained
   **/
  _drained() {
    const diff = (_top.get(this) || 0) - (_bottom.get(this) || 0); 
    return _flushed.get(this) ? !diff : diff < (_maxParallel.get(this) || 0);
  }

  /**
   * The _transform function of the ParallelTransform stream
   * This function must be overriden by child classes
   * @param {?}        data Data to be transformed
   * @param {string}   encoding Encoding, if `chunk` is a string
   * @param {Function} done Callback which must be executed
   *                        when transformations have finished
   **/
  _parallelTransform(data: any, encoding: string, done: Function) { // eslint-disable-line no-unused-vars, max-len
    throw new Error('_parallelTransform not implemented');
  }

  /**
   * The _flush function of the ParallelTransform stream
   * This function may optionally be overriden by child classes
   * @param {Function} done Callback which must be executed
   *                        when finished
   **/
  _parallelFlush(done: Function) {
    done();
  }
}