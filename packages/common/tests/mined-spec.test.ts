import { describe, expect, vi, test } from 'vitest';

import Block from '../src/domain/chain/block';
import BlockMined from '../src/domain/chain/specifications/mined';

describe('Mined Specification', () => {
  test('it expects the specification is not satisfied', () => {
    const block = new Block(1, 1, 1, 'test', [], 0);
    const spec = new BlockMined();
    const fakeBlock = vi.mocked<Partial<Block>>({}) as Partial<Block>;
    vi.spyOn(block, 'isMined').mockImplementation(() => false);

    expect(() => spec.isSatisfiedBy(fakeBlock as Block, block)).toThrow();
  });
});
