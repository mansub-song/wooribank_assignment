//https://faucet.egorfine.com/
const {
  ethers
} = require("ethers");


async function sendEthTransaction() {
  let private_key =
    "0xbd0809435507c37658981fb2eff9ad0f75eb0470bf8a2b5d57d547c4da78e9f4"
  let send_token_amount = "0.01"
  let to_address = "0x857c2912C78EeDC5d7029612DaB1482a8fAFb610"
  let from_address = "0x8101f434c40bBbb8BF209894400e1B52193B9435"
  let gas_limit = "0x100000"
  ethersProvider = new ethers.providers.InfuraProvider("ropsten")

  let wallet = new ethers.Wallet(private_key)

  let walletSigner = wallet.connect(ethersProvider)
  ethersProvider.getGasPrice() // gasPrice

  const tx = {
    from: from_address,
    to: to_address,
    value: ethers.utils.parseEther(send_token_amount),
    nonce: ethersProvider.getTransactionCount(from_address, "latest"),
    gasLimit: ethers.utils.hexlify(gas_limit), // 100000
  }
  //프로미스는 주로 서버에서 받아온 데이터를 화면에 표시하기 위해 사용한다.

  await walletSigner.sendTransaction(tx).then((transaction) => {
    console.log(transaction)
    console.log("Send finished!")
  })



}

// sendEthTransaction()

module.exports = {
  sendEthTransaction
}