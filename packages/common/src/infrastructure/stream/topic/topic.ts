export default abstract class Topic {
  protected constructor(private name: string) {}

  public toString(): string {
    return this.name;
  }
}
