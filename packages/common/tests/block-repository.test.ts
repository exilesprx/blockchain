import { describe, expect, vi, test } from 'vitest';

import { v4 } from 'uuid';
import Blockchain from '@/domain/chain/blockchain';
import Block from '@/domain/chain/block';
import BlockEventRepository from '@/infrastructure/repositories/block-event';
import BlockRepository from '@/infrastructure/repositories/block';
import Database from '@/infrastructure/database';
import BlockAdded from '@/domain/events/block-added';

vi.mock('@/infrastructure/database');

describe('Block repository test', () => {
  test('it persists the data and dispatches events', async () => {
    const database = new Database('', 0, false);
    const persist = vi.spyOn(database, 'persist').mockResolvedValue(undefined);
    const emitter = { emit: vi.fn() };
    const repo = new BlockRepository(database);
    const eventRepo = new BlockEventRepository(emitter as never, repo);
    const chain = new Blockchain();
    const block = new Block(v4(), 0, 1, chain.getPreviousBlock().getHash(), [], Date.now());

    chain.addBlock(block);
    await eventRepo.persist(chain);

    expect(persist).toHaveBeenCalled();
    expect(emitter.emit).toHaveBeenCalledWith(
      BlockAdded.toString(),
      expect.any(BlockAdded)
    );
  });
});
