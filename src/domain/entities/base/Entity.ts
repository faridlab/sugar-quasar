import { UniqueEntityId } from '@/domain/core/UniqueEntityId';

/**
 * Base class for all entities in the domain
 * Entities are defined by their identity (id), not their attributes
 */
export abstract class Entity<T> {
  protected readonly _id: UniqueEntityId;
  protected props: T;

  constructor(props: T, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  /**
   * Get the entity's unique identifier
   */
  get id(): UniqueEntityId {
    return this._id;
  }

  /**
   * Check equality based on identity
   */
  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!(entity instanceof Entity)) {
      return false;
    }

    return this._id.equals(entity._id);
  }
}
