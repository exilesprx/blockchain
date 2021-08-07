import Block from '../../src/chain/block';
import Blockchain from '../../src/chain/blockchain';
import Events from '../../src/events/emitter';

describe("Blockchain", ()=> {
    test("it expects to have one block", () => {

        const events = jest.mock('Events');
        
        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);
    });
});