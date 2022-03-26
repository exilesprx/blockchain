import Blockchain from '../src/domain/chain/blockchain';
import BlockLimitPolicy from '../src/domain/policies/block-limit-policy';

jest.mock('../src/domain/chain/blockchain');

describe('Block limt policy', () => {
  test('it expects limit is not reached', () => {
    const chain = new Blockchain();

    jest.spyOn(chain, 'length')
      .mockReturnValue(1);

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeFalsy();
  });

  test('it expects limit is reached', () => {
    const chain = new Blockchain();

    jest.spyOn(chain, 'length')
      .mockReturnValue(BlockLimitPolicy.getLimit());

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeTruthy();
  });
});
