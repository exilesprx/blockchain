import Transaction from "../transaction";
import Specification from "./specification";

export default class Receiver implements Specification {
  private message = "Receiver not allowed.";

  public isSatisfiedBy(transaction: Transaction): void {
    if (typeof transaction.getReceiver() !== "string") {
      throw new Error(this.message);
    }
  }
}
