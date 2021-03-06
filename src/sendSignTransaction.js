const { web3, privateKeys, aclAddress,erc721Address, host, port } = require("./utils");
const axios = require("axios");
const assert = require("assert");

const getSignedTx = async (rawTrans, from) => {
  assert(
    rawTrans && from,
    "Need to specify each param of sendSignTransaction-func"
  );
  assert(web3.utils.isAddress(from), "Sender's address is not valid");

  const signed = await web3.eth.accounts.signTransaction(
    {
      to: aclAddress,
      from: from,
      value: "0",
      data: rawTrans.encodeABI(),
      gasPrice: web3.eth.getGasPrice(), //web3.utils.toWei("20", "gwei"),
      gas: Math.round((await rawTrans.estimateGas({ from })) * 1.5),
      nonce: web3.utils.toHex(
        await web3.eth.getTransactionCount(from, "pending")
      ),
    },
    privateKeys[2]
  );
  return signed.rawTransaction;
};


const getSignedTxerc = async (rawTrans, from) => {
  assert(
    rawTrans && from,
    "Need to specify each param of sendSignTransaction-func"
  );
  assert(web3.utils.isAddress(from), "Sender's address is not valid");

  const signed = await web3.eth.accounts.signTransaction(
    {
      to: aclAddress,
      from: from,
      value: "0",
      data: rawTrans.encodeABI(),
      gasPrice: web3.eth.getGasPrice(), //web3.utils.toWei("20", "gwei"),
      gas: Math.round((await rawTrans.estimateGas({ from })) * 1.5),
      nonce: web3.utils.toHex(
        await web3.eth.getTransactionCount(from, "pending")
      ),
    },
    privateKeys[1]
  );
  return signed.rawTransaction;
};





const sendSignedTx = async (rawTxHex, from, addr_user, write,read,exec,res) => {
  try {
    const resp = await axios.post(`http://${host}:${port}/transfer`, {
      sender: from,
      addr_user: addr_user,
      write : write , 
      read : read,
      exec : exec,
      res : res,
      tx: rawTxHex,
    });
    console.log(resp.data);
  } catch (err) {
    console.error(err.message);
  }
}; 

const directSendSignedTx = async (rawTxHex) => {
  let resp;
  try {
    await web3.eth.sendSignedTransaction(rawTxHex).on("receipt", (receipt) => {
      const { transactionHash, status, to, blockNumber } = receipt;
      resp = {
        transactionHash: transactionHash,
        status: status,
        to: to,
        blockNumber: blockNumber,
      };
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestException({ description: error.message });
  }
  return resp;
};

module.exports = {
  getSignedTx: getSignedTx,
  //sendSignedTx: sendSignedTx,
  getSignedTxerc: getSignedTxerc,
  directSendSignedTx: directSendSignedTx,
};