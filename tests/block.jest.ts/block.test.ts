import Block from "../../src/chain/block";

describe("Block", () => {

    test("it expects to have zero transactions", () => {
        const block = new Block(1, 0, 0, "test", []);

        expect(block.getTransactionCount()).toBe(0);
    });

    test("it expects to have 1 transaction", () => {
        const block = new Block(1, 0, 0, "test", [1]);

        expect(block.getTransactionCount()).toBe(1);
    })
});