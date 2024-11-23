import { describe, expect, test } from "@jest/globals";

import Block from "../src/domain/chain/block";
import Link from "../src/domain/chain/specifications/link";

describe("Link specification", () => {
  beforeAll(() => {
    //
  });

  test("it expects specification to fail", () => {
    const previousBlock = new Block(1, 1, 1, "", [], 0);
    const currentBlock = new Block(1, 1, 1, "", [], 0);
    const link = new Link();

    expect(() => link.isSatisfiedBy(previousBlock, currentBlock)).toThrow();
  });

  test("it expects specification to succeed", () => {
    const previousBlock = new Block(1, 1, 1, "", [], 0);
    const currentBlock = new Block(
      1,
      1,
      1,
      previousBlock.getHash(),
      [],
      20241120,
    );
    const link = new Link();

    expect(() => link.isSatisfiedBy(previousBlock, currentBlock)).not.toThrow();
  });
});
