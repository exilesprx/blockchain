export default abstract class Event {
  private name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public static toString(): string {
    return this.name;
  }

  public abstract toJson(): any;
}
