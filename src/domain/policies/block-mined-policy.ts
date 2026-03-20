export default class BlockMinedPolicy {
  private static char: string = '0';

  public static containsSuccessiveChars(hash: string, length: number) {
    const chars = hash.slice(0, length);

    return chars === BlockMinedPolicy.char.repeat(length);
  }
}
