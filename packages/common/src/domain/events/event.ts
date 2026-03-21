export default abstract class Event {
  public static toString(): string {
    return this.name;
  }

  public abstract toJson(): any;
}
