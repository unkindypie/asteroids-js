import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';

const clamp = (value, min, max) => {
  if (value > max) return max;
  if (value < min) return min;
  return value;
};

export default class Rect {
  /**
   * @param {vec2} centerPosition center of the rect
   * @param {vec2} size
   * @param {number} rotation deg
   */
  constructor(centerPosition, size = new vec2(1, 1), rotation = 0) {
    this._position = centerPosition;
    this._size = size;
    this._rotation = rotation;
  }

  /**
   * Checks collision with circle
   * @param {vec2} circlePos
   * @param {number} radius
   */
  collidesWithCircle(circlePos, radius) {
    const angle = (this.rotation - 90) * MathUtils.DEG_TO_RAD;

    // заюзав алгоритм з http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
    const rotatedCircleX =
      Math.cos(angle) * (circlePos.x - this.position.x) -
      Math.sin(angle) * (circlePos.y - this.position.y) +
      this.position.x;

    const rotatedCircleY =
      Math.sin(angle) * (circlePos.x - this.position.x) +
      Math.cos(angle) * (circlePos.y - this.position.y) +
      this.position.y;

    const clampedX = clamp(
      rotatedCircleX,
      this.position.x - this.width / 2,
      this.position.x + this.width / 2
    );
    const clampedY = clamp(
      rotatedCircleY,
      this.position.y - this.height / 2,
      this.position.y + this.height / 2
    );

    const distX = circlePos.x - clampedX;
    const distY = circlePos.y - clampedY;
    // console.log(circlePos, this.position);
    const distanceSquared = distX * distX + distY * distY;
    return distanceSquared <= radius * radius;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value;
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    this._rotation = value;
  }

  get width() {
    return this._size.x;
  }

  set width(value) {
    this._size.x = value;
  }

  get height() {
    return this._size.y;
  }

  set height(value) {
    this._size.y = value;
  }
}
