const CharitableDonations = artifacts.require("CharitableDonations");

module.exports = function (deployer) {
  deployer.deploy(CharitableDonations);
};
