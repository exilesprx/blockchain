import Amount from '../src/wallet/specifications/amount';
import Receiver from '../src/wallet/specifications/receiver';
import Sender from '../src/wallet/specifications/sender';
import SameWallet from '../src/wallet/specifications/same-wallet';
import Transaction from '../src/wallet/transaction';

describe("Specifications", () => {

    test("it expects amount is satisfied by amount of 1", () => {

        const transaction = new Transaction("one", "two", 1);

        const amountSpec = new Amount();

        expect(amountSpec.isSatisfiedBy(transaction)).toBeTruthy();
    });

    test("it expects amount is not satisfied by amount of 0", () => {

        const transaction = new Transaction("one", "two", 0);

        const amountSpec = new Amount();

        expect(() => amountSpec.isSatisfiedBy(transaction)).toThrow();
    });

    test("it expects receiver is satisfied by wallet of one", () => {

        const transaction = new Transaction("one", "two", 1);

        const receiverSpec = new Receiver();

        expect(receiverSpec.isSatisfiedBy(transaction)).toBeTruthy();
    });

    test("it expects receiver is not satisfied by wallet of 1", () => {

        const transation = new Transaction(1, "two", 2);

        const receiverSpec = new Receiver();

        expect(() => receiverSpec.isSatisfiedBy(transation)).toThrow();
    });

    test("it expects sender is satisfied by wallet of two", () => {

        const transaction = new Transaction("one", "two", 1);

        const senderSpec = new Sender();

        expect(senderSpec.isSatisfiedBy(transaction)).toBeTruthy();
    });

    test("it expects sender is not satisfied by wallet of 2", () => {

        const transaction = new Transaction("one", 2, 1);

        const senderSpec = new Sender();

        expect(() => senderSpec.isSatisfiedBy(transaction)).toThrow();
    });

    test("it expects same wallet is satisfied by waller of one and two", () => {

        const transaction = new Transaction("one", "two", 1);

        const sameWalletSpec = new SameWallet();

        expect(sameWalletSpec.isSatisfiedBy(transaction)).toBeTruthy();
    });

    test("it expects same wallet is satisfied by waller of one and one", () => {
    
        const transaction = new Transaction("one", "one", 1);

        const sameWalletSpec = new SameWallet();

        expect(() => sameWalletSpec.isSatisfiedBy(transaction)).toThrow();
    });
});