const ethers = require('ethers')

const provider = new ethers.providers.WebSocketProvider('ws://127.0.0.1:8545');

(async () => {
  console.log(await provider.getBlock('latest'))
})()
