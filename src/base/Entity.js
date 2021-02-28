import vec2 from 'base/lib/vec2';
import Dimensions from 'base/lib/Dimensions';
import Component, { messages } from 'base/Component';
import Rect from 'base/lib/Rect';

/**
 * Entity is container for components with shared
 * messaging namespace and world coordinates
 */
export default class Entity {
  /**
   * @param {Rect} rect if it's circle width/2 will be the radius
   * @param {Array<Component>} components
   */
  constructor(rect, components) {
    this._rect = rect;
    this._components = components;
  }

  update(delta) {
    for (let component of this.components) {
      component.update(this, delta);
    }
  }

  // Це щось типу медіатора для того щоб розвʼязати компоненти
  // одне від одного та не робити лиха типу розшарених стейтів.

  /**
   * Broadcasts message to components
   * @param {{type: number, entity: Entity, data: any}} message
   */
  send(message) {
    message.entity = this;
    for (let component of this.components) {
      component.receive(message);
    }
  }

  remove() {
    this.send({ type: messages.KILL });
    this.container.remove(this);
  }

  /**
   * Get component by it's constructor
   * @param {Function} constructor
   * @returns {Component | null}
   */
  getComponent(constructor) {
    for (let component of this._components) {
      if (component.constructor === constructor) {
        return component;
      }
    }
    return null;
  }

  get components() {
    return this._components;
  }

  get position() {
    return this._rect.position;
  }

  set position(value) {
    this._rect.position = value;
  }

  get size() {
    return this._rect.size;
  }

  set size(value) {
    this._rect.size = value;
  }

  get rect() {
    return this._rect;
  }

  get rotation() {
    return this._rect.rotation;
  }

  set rotation(value) {
    this._rect.rotation = value;
  }
}
