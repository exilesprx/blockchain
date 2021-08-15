import { model, Schema } from "mongoose";

export interface Transaction {
    id: string,
    to: string,
    from: string,
    amount: number,
    date: number,
    hash: string
};

const schema = new Schema<Transaction>({
    id: { type: String, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    hash: { type: String, required: true }
});

const TransactionModel = model<Transaction>('Transaction', schema);

export default TransactionModel;