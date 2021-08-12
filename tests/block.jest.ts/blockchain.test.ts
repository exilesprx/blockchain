import Blockchain from '../../src/chain/blockchain';
import Events from '../../src/events/emitter';
import NewBlockPolicy from '../../src/policies/new-block-policy';
import Transaction from '../../src/wallet/transaction';
import { producer } from '../../src/stream/producer';
import { logger } from '../../src/logs/logger';
import BlockModel from '../../src/models/block';
import BlockLimitPolicy from '../../src/policies/block-limit-policy';

jest.mock('../../src/events/emitter');
jest.mock('../../src/stream/producer');
jest.mock('../../src/logs/logger');
jest.mock('../../src/policies/new-block-policy');
jest.mock('../../src/policies/block-limit-policy');

const events = new Events(producer, logger);

describe("Blockchain", ()=> {

    beforeAll(() => {

        Events.mockImplementation(() => {
            return {
                emit: () => {
                    return 1;
                }
            }
        });

        NewBlockPolicy.shouldCreateNewBlock.mockReturnValue(true);

        NewBlockPolicy.getBlockLimit.mockReturnValue(5);

        BlockLimitPolicy.reachedLimit.mockReturnValue(false);
    });

    test("it expects to have one block", () => {

        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);
    });

    test("it expects to remove a block from the beginning when limit is reached", () => {

        const chain = new Blockchain(events);

        jest.spyOn(chain, 'removeFirstBlock');

        chain.addBlock([new Transaction("1", "2", 2)]);

        // The default is false, but we want to "fake" the chain being full
        BlockLimitPolicy.reachedLimit.mockReturnValueOnce(true);

        chain.addBlock([new Transaction("1", "2", 2)]);

        expect(NewBlockPolicy.shouldCreateNewBlock).toHaveBeenCalled();

        expect(BlockLimitPolicy.reachedLimit).toHaveBeenCalled();

        expect(chain.removeFirstBlock).toHaveBeenCalled();

        expect(chain.length()).toBe(2);
    });


    test("it expects to add a block", () => {
        
        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);

        const transactions: Transaction[] = [];

        for(let i = 0; i < NewBlockPolicy.getBlockLimit(); i++) {
            transactions.push(new Transaction(i.toString(), (i + 20).toString(), i * 40));
        }

        chain.addBlock(transactions);

        expect(chain.length()).toBe(2);

        expect(events.emit).toHaveBeenCalled();
    });

    test("it expects to restore previous chain", async () => {

        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);

        const genesisBlockHash = chain.getLastBlockHash();

        jest.spyOn(BlockModel, 'findOne')
            .mockImplementation(() => {
                return {
                    lean: () => {
                        return {
                            id: 1,
                            nounce: 0,
                            difficulty: 0,
                            previousHash: "",
                            transactions: []
                        }
                    }
                }
            });

        await chain.restore();

        const restoreLastBlockHash = chain.getLastBlockHash();

        expect(genesisBlockHash).not.toBe(restoreLastBlockHash);
    });

    test("it expects no block found, the only block is the genesis block", async () => {

        const chain = new Blockchain(events);
        
        expect(chain.length()).toBe(1);

        const genesisBlockHash = chain.getLastBlockHash();

        jest.spyOn(BlockModel, 'findOne')
            .mockImplementation(() => {
                return {
                    lean: () => {
                        return null
                    }
                }
            });

        await chain.restore();

        const restoreLastBlockHash = chain.getLastBlockHash();

        expect(genesisBlockHash).toBe(restoreLastBlockHash);
    });

    test("it expects the hash between the database block and memory block to fail equality", () => {
        // TODO: Not sure yet if restoring a block from the database should keep the hash in tact or not
    });
});