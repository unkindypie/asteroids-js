import EnumNamingService from 'base/lib/EnumNamingService';
import Component from 'base/Component';

export const messages = {
  SHOOT: EnumNamingService.getUniqueInt(),
};

/**
 * Base InputComponent interface
 */
export default class InputComponent extends Component {
  /**
   * @param {Transform} toWorldTransform
   */
  constructor(toWorldTransform) {
    if (!toWorldTransform) throw new Error('toWorldTransform is required!');

    super();
    this.toWorldTransform = toWorldTransform;
  }
}
