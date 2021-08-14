import { Schema, model } from 'mongoose';
import { Transaction } from './transaction';

// 1. Create an interface representing a document in MongoDB.
export interface Block {
  id: string,
  transactions: Array<Transaction>,
  nounce: number,
  difficulty: number,
  previousHash: string,
  hash: string,
  date: number
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Block>({
  id: { type: String, required: true },
  transactions: { type: Array, required: true },
  nounce: { type: Number, required: true },
  difficulty: { type: Number, required: true },
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
  date: { type: Number, required: true }
});

// 3. Create a Model.
const BlockModel = model<Block>('Block', schema);

export default BlockModel;