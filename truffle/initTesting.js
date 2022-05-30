
const Hakuai = artifacts.require('Hakuai');

module.exports = async function(callback) {
  let accounts = await web3.eth.getAccounts();
  let h = await Hakuai.deployed();

  await h.createVerifiedCharity(
    'Charity Name',
    'charity description',
    'http://google.com',
    'https://opensea.io/static/images/logos/opensea.svg',
    accounts[9]
  );
  await h.createVerifiedCharity(
    'Cystic Fibrosis Foundation',
    'CFF is a non-profit organization dedicated to the prevention and treatment of cystic fibrosis.',
    'https://cff.org/',
    'https://lungdiseasenews.com/wp-content/uploads/2014/12/CFFT-Logo.jpg',
    accounts[8]
  );

  await h.createPledge(
    web3.utils.toWei('0.1'),
    web3.utils.toWei('1'),
    3600000,
    accounts[9],
    {
      from: accounts[0],
      value: web3.utils.toWei('0.1')
    }
  );
  await h.createPledge(
    web3.utils.toWei('10'),
    web3.utils.toWei('100'),
    36000000,
    accounts[8],
    {
      from: accounts[0],
      value: web3.utils.toWei('10')
    }
  );

  callback();
}
