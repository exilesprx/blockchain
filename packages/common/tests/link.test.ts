import { describe, expect, test } from 'vitest';

import { v4 } from 'uuid';
import Block from '@/domain/chain/block';
import Link from '@/domain/chain/specifications/link';

describe('Link specification', () => {
  test('it expects specification to fail', () => {
    const previousBlock = new Block(v4(), 1, 1, '', [], 0);
    const currentBlock = new Block(v4(), 1, 1, '', [], 0);
    const link = new Link();

    expect(() => link.isSatisfiedBy(previousBlock, currentBlock)).toThrow();
  });

  test('it expects specification to succeed', () => {
    const previousBlock = new Block(v4(), 1, 1, '', [], 0);
    const currentBlock = new Block(
      v4(),
      1,
      1,
      previousBlock.getHash(),
      [],
      20241120
    );
    const link = new Link();

    expect(() => link.isSatisfiedBy(previousBlock, currentBlock)).not.toThrow();
  });
});
