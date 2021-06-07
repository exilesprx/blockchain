import transaction from "../transaction";
import Specification from "./Specification";

export default class Receiver implements Specification
{
    isSatisfiedBy(transaction: transaction): boolean {
        if (typeof transaction.getReceiver() != 'string') {
            throw new Error("Receiver not allowed.");
        }
        return true;
    }
    
}