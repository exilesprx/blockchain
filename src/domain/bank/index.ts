import TransactionPool from '../wallet/transaction-pool';
import Events from '../events/emitter';
import Blockchain from '../chain/blockchain';
import Transaction from '../wallet/transaction';
import Block from '../chain/block';

export default class Bank {
  private transactions: TransactionPool;

  private blockchain: Blockchain;

  private events: Events;

  public constructor(transactions: TransactionPool, blockchain: Blockchain, events: Events) {
    this.transactions = transactions;

    this.blockchain = blockchain;

    this.events = events;
  }

  public addTransaction(transaction: Transaction) : void {
    this.transactions.fill(transaction);

    this.events.emit('transaction-added', transaction);
  }

  public addBlock(block: Block) : void {
    this.blockchain.addBlock(block);

    this.events.emit('block-added', block);
  }
}