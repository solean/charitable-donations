
const CharitableDonations = artifacts.require('CharitableDonations');

module.exports = async function(callback) {
  let accounts = await web3.eth.getAccounts();
  let cd = await CharitableDonations.deployed();

  await cd.createVerifiedCharity(
    'Charity Name',
    'charity description',
    'http://google.com',
    'https://opensea.io/static/images/logos/opensea.svg',
    accounts[9]
  );
  await cd.createVerifiedCharity(
    'Cystic Fibrosis Foundation',
    'CFF is a non-profit organization dedicated to the prevention and treatment of cystic fibrosis.',
    'https://cff.org/',
    'https://lungdiseasenews.com/wp-content/uploads/2014/12/CFFT-Logo.jpg',
    accounts[8]
  );

  await cd.createPledge(
    web3.utils.toWei('0.1'),
    web3.utils.toWei('1'),
    3600000,
    accounts[9],
    {
      from: accounts[0],
      value: web3.utils.toWei('0.1')
    }
  );
  await cd.createPledge(
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