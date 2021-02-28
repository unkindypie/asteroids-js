export default class MathUtils {
  /**
   * Generates random number in range
   * @param {number} min
   * @param {number} max
   */
  static randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  /**
   * Generates random int in range
   * @param {number} min
   * @param {number} max
   */
  static randomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - min) + min);
  }
}
MathUtils.DEG_TO_RAD = 0.0174;
window.MathUtils = MathUtils;
