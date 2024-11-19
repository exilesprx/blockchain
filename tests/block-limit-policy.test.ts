import Blockchain from "../src/domain/chain/blockchain";
import BlockLimitPolicy from "../src/domain/policies/block-limit-policy";

jest.mock("../src/domain/chain/blockchain");

const chain: Blockchain = new Blockchain();

describe("Block limt policy", () => {
  beforeAll(() => {
    Blockchain.mockClear();
  });
  test("it expects limit is not reached", () => {
    jest.spyOn(chain, "length").mockReturnValue(1);

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeFalsy();
  });

  test("it expects limit is reached", () => {
    jest.spyOn(chain, "length").mockReturnValue(BlockLimitPolicy.getLimit());

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeTruthy();
  });
});
