import NotImplementedError from 'base/lib/NotImplementedError';

/**
 * util class for vector math
 */
export default class vec2 {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(value) {
    this._x = value;
    if (this._length) this._length = undefined;
  }

  set y(value) {
    this._y = value;
    if (this._length) this._length = undefined;
  }

  /**
   * @returns {number}
   */
  get length() {
    if (this._length) return this._length;

    return (this._length = Math.sqrt(this.x * this.x + this.y * this.y));
  }

  /**
   * @returns {vec2}
   */
  get normalized() {
    return new vec2(this._x / this.length, this._y / this.length);
  }

  /**
   * Sums two vectors
   * @param {vec2} vec
   */
  sum(vec) {
    return new vec2(this._x + vec.x, this._y + vec.y);
  }

  /**
   * Subtracts two vectors
   * @param {vec2} vec
   */
  sub(vec) {
    return new vec2(this._x - vec.x, this._y - vec.y);
  }

  mul(scalar) {
    return new vec2(this._x * scalar, this._y * scalar);
  }

  divide(scalar) {
    return new vec2(this._x / scalar, this._y / scalar);
  }

  clone() {
    return new vec2(this.x, this.y);
  }
}
