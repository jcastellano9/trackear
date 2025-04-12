
import { CryptoWalletComparison } from "@/types/interestRate";

// Mock data for wallet comparisons - in a real app, this would come from an API
export const fetchCryptoWalletRates = async (): Promise<{
  cryptos: CryptoWalletComparison[];
  providers: string[];
}> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  const providers = ["Buenbit", "Fiwind", "LB", "Belo", "Lemon", "Ripio", "SatoshiTango"];
  
  const cryptos: CryptoWalletComparison[] = [
    {
      crypto: {
        name: "Bitcoin",
        symbol: "BTC",
        logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
      },
      rates: {
        "Buenbit": null,
        "Fiwind": 0.50,
        "LB": null,
        "Belo": 0.10,
        "Lemon": null,
        "Ripio": 0.52,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "Ethereum",
        symbol: "ETH",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
      },
      rates: {
        "Buenbit": 2.00,
        "Fiwind": 0.50,
        "LB": null,
        "Belo": 1.00,
        "Lemon": 2.61,
        "Ripio": 2.32,
        "SatoshiTango": 2.05
      }
    },
    {
      crypto: {
        name: "Tether",
        symbol: "USDT",
        logo: "https://cryptologos.cc/logos/tether-usdt-logo.png"
      },
      rates: {
        "Buenbit": 3.50,
        "Fiwind": 5.00,
        "LB": 3.67,
        "Belo": 3.00,
        "Lemon": 1.80,
        "Ripio": 4.41,
        "SatoshiTango": 2.80
      }
    },
    {
      crypto: {
        name: "USD Coin",
        symbol: "USDC",
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
      },
      rates: {
        "Buenbit": 7.00,
        "Fiwind": 5.00,
        "LB": 3.67,
        "Belo": 3.00,
        "Lemon": 2.79,
        "Ripio": 2.97,
        "SatoshiTango": 2.80
      }
    },
    {
      crypto: {
        name: "DAI",
        symbol: "DAI",
        logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
      },
      rates: {
        "Buenbit": 3.50,
        "Fiwind": 5.00,
        "LB": null,
        "Belo": null,
        "Lemon": 2.07,
        "Ripio": 2.46,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "Solana",
        symbol: "SOL",
        logo: "https://cryptologos.cc/logos/solana-sol-logo.png"
      },
      rates: {
        "Buenbit": 4.20,
        "Fiwind": null,
        "LB": null,
        "Belo": 7.00,
        "Lemon": null,
        "Ripio": null,
        "SatoshiTango": 4.21
      }
    },
    {
      crypto: {
        name: "Lift Dollar",
        symbol: "USDL",
        logo: "https://assets.coingecko.com/coins/images/25615/standard/lift-dollar-logo.jpeg?1708019113"
      },
      rates: {
        "Buenbit": 7.50,
        "Fiwind": null,
        "LB": null,
        "Belo": null,
        "Lemon": null,
        "Ripio": 2.61,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "Criptodólar",
        symbol: "CRPD",
        logo: "https://criptodolar.org/assets/images/favicon.svg"
      },
      rates: {
        "Buenbit": null,
        "Fiwind": null,
        "LB": null,
        "Belo": null,
        "Lemon": null,
        "Ripio": 7.16,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "Cardano",
        symbol: "ADA",
        logo: "https://cryptologos.cc/logos/cardano-ada-logo.png"
      },
      rates: {
        "Buenbit": null,
        "Fiwind": 1.00,
        "LB": null,
        "Belo": null,
        "Lemon": null,
        "Ripio": null,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "Polkadot",
        symbol: "DOT",
        logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png"
      },
      rates: {
        "Buenbit": null,
        "Fiwind": 2.00,
        "LB": null,
        "Belo": null,
        "Lemon": null,
        "Ripio": null,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "BNB",
        symbol: "BNB",
        logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
      },
      rates: {
        "Buenbit": 0.50,
        "Fiwind": null,
        "LB": null,
        "Belo": null,
        "Lemon": null,
        "Ripio": null,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "Avalanche",
        symbol: "AVAX",
        logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png"
      },
      rates: {
        "Buenbit": 4.00,
        "Fiwind": null,
        "LB": null,
        "Belo": null,
        "Lemon": 0.77,
        "Ripio": null,
        "SatoshiTango": null
      }
    },
    {
      crypto: {
        name: "Tron",
        symbol: "TRX",
        logo: "https://cryptologos.cc/logos/tron-trx-logo.png"
      },
      rates: {
        "Buenbit": 5.50,
        "Fiwind": null,
        "LB": null,
        "Belo": null,
        "Lemon": null,
        "Ripio": null,
        "SatoshiTango": null
      }
    }
  ];

  return { cryptos, providers };
};
