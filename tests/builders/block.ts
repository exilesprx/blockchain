import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import Block from '../../src/domain/chain/block';
import Transaction from '../../src/domain/wallet/transaction';

export default class BlockBuilder {
  private block: Block;

  public constructor() {
    this.block = new Block(v4(), 0, 1, faker.string.alpha(20), [], Date.now());
  }

  public withNoTransactions() : BlockBuilder {
    this.block = new Block(v4(), 0, 1, faker.string.alpha(20), [], Date.now());
    return this;
  }

  public withOneTransaction() : BlockBuilder {
    const transaction = new Transaction(
      v4(),
      faker.finance.litecoinAddress(),
      faker.finance.litecoinAddress(),
      Number(faker.finance.amount(0, 100)),
      Date.now(),
    );

    this.block = new Block(v4(), 0, 1, faker.string.alpha(20), [transaction], 0);
    return this;
  }

  public build() : Block {
    return this.block;
  }
}
