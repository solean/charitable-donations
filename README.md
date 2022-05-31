
# hakuai 博愛

This is a project I built in the last 48 hours (with a lot of coffee and not a lot of sleep) for the [ETH Shanghai hackathon](https://hackathon.ethshanghai.org/) bounty: [BUIDL For Social Good On Web3 With Infura And Truffle](https://gitcoin.co/issue/infura/eth-shanghai-2022/1/100028862).

I wanted to build something in the nonprofit space because that's where I work in my web2 day job, and I felt like there are ample opportunities for web3 to help a lot of people by innovating in this space.

**Hakuai** is a platform that allows a user to pledge a certain amount of ether to a nonprofit's address if a specified goal is met. That ether is locked in the contract until the fundraising period expires at which point if the goal amount was raised by other participants, the amount raised will be sent to the specified address. Otherwise, the initial pledger and other contributer's locked ether is withdrawable.

After the fundraising period ends, any user may call the function (press the button) to "end" the pledge which will either allow users to withdraw (if goal not met), or for the nonprofit to withdraw their donation. Technically, anyone can call the function (press the button) that finally sends the donation to the nonprofit's address, so if you're feeling extra charitable, you can save them a bit of gas as well :)

I liked the idea of an initial pledge to create momentum for other contributors to pile in to meet the fundraising goal. However, I think there's a lot of room for improvement for incentivizing donations.

________
## Quick demo video

https://user-images.githubusercontent.com/4016993/171165703-adbf2bd7-1374-4e40-82c8-a3bab7e61ba2.mp4

[Higher res link](https://streamable.com/7r7wfx)
_________
## Frontend Deployed to [hakuai.xyz](http://hakuai.xyz)

## Deployed contracts:
> Ropsten: [0x85d5C7c03364B46ad8A10d658b2D21394e1738eF](https://ropsten.etherscan.io/address/0x85d5C7c03364B46ad8A10d658b2D21394e1738eF)

> Arbitrum Testnet (Rinkeby): TODO (couldn't get enough rinkeby eth on arbitrum in time to deploy)

_________________
## Tech/Libraries
- Truffle
- Infura
- ethersjs
- RainbowKit and wagmi
  - had fun playing with these for the first time
- create-react-app
- little bit of bootstrap
_________________

## Future Improvements

#### Immediate todos:
- an "account" page where you can view pledges created, contributed to, and other account-based statistics
- mobile support
- more polished UI
- social media sharing

#### Higher-level thoughts:
- improve incentives for pledging and/or contributing
  - give an ERC-20? Not sure how to give it any value. Redeem for merch?
  - NFTs/POAPS
  - other?
- Verifying Charity Addresses
  - right now there are only 2 options: select a verified charity (only the contract owner can create these, not very decentralized..), or the pledge may submit any address (this probably allows too much room for scammers)
