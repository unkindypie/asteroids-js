import NotImplementedError from 'base/lib/NotImplementedError';
import EnumNamingService from 'base/lib/EnumNamingService';
import Entity from 'base/Entity';

export const messages = {
  KILL: EnumNamingService.getUniqueInt(),
  COLLISION: EnumNamingService.getUniqueInt(),
};

class Component {
  /**
   *  Abstract method for receiving messages from Messaging class.
   * @param {{type: number, data: any, entity: Entity}} message
   */
  receive(message) {
    throw new NotImplementedError('receive');
  }

  /**
   * Abstract method for updating component state
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    throw new NotImplementedError('update');
  }
}

export default Component;
