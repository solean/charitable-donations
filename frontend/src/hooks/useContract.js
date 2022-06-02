import { ethers } from 'ethers';
import { useNetwork } from 'wagmi';
import constants from '../constants/constants';
import HakuaiAbi from '../abis/Hakuai.json';

function useContract() {
  const { activeChain } = useNetwork();

  if (!activeChain) {
    return [];
  }

  let contractAddr = '';
  if (activeChain.id === 3) {
    contractAddr = constants.ROPSTEN_CONTRACT_ADDRESS;
  } else if (activeChain.id === 421611) {
    contractAddr = constants.ARBITRUM_TESTNET_CONTRACT_ADDRESS;
  }

  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddr, HakuaiAbi, ethersProvider);

  return contract;
}

export default useContract;
