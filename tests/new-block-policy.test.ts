import NewBlockPolicy from '../src/domain/policies/new-block-policy';
import Transaction from '../src/domain/wallet/transaction';

describe("New block limt policy", () => {

    test("it expects not to create a new block", () => {

        const transactions: Transaction[] = new Array(1);

        expect(NewBlockPolicy.shouldCreateNewBlock(transactions)).toBeFalsy();
    });

    test("it expects to create a new block", () => {

        const transactions: Transaction[] = new Array(20);

        expect(NewBlockPolicy.shouldCreateNewBlock(transactions)).toBeTruthy();
    });

    test("it expects the limit to be 20", () => {
        
        expect(NewBlockPolicy.getBlockLimit()).toBe(20);
    });
});