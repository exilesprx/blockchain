export default abstract class Event {
  private name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public toString(): string {
    return this.name;
  }
}
