export default abstract class Topic {
  private name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  public toString(): string {
    return this.name;
  }
}
