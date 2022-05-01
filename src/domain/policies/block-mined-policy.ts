export default class BlockMinedPolicy {
  private static char: String = '0';

  public static mined(hash: String, difficulty: number) {
    const chars = hash.slice(0, difficulty);

    return chars === BlockMinedPolicy.char.repeat(difficulty);
  }
}
