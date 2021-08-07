import Block from '../../src/chain/block';
import Blockchain from '../../src/chain/blockchain';
import Events from '../../src/events/emitter';
import NewBlockPolicy from '../../src/policies/new-block-policy';
import Transaction from '../../src/wallet/transaction';

jest.mock('../../src/events/emitter');

const events = new Events(null, null);

describe("Blockchain", ()=> {

    beforeAll(() => {

        Events.mockImplementation(() => {
            return {
                emit: () => {
                    return 1;
                }
            }
        });
    });

    test("it expects to have one block", () => {

        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);
    });


    test("it expects to add a block", () => {
        
        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);

        const transactions: Transaction[] = [];

        for(let i = 0; i < NewBlockPolicy.getBlockLimit(); i++) {
            transactions.push(new Transaction(i, i + 20, i * 40));
        }

        chain.addBlock(transactions);

        expect(chain.length()).toBe(2);
    });

    test ("it expects to restore previous chain", () => {

    });
});