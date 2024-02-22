const ChainUtil = require("../chain-util");
const { MINE_RATE, DIFFICULTY } = require("../config");

class Block {
  // define unique instance
  constructor(timeStamp, lastHash, hash, data, nonce, difficulty) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `
            Block
            Time Stamp: ${this.timeStamp}
            Last hash:${this.lastHash.substring(0, 10)}
            Hash: ${this.hash.substring(0, 10)}
            nonce: ${this.nonce}
            difficulty: ${this.difficulty}
            Data: ${this.data}
        `;
  }

  // static make sure that we can call this function without needing to create a new instance of this class
  // doesnt need to use new syntax but can call genesis function directly from the import
  static genesis() {
    return new this("Genesis time", "------", "f1r57-h45h", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let hash, timeStamp;
    let nonce = 0;
    do {
      nonce++;
      timeStamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timeStamp);
      hash = Block.hash(timeStamp, lastHash, data, nonce);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this(timeStamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timeStamp, lastHash, data, nonce) {
    return ChainUtil.hash(`${timeStamp}${lastHash}${data}${nonce}`).toString();
  }

  static blockHash(block) {
    const { timeStamp, lastHash, data, nonce, difficulty } = block;

    return Block.hash(timeStamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty =
      lastBlock.timeStamp + MINE_RATE > currentTime
        ? difficulty + 1
        : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;
