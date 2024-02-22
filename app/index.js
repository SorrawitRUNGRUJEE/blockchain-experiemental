const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const P2PServer = require("./p2p.server");
const Walllet = require("../wallet");
const TransactionPool = require("../wallet/transactionPool");
const Miner = require("./miner");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Walllet();
const tp = new TransactionPool();
const p2pServer = new P2PServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);
app.use(bodyParser.json());

app.get("/blocks", (req, res, next) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res, next) => {
  const block = bc.addBlock(req.body.data);
  console.log(`new Block added: ${block.toString()}`);
  p2pServer.syncChain();
  res.redirect("/blocks");
});

app.get("/transaction", (req, res, next) => {
  res.json(tp.transactions);
});

app.post("/transact", (req, res, next) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect("/transaction");
});

app.get("/public-key", (req, res) => {
  res.json({ public_key: wallet.publicKey });
});

app.get("/mine-transaction", (req, res) => {
  const block = miner.mine();
  console.log(` new block added: ${block.toString()}`);
  res.redirect("/blocks");
});

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT} `));
p2pServer.listen();
