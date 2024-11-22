import { describe, expect, jest, test } from "@jest/globals";

import Block from "../src/domain/chain/block";
import Transaction from "../src/domain/wallet/transaction";
import BlockTranslator from "../src/infrastructure/stream/translators/block-translator";
import data from "./stubs/block.json";

describe("Block Translator", () => {
  test("it expects to translate a message into a block", () => {
    const block = BlockTranslator.fromMessage(
      Buffer.from(JSON.stringify(data)),
    );

    expect(block).toBeInstanceOf(Block);
  });

  test("it expects to translate transactions in the block", () => {
    const block = BlockTranslator.fromMessage(
      Buffer.from(JSON.stringify(data)),
    );

    block.getTransactions().forEach((transaction) => {
      expect(transaction).toBeInstanceOf(Transaction);
    });
  });

  test("it expects to recalulate hash", () => {
    const block = BlockTranslator.fromMessage(
      Buffer.from(JSON.stringify(data)),
    );

    expect(block.getHash()).not.toBe(data.hash);
  });

  test("it expects block properties to match values parsed", () => {
    const block = BlockTranslator.fromMessage(
      Buffer.from(JSON.stringify(data)),
    );

    expect(block.getDate()).toBe(data.date);
    expect(block.getKey()).toBe(data.id);
    expect(block.getDifficulty()).toBe(data.difficulty);
    expect(block.getNounce()).toBe(data.nounce);
    expect(block.getPreviousHash()).toBe(data.previousHash);
    expect(block.getTransactions().length).toBe(data.transactions.length);
  });
});
