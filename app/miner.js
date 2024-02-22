const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransaction = this.transactionPool.validTransactions();
    //include reward for the miner

    console.log(validTransaction);
    validTransaction.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    //create a block consist of valid transaction
    const block = this.blockchain.addBlock(validTransaction);
    //synchronize the chains in the peer to peer server
    this.p2pServer.syncChain();
    //clear current transaction pool
    this.transactionPool.clear();
    //broadcast to every miner to clear their transaction pool
    this.p2pServer.broadcastClearTransaction();

    return block;
  }
}

module.exports = Miner;
