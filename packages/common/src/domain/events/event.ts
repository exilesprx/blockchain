export default abstract class Event {
  public static toString(): string {
    return this.name;
  }

  public toString(): string {
    return this.constructor.name;
  }

  public abstract toJson(): Record<string, unknown>;
}
