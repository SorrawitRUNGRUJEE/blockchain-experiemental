const ChainUtil = require("../chain-util");
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static transactionWithOutput(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);

    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet, recipient, amount) {
    const transaction = new this();

    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceed balance`);
      return;
    }

    return Transaction.transactionWithOutput(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey,
      },
      { amount, address: recipient },
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutput(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey,
      },
    ]);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timeStamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      (output) => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.log(` Amount : ${amount} exceeded the balance`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;

    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }
}

module.exports = Transaction;
