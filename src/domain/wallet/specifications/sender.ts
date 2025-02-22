import Transaction from "../transaction";
import Specification from "./specification";

export default class Sender implements Specification {
  private message = "Sender not allowed";

  public isSatisfiedBy(transaction: Transaction): void {
    if (transaction.getReceiver() == transaction.getSender()) {
      throw new Error(this.message);
    }
  }
}
