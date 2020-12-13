# crypto-kitties
A Crypto Kitties clone. For fun... and maybe food for the Crypto Zombies tutorial! Mwuahahah!

Hosted on Netlify: https://mayjer-academy-kitties.netlify.app/

Original project, check them out!<br>
https://www.cryptokitties.co/

### Contracts
Deployed on Ropsten

Kitties: https://ropsten.etherscan.io/address/0xd4bcc3f1c483ea10fdb97523357ca660e6b3c71e

Marketplace: https://ropsten.etherscan.io/address/0xa67e70910341ddf96537f005280a4417b5b29578

### Tech Stack

Contracts: solidity, truffle, ganache

Front End: react, redux, html, CSS, javascript, react-bootstrap, styled-components, redux-sagas

Testing: mocha, chai, truffle-assertions

### Usage

1. Requires an Etherem wallet like <a href="https://metamask.io/" target="_blank">MetaMask</a>

2. You'll need some test ETH on the Ropsten network. Visit a <a href="https://faucet.dimensions.network/" target="_blank">faucet</a> to get some free test ETH. Make sure you've set your wallet network to `Ropsten`.

3. Visit the <a href="https://mayjer-academy-kitties.netlify.app/" target="_blank">Academy Kitties</a> website.

4. Make sure your wallet is on the `Ropsten` test network. Press the "Connect" button. This will connect the wallet to the app so it can query the blockchain for your kitties.

5. Head over to the Marketplace to get some kitties! Once you have 2 kitties you can breed them and have kittens.

### Academy Kitties DNA

The DNA structure is a 16 digit number with the following breakdown. The Kitten DNA is a random combination of the parent DNA with a chance for a completely random value.

| DNA Digits | Cattribute | Values |
|---|---|---|
|00-01 | Body Color | 10-99 |
|02-03 | Accent Color | 10-99 |
|04-05 | Eye Color | 10-99 |
|06-07 | Ear Color | 10-99 |
| 08 | Eye Shape | 0-7 |
| 09 | Pattern | 0-3 |
| 10-11 | Pattern Color|  10-99 |
| 12-13 | Pattern Accent Color | 10-99 |
| 14 | Animation | 0-4 |
| 15 | Mysterious | 0-7 |

### Cooldown

When parent kitties breed they need time to rest before breeding again. Breed cooldowns are defined below.

https://guide.cryptokitties.co/guide/cat-features/cooldown-speed

| Generation  | Cooldown Name  | Cooldown Time  |
|---|---|---|
| 0, 1 | fast  | 1 minute  |
| 2, 3 | swift | 2 minutes |
| 4, 5 | swift | 5 minutes |
| 6, 7 | snappy | 10 minutes |
| 8, 9 | snappy | 30 minutes |
| 10, 11 | brisk | 1 hour |
| 12, 13 | brisk | 2 hours |
| 14, 15 | plodding | 4 hours |
| 16, 17 | plodding | 8 hours |
| 18, 19 | slow | 16 hours |
| 20, 21 | slow | 24 hours |
| 22, 23 | sluggish | 2 days |
| 24, 25 | sluggish | 4 days |
| 26+ | catatonic | 1 week |

## Running the project locally

1. Have node `12.x` installed
2. Install the Truffle suite globally via `npm install -g truffle`
3. `npm install` to install the project dependencies
4. You'll need a local ETH blockchain like Ganache. Can use either the <a href="https://www.trufflesuite.com/ganache" target="_blank">graphical interface</a> or the CLI (`npm install -g ganache-cli`). If using the graphical app create a new workspace and link the truffle config file `/truffle-config.js` to the workspace.
5. Deploy the contracts
   1. `truffle console`
   2. `migrate`
6. Copy the `KittyContract` and `KittyMarketPlace` contract deployed addresses into `/src/components/js/service.js` into the `static chainIdToAddress` variable with ID `0x539` (this is the chain ID for Ganache)
7. Run the app with `npm start` and open a browser to `http://localhost:3000`

## Deploy to Test Net

Deploying the project contracts to a test net requires a `.env` config file which expects the following entries. You can get a free Infura API key by creating an account at their website <a href="https://infura.io/" target="_blank">here</a>.

```
# 12 word seed phrase for the test net HD wallet provider
MNEMONIC=

# Infura project ID for the hosted ETH node
INFURA_PROJECT_ID=
```

Follow the local deployment instructions above except use `truffle console --network ropsten` (or your test network of choice).

#### Bootcamp project template
https://github.com/Ivan-on-Tech-Academy/academy-kitties-template/tree/master
