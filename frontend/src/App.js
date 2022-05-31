import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MainPage from './components/MainPage/MainPage';
import PledgePage from './components/PledgePage/PledgePage';
import { ethers } from 'ethers';
import HakuaiAbi from './abis/Hakuai.json';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import constants from './constants/constants';


const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(constants.LOCALHOST_CONTRACT_ADDRESS, HakuaiAbi, ethersProvider);

console.log(process.env.INFURA_ID)

// TODO: rinkeby, remove arb
let chainConfig = process.env.NODE_ENV === 'development' ? [chain.localhost, chain.arbitrum] : [chain.mainnet];

const { chains, provider } = configureChains(
  chainConfig,
  [
    infuraProvider({ infuraId: process.env.INFURA_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'hakuai',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});


function App() {
  return (
    <WagmiConfig client={ wagmiClient }>
      <RainbowKitProvider chains={ chains } showRecentTransactions={ true }>
        <div className="App">
          <div className='header'>
            <img src="/Hakuai.png" height="50" width="50" alt="logo" style={{ float: 'left' }} />
            <h1 className='headerTitle' onClick={ () => window.location.reload() }>hakuai 博愛</h1>
            <div style={{ float: 'right' }}>
              <ConnectButton />
            </div>
          </div>
          <div>
            <BrowserRouter>
              <Routes>
                <Route path='/'
                  element={ <MainPage provider={ ethersProvider } contract={ contract } /> } />
                <Route path='/pledge/:pledgeId'
                  element={ <PledgePage provider={ ethersProvider } contract={ contract } /> } />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
