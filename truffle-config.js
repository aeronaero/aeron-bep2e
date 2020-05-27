module.exports = {
  networks: {
    tbsc: {
      host: "https://data-seed-prebsc-1-s1.binance.org",
      port: 8545,
      network_id: "96"
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },
  solc: {
    optimizer: {
        enabled: true,
        runs: 200,
    },
  },
  compilers: {
      solc: {
          version: '0.6.7',
      },
  },
};
