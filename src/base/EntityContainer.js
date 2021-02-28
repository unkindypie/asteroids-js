import Entity from 'base/Entity';
import vec2 from 'base/lib/vec2';

export default class EntityContainer {
  /**
   * Creates EntityContainer
   * @param {vec2} worldDimensions
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(worldDimensions, ctx, entities = []) {
    if (!worldDimensions) throw new Error('worldDimensions are required!');
    if (!ctx) throw new Error('ctx is required!');

    this._worldDimensions = worldDimensions;
    this._ctx = ctx;
    this._entities = entities;
    this._entities.forEach((ent) => (ent.container = this));
    // buffer for entities that will be removed at the and of the frame
    this._entitiesToRemove = [];
  }

  update(delta) {
    for (let entity of this._entities) {
      entity.update(delta);
    }
    this._cleanup();
  }

  /**
   *  Adds entity to update list
   * @param {Entity} entity
   */
  add(entity) {
    entity.container = this;
    this._entities.push(entity);
  }

  /**
   *  Removes entity from update list.
   *  Will be removed at the end of .update
   * @param {Entity} entity
   */
  remove(entity) {
    this._entitiesToRemove.push(entity);
  }

  reset() {
    this._entities = [];
    this._entitiesToRemove = [];
  }

  _cleanup() {
    this._entities = this._entities.filter((entity) => {
      if (
        this._entitiesToRemove.some((removedEntity) => removedEntity === entity)
      ) {
        entity.container = undefined;
        return false;
      }
      return true;
    });
  }

  get entities() {
    return this._entities;
  }

  // set worldDimensions(value) {
  //   this._renderTargetSize = value;
  // }

  get worldDimensions() {
    return this._worldDimensions;
  }
}
