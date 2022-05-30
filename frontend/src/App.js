import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PledgeList from './components/PledgeList/PledgeList';


const { chains, provider } = configureChains(
  [chain.mainnet, chain.optimism, chain.arbitrum, chain.localhost],
  [
    infuraProvider({ infuraId: process.env.INFURA_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
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
          <div style={{ margin: '10px' }}>
            <h1 className='headerTitle'>hakuai 博愛</h1>
            <div style={{ float: 'right' }}>
              <ConnectButton />
            </div>
          </div>
          <div>
            <div className='landing'>
                Pledge your ETH to a good cause,<br />
                and motivate others to do the same.
            </div>
            <PledgeList provider={ provider } />
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
