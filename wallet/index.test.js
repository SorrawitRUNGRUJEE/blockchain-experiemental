const Wallet = require("./index");
const TransactionPool = require("./transactionPool");

describe("Waalt", () => {
  let wallet, tp;
  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe(` creating a transaction`, () => {
    let transaction, sendAmount, recipeint;
    beforeEach(() => {
      sendAmount = 50;
      recipeint = "sdgjfvsdf";
      transaction = wallet.createTransaction(recipeint, sendAmount, tp);
    });

    describe(`and doing the same transaction`, () => {
      beforeEach(() => {
        wallet.createTransaction(recipeint, sendAmount, tp);
      });

      it(` double the 'sendAmount' subtracted from the wallet balance`, () => {
        expect(
          transaction.outputs.find(
            (output) => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it(`clones the 'sendAmount' output for the recipeint`, () => {
        expect(
          transaction.outputs
            .filter((output) => output.address === recipeint)
            .map((output) => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
