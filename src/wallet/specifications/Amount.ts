import transaction from "../transaction";
import Specification from "./Specification";

export default class Amount implements Specification
{
    isSatisfiedBy(transaction: transaction): boolean {
        if (! (transaction.getAmount() > 0)) {
            throw new Error("Amount not allowed.");
        }

        return true;
    }

}