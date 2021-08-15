import Blockchain from '../src/chain/blockchain';
import Events from '../src/events/emitter';
import BlockLimitPolicy from '../src/policies/block-limit-policy';
import { producer } from '../src/stream/producer';
import { logger } from '../src/logs/logger';
import EventEmitter from 'events';

jest.mock('../src/chain/blockchain');
jest.mock('../src/events/emitter');
jest.mock('../src/stream/producer');
jest.mock('../src/logs/logger');
jest.mock('events');

const emitter = new EventEmitter();

const events = new Events(emitter, producer, logger);

describe("Block limt policy", () => {

    test("it expects limit is not reached", () => {

        const chain = new Blockchain(events);

        jest.spyOn(chain, 'length')
            .mockReturnValue(1);

        expect(BlockLimitPolicy.reachedLimit(chain)).toBeFalsy();
    });

    test("it expects limit is reached", () => {

        const chain = new Blockchain(events);

        jest.spyOn(chain, 'length')
            .mockReturnValue(10);

        expect(BlockLimitPolicy.reachedLimit(chain)).toBeTruthy();
    });

    test("it expects limit to be 10", () => {

        expect(BlockLimitPolicy.getLimit()).toBe(10);
    })
})