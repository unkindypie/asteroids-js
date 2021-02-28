import vec2 from 'base/lib/vec2';
import EnumNamingService from 'base/lib/EnumNamingService';
import InputComponent, {
  messages as baseInputMessages,
} from 'base/components/InputComponent';
import Transform from 'base/lib/Transform';
import Entity from 'base/Entity';

export const messages = {
  MOVE_UP: EnumNamingService.getUniqueInt(),
  MOVE_LEFT: EnumNamingService.getUniqueInt(),
  MOVE_RIGHT: EnumNamingService.getUniqueInt(),
};

export default class PlayerInputComponent extends InputComponent {
  /**
   * @param {Transform} toWorldTransform
   */
  constructor(toWorldTransform) {
    super(toWorldTransform);

    const createMoveHandler = (value) => {
      return (e) => {
        if (!this.entity) return;

        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            this.entity.send({ type: messages.MOVE_UP, data: value });
            break;
          case 'KeyD':
          case 'ArrowRight':
            this.entity.send({ type: messages.MOVE_RIGHT, data: value });
            break;
          case 'KeyA':
          case 'ArrowLeft':
            this.entity.send({ type: messages.MOVE_LEFT, data: value });
            break;
          case 'Space':
          case 'Enter':
            this.entity.send({ type: baseInputMessages.SHOOT, data: value });
        }
      };
    };

    window.addEventListener('keydown', createMoveHandler(true));
    window.addEventListener('keyup', createMoveHandler(false));
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    this.entity = entity;
  }

  receive({ type }) {}
}
