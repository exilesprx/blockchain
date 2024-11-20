import Topic from "./topic";

export default class Transaction extends Topic {
  public constructor() {
    super("transaction-added");
  }
}
