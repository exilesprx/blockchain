import BlockMinedPolicy from '../src/domain/policies/block-mined-policy';

describe('Block mined policy', () => {
  test('it expects the hash not to be mined', () => {
    expect(BlockMinedPolicy.containsSuccessiveChars('test', 2)).toBeFalsy();
  });

  test('it expects the hash to be mined', () => {
    expect(BlockMinedPolicy.containsSuccessiveChars('00FF', 2)).toBeTruthy();
  });
});
