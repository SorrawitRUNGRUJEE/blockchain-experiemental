const TransactionPool = require("./transactionPool");

const Transaction = require("./transaction");

const Wallet = require("./index");

describe(`TransacionPool`, () => {
  let tp, wallet, transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction("rnd-as58as", 30, tp);
  });

  it(` add the transaction to the pool`, () => {
    expect(tp.transactions.find((t) => t.id === transaction.id)).toEqual(
      transaction
    );
  });

  it(`update the transaction in the pool`, () => {
    let oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "foo-16548", 40);
    tp.updateOrAddTransaction(newTransaction);

    expect(
      JSON.stringify(tp.transactions.find((t) => t.id === newTransaction.id))
    ).not.toEqual(oldTransaction);
  });

  it(` clear transaction`, () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe(` mixing valid and corrup transaction`, () => {
    let validTransaction, wallet;

    beforeEach(() => {
      validTransaction = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction("r4nd-44d355", 30, tp);
        if (i % 2 == 0) {
          transaction.input.amount = 999999;
        } else {
          validTransaction.push(transaction);
        }
      }
    });

    it(` shows a different between valid and corrupt transaction`, () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(
        JSON.stringify(validTransaction)
      );
    });

    it(" grab the valid transaction", () => {
      expect(tp.validTransactions()).toEqual(validTransaction);
    });
  });
});
