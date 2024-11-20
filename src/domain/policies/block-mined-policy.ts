export default class BlockMinedPolicy {
  private static char: String = "0";

  public static containsSuccessiveChars(hash: String, length: number) {
    const chars = hash.slice(0, length);

    return chars === BlockMinedPolicy.char.repeat(length);
  }
}
