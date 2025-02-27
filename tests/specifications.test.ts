import { describe, expect, test } from '@jest/globals';

import { v4 } from 'uuid';
import Amount from '../src/domain/wallet/specifications/amount';
import Receiver from '../src/domain/wallet/specifications/receiver';
import SameWallet from '../src/domain/wallet/specifications/same-wallet';
import Sender from '../src/domain/wallet/specifications/sender';
import Transaction from '../src/domain/wallet/transaction';

describe('Specifications', () => {
  test('it expects amount is satisfied by amount of 1', () => {
    const transaction = new Transaction(v4(), 'one', 'two', 1, 0);
    const amountSpec = new Amount();

    expect(() => amountSpec.isSatisfiedBy(transaction)).not.toThrow();
  });

  test('it expects amount is not satisfied by amount of 0', () => {
    const transaction = new Transaction(v4(), 'one', 'two', 0, 0);
    const amountSpec = new Amount();

    expect(() => amountSpec.isSatisfiedBy(transaction)).toThrow();
  });

  test('it expects receiver is satisfied by wallet of one', () => {
    const transaction = new Transaction(v4(), 'one', 'two', 1, 0);
    const receiverSpec = new Receiver();

    expect(() => receiverSpec.isSatisfiedBy(transaction)).not.toThrow();
  });

  test('it expects receiver is not satisfied when sending to same wallet', () => {
    const transation = new Transaction(v4(), 'two', 'two', 2, 0);
    const receiverSpec = new Receiver();

    expect(() => receiverSpec.isSatisfiedBy(transation)).toThrow();
  });

  test('it expects sender is satisfied by wallet of two', () => {
    const transaction = new Transaction(v4(), 'one', 'two', 1, 0);
    const senderSpec = new Sender();

    expect(() => senderSpec.isSatisfiedBy(transaction)).not.toThrow();
  });

  test('it expects sender is not satisfied when sending to same wallet', () => {
    const transaction = new Transaction(v4(), 'one', 'one', 1, 0);
    const senderSpec = new Sender();

    expect(() => senderSpec.isSatisfiedBy(transaction)).toThrow();
  });

  test('it expects same wallet is satisfied by waller of one and two', () => {
    const transaction = new Transaction(v4(), 'one', 'two', 1, 0);
    const sameWalletSpec = new SameWallet();

    expect(() => sameWalletSpec.isSatisfiedBy(transaction)).not.toThrow();
  });

  test('it expects same wallet is satisfied by waller of one and one', () => {
    const transaction = new Transaction(v4(), 'one', 'one', 1, 0);
    const sameWalletSpec = new SameWallet();

    expect(() => sameWalletSpec.isSatisfiedBy(transaction)).toThrow();
  });
});
