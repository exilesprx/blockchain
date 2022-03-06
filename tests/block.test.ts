import Block from "../src/domain/chain/block";
import Transaction from "../src/domain/wallet/transaction";

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

    test("it expects to create a transaction from a mongo model", () => {

        const transactionModel = { id: 1, to: 1, from: 2, amount: 3, date: 1234, hash: "test" };

        const blockModel = new BlockModel(
            {
                id: 1,
                transactions: [transactionModel],
                nounce: 0,
                difficulty: 0,
                previousHash: "test-1",
                hash: "test",
                date: Date.now()
            }
        );

        jest.spyOn(Transaction, "fromModel");

        const block = Block.fromModel(blockModel);

        expect(Transaction.fromModel).toBeCalledTimes(1);

        expect(Transaction.fromModel).toBeCalledWith(transactionModel);

        expect(block.getTransactionCount()).toBe(1);
    });
});