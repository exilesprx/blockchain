import { describe, expect, jest, test } from "@jest/globals";

import Block from "../src/domain/chain/block";
import BlockMined from "../src/domain/chain/specifications/mined";

describe("Mined Specification", () => {
  test("it expects the specification is not satisfied", () => {
    const block = new Block(1, 1, 1, "test", [], 0);
    const spec = new BlockMined();
    const fakeBlock = jest.mocked<Partial<Block>>({}) as Partial<Block>;
    jest.spyOn(block, "isMined").mockImplementation(() => false);

    expect(() => spec.isSatisfiedBy(fakeBlock as Block, block)).toThrow();
  });
});
