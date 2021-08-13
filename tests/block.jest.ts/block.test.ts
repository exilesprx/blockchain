import Block from "../../src/chain/block";
import Transaction from "../../src/wallet/transaction";

describe("Block", () => {

    test("it expects to have zero transactions", () => {

        const block = new Block(1, 0, 0, "test", []);

        expect(block.getTransactionCount()).toBe(0);

        expect(block.getKey()).toBe(1);
    });

    test("it expects to have 1 transaction", () => {

        const transaction = new Transaction("tester1", "tester2", 3);

        const block = new Block(1, 0, 0, "test", [transaction]);

        expect(block.getTransactionCount()).toBe(1);

        expect(block.getKey()).toBe(1);
    });

    test("it expects two different blocks to have unique hashes", () => {
        
        const firstBlock = new Block(1, 0, 0, "test", []);

        const secondBlock = new Block(1, 0, 0, "test-1", []);

        expect(firstBlock.getHash()).not.toBe(secondBlock.getHash());

        expect(firstBlock.getKey()).toBe(1);

        expect(secondBlock.getKey()).toBe(1);
    });
});