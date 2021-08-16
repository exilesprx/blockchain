import transaction from "../transaction";
import Specification from "./specification";

export default class Sender implements Specification
{
    isSatisfiedBy(transaction: transaction): boolean {
        if (typeof transaction.getSender() != 'string') {
            throw new Error("Sender not allowed");
        }
        return true;
    }
    
}