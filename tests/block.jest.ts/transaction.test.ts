import Transaction from "../../src/wallet/transaction";

describe("Transactions", () => {

    test("it expect to have a valid transaction", () => {
        
        const transaction = new Transaction("one", "two", 30);

        expect(transaction.getReceiver()).toBe("one");
        
        expect(transaction.getSender()).toBe("two");

        expect(transaction.getAmount()).toBe(30);
    });

    test("it expects a transaction can occur between different wallets", () => {
        
        const transaction = new Transaction("one", "two", 20);

        expect(transaction.getHash()).not.toBeNull();
    });

    test("it expects a transaction should not fail using the same wallet", () => {
        
        expect(() => new Transaction("one", "one", 20)).not.toThrow(TypeError);
    });
});

