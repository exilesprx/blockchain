import Blockchain from '../src/chain/blockchain';
import Events from '../src/events/emitter';
import NewBlockPolicy from '../src/policies/new-block-policy';
import Transaction from '../src/wallet/transaction';
import { producer } from '../src/stream/producer';
import { logger } from '../src/logs/logger';
import BlockModel from '../src/models/block';
import BlockLimitPolicy from '../src/policies/block-limit-policy';
import Block from '../src/chain/block';
import EventEmitter from 'events';

jest.mock('../src/events/emitter');
jest.mock('../src/stream/producer');
jest.mock('../src/logs/logger');
jest.mock('../src/policies/new-block-policy');
jest.mock('../src/policies/block-limit-policy');
jest.mock('events');

const emitter = new EventEmitter();

const events = new Events(emitter, producer, logger);

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

        transactions.push(new Transaction("one", "two", 2));

        chain.addBlock(transactions);

        expect(chain.length()).toBe(2);

        expect(events.emit).toHaveBeenCalled();
    });

    test("it expects not to add a block", () => {
        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);

        const transactions: Transaction[] = [];

        transactions.push(new Transaction("one", "two", 2));

        NewBlockPolicy.shouldCreateNewBlock.mockReturnValueOnce(false);

        const blockAdded = chain.addBlock(transactions);

        expect(blockAdded).toBeFalsy();
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

        await chain.restore().catch((value) => {
            expect(value).toBeNull();
        });

        const restoreLastBlockHash = chain.getLastBlockHash();

        expect(genesisBlockHash).toBe(restoreLastBlockHash);
    });

    test("it expects the database block hash and memory block hash to be equal", async () => {
        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);

        const blockModel = {
            id: 1,
            nounce: 0,
            difficulty: 0,
            previousHash: "",
            transactions: [],
            hash: "test",
            date: 123
        };

        jest.spyOn(BlockModel, 'findOne')
            .mockImplementation(() => {
                return {
                    lean: () => blockModel
                }
            });

        await chain.restore();

        const restoreLastBlockHash = chain.getLastBlockHash();

        expect(restoreLastBlockHash).toBe("test");
    });

    test("it expect the database block hash and memory block hash to fail equality", async () => {

        const chain = new Blockchain(events);

        expect(chain.length()).toBe(1);

        const blockModel = {
            id: 1,
            nounce: 0,
            difficulty: 0,
            previousHash: "",
            transactions: [],
            hash: "test",
            date: 123
        };

        jest.spyOn(BlockModel, 'findOne')
            .mockImplementation(() => {
                return {
                    lean: () => blockModel
                }
            });

        jest.spyOn(Block, "fromModel")
            .mockImplementationOnce(() => {
                return new Block(1, 1, 1, "test", []);
            });

        await expect(chain.restore()).rejects.toBeInstanceOf(TypeError);
    });
});