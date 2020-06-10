import React, { Component } from 'react'
import Web3 from 'web3'
import AeronToken from '../contracts/AeronToken.json'
import AeronStaking from '../contracts/AeronStaking.json'
import Main from './Main'
import { formatNumber, toTokenValue, formatTokenAmount, calculateAPY, blocksToTime } from './inc/Helpers'

class App extends Component {

  async UNSAFE_componentWillMount() {
    this.setState({ error: {} })
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.listenMMAccount()
  }

  async loadBlockchainData() {
  
    const web3 = window.web3

    if(!web3) {
        let error = {message: 'noMetaMask'}
        this.setState({ error })
        this.setState({ loading: false })
        return;
    }

    const accounts = await web3.eth.getAccounts()
    
    this.setState({ account: accounts[0] })

    const networkBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ networkBalance })

    //const networkId =  await web3.eth.net.getId()
    //AeronToken.networks[networkId]
    const tokenData = {address:'0x81Dbb3b9397D7C912c7211A96134345Cb2123223'}
    const token = new web3.eth.Contract(AeronToken.abi, tokenData.address)
    this.setState({ token })
    
    if(!token){
        let error = {message: 'NoMetaMask'}
        console.log('Token contract is not deployed to this network.')
        this.setState({ error })
    }
    if(token && this.state.account) { 
        await this.loadTokenData()
        this.state.token.methods.stakingContract().call((error, result) => {
            if(!error) {
                this.setState({ stakingContractAddress: result })
            }
        }).then((instance) => {
            if(this.state.stakingContractAddress) {
                const staking = new web3.eth.Contract(AeronStaking.abi, this.state.stakingContractAddress)
                this.setState({ staking })
                this.loadStakingData()
            } else {
                let error = {message:'Staking contract is not deployed to this network.'}
                console.log(error)
                this.setState({ error })
            }
        })
    } else {
        let error = {message:'Staking contract is not deployed to this network (0).'}
        console.log(error)
        this.setState({ error })
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      //autoRefreshOnNetworkChange=false
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
        let error = {message: 'noMetaMask'}
        console.log(error)
        this.setState({ error })
    }
  }

  async listenMMAccount() {
    if(!window.ethereum) {
        let error = {message: 'noMetaMask'}
        console.log(error)
        this.setState({ error })
        return;
    }
    window.ethereum.on("accountsChanged", async () => {
        this.setState({ error: '' })
        await this.loadBlockchainData()
        await this.loadStakingData()
    })
    //window.ethereum.on("networkChanged", async () => {
     //   await this.loadBlockchainData()
       // await this.loadStakingData()
    //})
}

  async loadTokenData() {

    this.state.token.methods.balanceOf(this.state.account).call((error, result) => {
        if(!error) {
            this.setState({ tokenBalance: result })
        }
    })

    this.state.token.methods.owner().call((error, result) => {
        if(!error) {
            this.setState({ tokenOwner: result })
        }
    })

    

  }

  async loadStakingData() {
    
    this.setState({isWaiting: false})
    this.loadTokenData()
    
    this.state.staking.methods.owner().call((error, result) => {
        if(!error) {
            this.setState({ stakingOwner: result })
        }
    })
    
    this.state.staking.methods.stakeOf(this.state.account).call((error, result) => {
        if(!error) {
            this.setState({ stakeOf: result })   
        }
    })

    this.state.staking.methods.rewardOf(this.state.account).call((error, result) => {
        if(!error) {
            this.setState({ rewardOf: result })   
        }
    })
    

    this.state.staking.methods.nextRewardOf(this.state.account).call((error, result) => {
        if(!error) {
            this.setState({ nextRewardOf: result })   
        }
    })

    this.state.staking.methods.blocksTillReward(this.state.account).call((error, result) => {
        if(!error) {
            this.setState({ blocksTillReward: result })   
        }
    })
    
    this.state.staking.methods.minStake().call((error, result) => {
        if(!error) {
            this.setState({ minStake: result })  
        }
    })

    this.state.staking.methods.totalStakes().call((error, result) => {
        if(!error) {
            this.setState({ totalStakes: result })   
        }
    })

    this.state.staking.methods.exportStakeholders().call((error, result) => {
        if(!error && result) {
            this.setState({ totalStakeholders: result.length })   
        }
    })

    this.state.staking.methods.blocksPerReward().call((error, result) => {
        if(!error) {
            this.setState({ blocksPerReward: result })   
        }
    })

    this.state.staking.methods.exportTierAmounts().call((error, amounts) => {
        if(!error) {
            this.setState({ tierAmounts: amounts })
            this.state.staking.methods.exportTierPercent().call((error, percents) => {
                if(!error && amounts) {
                    let result = []
                    let s;
                    for (s = 0; s < amounts.length; s += 1){
                        result[s] = {
                            amount: toTokenValue(amounts[s]),
                            percent: percents[s]/100000*100
                        }
                    }
                    this.setState({ rewardTiers: result })   
                }
            })
            
        }
    })

   

    this.state.staking.methods.countRewardTiers().call((error, result) => {
        if(!error) {
            this.setState({ countRewardTiers: result })   
        }
    })

    this.state.staking.methods.rewardPercent().call((error, result) => {
        if(!error) {
            this.setState({ rewardPercent: result/100000*100 })
        }
    })
    
    

    
    

  }

  createStake = (amount) => {
    this.setState({ 
        loading: true,
        currentScreen: 'stake',
        error: {} 
    })
    this.state.staking.methods.createStake(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ 
            loading: false,
            isWaiting: true,
        })
    }).on('error', (error) => { 
        this.setState({ 
            loading: false,
            error: error,
        })
        console.log(error);
    }).then((instance) => {
        this.loadStakingData();
    })
  }

  withdrawReward = () => {
    this.setState({ 
        loading: true,
        currentScreen: 'stake',
        error: {} 
    })
    this.state.staking.methods.withdrawReward().send({from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ 
            loading: false,
            isWaiting: true,
        })
    }).on('error', (error) => { 
        this.setState({ 
            loading: false,
            error: error,
        })
        console.log(error);
    }).then((instance) => {
        this.loadStakingData();
    })
  }

  removeStake = (amount) => {
    this.setState({ 
        loading: true,
        currentScreen: 'stake',
        error: {} 
    })
    this.state.staking.methods.removeStake(amount).send({from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ 
            loading: false,
            isWaiting: true,
        })
    }).on('error', (error) => { 
        this.setState({ 
            loading: false,
            error: error,
        })
        console.log(error);
    }).then((instance) => {
        this.loadStakingData();
    })
  }

  setMinStake = (amount) => {
    this.setState({ 
        loading: true,
        currentScreen: 'admin',
        error: {}
    })
    this.state.staking.methods.setMinStake(amount).send({from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ 
            loading: false,
            isWaiting: true
        })
    }).on('error', (error) => { 
        this.setState({ 
            loading: false,
            currentScreen: 'admin',
            error: error,
        })
        console.log(error);
    }).then((instance) => {
        this.loadStakingData();
    })
  }

  setBlocksPerReward = (amount) => {
    this.setState({ 
        loading: true,
        currentScreen: 'admin',
        error: {}
    })
    this.state.staking.methods.setBlocksPerReward(amount).send({from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ 
            loading: false,
            isWaiting: true,
        })
    }).on('error', (error) => { 
        this.setState({ 
            loading: false,
            error: error,
        })
        console.log(error);
    }).then((instance) => {
        this.loadStakingData();
    })
  }

  setRewardPercent = (amount) => {
    this.setState({ 
        loading: true,
        currentScreen: 'admin',
        error: {}
    })
    this.state.staking.methods.setRewardPercent(amount).send({from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ 
            loading: false,
            isWaiting: true,
        })
    }).on('error', (error) => { 
        this.setState({ 
            loading: false,
            error: error,
        })
        console.log(error);
    }).then((instance) => {
        this.loadStakingData();
    })
  }
  
  removeRewardTier = (amount) => {
    this.setState({ 
        loading: true,
        currentScreen: 'admin',
        error: {}
    })
    this.state.staking.methods.removeRewardTier(amount).send({from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ 
            loading: false,
            isWaiting: true,
        })
    }).on('error', (error) => { 
        this.setState({ 
            loading: false,
            error: error,
        })
        console.log(error);
    }).then((instance) => {
        this.loadStakingData();
    })
  }

  setScreen = (screen) => {
    this.setState({ 
        currentScreen: screen
    })
  }

  faucet = () => {
      if(!this.state.account) {
        let error = {message: 'noMetaMask'}
        this.setState({ error })
        return;
      }
    this.setState({ 
        loading: true,
        currentScreen: 'stake',
        error: {},
    })
        this.state.staking.methods.faucet().send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ 
                loading: false,
                isWaiting: true,
            })
        }).on('error', (error) => { 
            this.setState({ 
                loading: false,
                error: error,
            })
            console.log(error);
        }).then((instance) => {
            this.loadStakingData();
        })
    }

    setStakingContract = (address) => {
        this.setState({ 
            loading: true,
            currentScreen: 'admin',
            error: {},
         })
        this.state.token.methods.setStakingContract(address).send({from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ 
                loading: false,
                isWaiting: true,
            })
        }).on('error', (error) => { 
            this.setState({ 
                loading: false,
                error: error,
            })
            console.log(error);
        }).then((instance) => {
            this.loadStakingData();
        })
      }


      setRewardTier = (amount, percent) => {
        this.setState({ 
            loading: true,
            currentScreen: 'admin',
            error: {},
         })
        this.state.staking.methods.setRewardTier(amount, percent).send({from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ 
                loading: false,
                isWaiting: true,
            })
        }).on('error', (error) => { 
            this.setState({ 
                loading: false,
                error: error,
            })
            console.log(error);
        }).then((instance) => {
            this.loadStakingData();
        })
      }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      staking: {},
      stakingContractAddress: '',
      networkBalance: "0",
      tokenBalance: "0",
      stakingOwner: '',
      tokenOwner: '',
      isAdmin: '',
      minStake: "0",
      stakeOf: "0",
      nextRewardOf: "0",
      blocksTillReward: "0",
      totalStakeholders: "0",
      blocksPerReward: "0",
      countRewardTiers: "0",
      rewardPercent: "0",
      rewardTiers: [],
      tierAmounts: [],
      decimals: 100000000,
      loading: true,
      currentScreen: 'stake',
      error: {},
      isWaiting: false,
    }
  }

  render() {

    let content
    let isAdmin
    

    if (this.state.loading) {

      content = <p id="loader" className="text-center">Loading...</p>

    } else {

        let routes = [
            {
                id: 'stake',
                title: 'Staking',
            },
            {
                id: 'migrate',
                title: 'Migration',
            }
        ]

        let adminRoute = {
            id: 'admin',
            title: 'Admin',
        }
        let faucetRoute = {
            id: 'faucet',
            title: 'Faucet',
        }
        
        if (routes.indexOf(adminRoute) === -1 && this.state.account 
          && (this.state.account === this.state.stakingOwner || this.state.account === this.state.tokenOwner) ) {
            isAdmin = 'Admin';
            routes.push(adminRoute)
        }

        if (routes.indexOf(faucetRoute) === -1 && this.state.tokenBalance === "0" ) {
            routes.push(faucetRoute)
        }
        
    let stats = [
        {
          id: 'your_balance',
          title: 'Your Balance',
          value: formatTokenAmount(this.state.tokenBalance),
          color: 'bg-green-700',
        },
        {
          id: 'your_stake',
          title: 'Your Stake',
          value: formatTokenAmount(this.state.stakeOf),
          color: 'bg-aero-700',
        },
        {
          id: 'your_reward',
          title: 'Your Rewards',
          value: formatTokenAmount(this.state.rewardOf),
          color: 'bg-aero-700',
        },
        {
          id: 'next_reward',
          title: 'Next Reward',
          value: formatTokenAmount(this.state.nextRewardOf),
          color: 'bg-aero-700',
        },
        {
          id: 'next_reward_date',
          title: 'Next Reward',
          value: blocksToTime(this.state.blocksTillReward),
          color: 'bg-aero-700',
        },
        {
          id: 'apy',
          title: 'Estimated APY',
          value: calculateAPY(
              this.state.stakeOf === "0" 
              ? this.state.rewardPercent/100 
              : this.state.nextRewardOf/this.state.stakeOf,
              this.state.blocksPerReward, 5
              ),
          color: 'bg-aero-700',
        },
      ];

      let adminStats = [
        {
          id: 'total_staked',
          title: 'Total Staked',
          value: formatTokenAmount(this.state.totalStakes),
          color: 'bg-pink-900',
        },
        {
          id: 'total_stakeholders',
          title: 'Stakeholders',
          value: formatNumber(this.state.totalStakeholders),
          color: 'bg-aero-700',
        },
        {
            id: 'admin_min_stake',
            title: 'Minimum Stake',
            value: formatTokenAmount(this.state.minStake),
            color: 'bg-aero-700',
        },
        {
          id: 'admin_blocks_per_reward',
          title: 'Reward Time',
          value: formatNumber(this.state.blocksPerReward) + ' blocks',
          color: 'bg-aero-700',
        },
        {
          id: 'admin_default_reward',
          title: 'Default Reward',
          value: this.state.rewardPercent + '%',
          color: 'bg-aero-700',
        },
        {
          id: 'admin_reward_tiers',
          title: 'Reward Tiers',
          value: formatNumber(this.state.countRewardTiers),
          color: 'bg-aero-700',
        },
  
      ]

      let rewardProgress = (this.state.blocksPerReward-this.state.blocksTillReward) / this.state.blocksPerReward;
      let i;
      
      if(rewardProgress > 0 && this.state.stakeOf !== "0") {
        for(i=0; i < stats.length ; i++){
            if(i < rewardProgress * stats.length) {
                stats[i].color = 'bg-green-700'
            }
        }

        for(i=0; i < adminStats.length ; i++){
            if(i < rewardProgress * adminStats.length) {
                adminStats[i].color = 'bg-pink-900'
            }
        }
      }

      content = <Main
        networkBalance={this.state.networkBalance}
        tokenBalance={toTokenValue(this.state.tokenBalance)}
        rewardOf={toTokenValue(this.state.rewardOf)}
        stakeOf={toTokenValue(this.state.stakeOf)}
        minStake={toTokenValue(this.state.minStake)}
        blocksPerReward={this.state.blocksPerReward}
        rewardPercent={this.state.rewardPercent}
        createStake={this.createStake}
        removeStake={this.removeStake}
        withdrawReward={this.withdrawReward}
        setMinStake={this.setMinStake}
        setBlocksPerReward={this.setBlocksPerReward}
        setRewardPercent={this.setRewardPercent}
        routes={routes}
        stats={stats}
        adminStats={adminStats}
        account={this.state.account}
        isAdmin={isAdmin}
        currentScreen={this.state.currentScreen}
        stakingContractAddress={this.state.stakingContractAddress}
        rewardTiers={this.state.rewardTiers}
        removeRewardTier={this.removeRewardTier}
        setRewardTier={this.setRewardTier}
        setStakingContract={this.setStakingContract}
        faucet={this.faucet}
        error={this.state.error}
        setScreen={this.setScreen}
        isWaiting={this.state.isWaiting}
      />
    }


    return (
      <div className="bg-aero-800 min-h-screen text-blue-100 text-lg">
        {content}
      </div>
    );
  }
}

export default App;
