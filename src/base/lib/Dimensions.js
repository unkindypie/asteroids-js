import vec2 from 'base/lib/vec2';

export default class Dimensions {
  /**
   * @param {vec2} position
   * @param {vec2} size
   */
  constructor(position, size) {
    this._position = position;
    this._size = size;
  }

  get position() {
    return this._position;
  }

  get size() {
    return this._size;
  }

  set position(value) {
    this._position = value;
  }

  set size(value) {
    this._size = value;
  }

  get left() {
    return this._position.x;
  }

  get right() {
    return this._position.x + this._size.x;
  }

  get top() {
    return this._position.y;
  }

  get bottom() {
    return this._position.y + this._size.y;
  }
}
