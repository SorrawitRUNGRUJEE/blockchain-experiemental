const Block = require("./block");

describe("Block", () => {
  let data, lastBlock, block;
  beforeEach(() => {
    data = "bar";
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it("sets the `data` to match the given input", () => {
    expect(block.data).toEqual(data);
  });

  it("set the `lastHash` to match the hash of the last block", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it("generate a ahsh that matches the difficulty", () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      "0".repeat(block.difficulty)
    );
  });

  it("lower the difficulty for slowly mined blocks", () => {
    expect(Block.adjustDifficulty(block, block.timeStamp + 360000)).toEqual(
      block.difficulty - 1
    );
  });

  it("raise the difficulty for quickly mined block", () => {
    expect(Block.adjustDifficulty(block, block.timeStamp + 1)).toEqual(
      block.difficulty + 1
    );
  });
});
