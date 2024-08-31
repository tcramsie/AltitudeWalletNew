// main.js

const walletAddress = "0xAAee01e392ef10865685B4f66b19e5a8EAA678DD";
const initialInvestment = 4575.28; // The total initial investment value
const coins = [
  { name: "Ethereum", balance: 0.0, symbol: "ETH", id: "ethereum" },
  { name: "Bitcoin", balance: 0.005, symbol: "BTC", id: "bitcoin" }, 
  { name: "Litecoin", balance: 0.0, symbol: "LTC", id: "litecoin" },
  { name: "XRP", balance: 5446.04, symbol: "XRP", id: "ripple" }, 
  { name: "Brett", balance: 1698.31, symbol: "Brett", id: "brett-coin-id" }, 
  { name: "Wolf", balance: 74589.43, symbol: "Wolf", id: "wolf-coin-id" }, 
  { name: "Pika", balance: 192307.69, symbol: "Pika", id: "pika-coin-id" }, 
  { name: "Bdag", balance: 102739.35, symbol: "Bdag", id: "bdag-coin-id" }, 
  { name: "ADA", balance: 793.0, symbol: "ADA", id: "cardano" }, 
  { name: "$PEPU", balance: 31250.0, symbol: "$PEPU", id: "pepu-coin-id" },
];

// Custom prices for coins not available on CoinGecko
const customPrices = {
  "brett-coin-id": 0.09022, 
  "wolf-coin-id": 0.00309, 
  "pika-coin-id": 0.0000000003066, 
  "bdag-coin-id": 0.019, 
  "pepu-coin-id": 0.008032,
};

document.getElementById("wallet-address").innerText = walletAddress;

coins.forEach((coin, index) => {
  document.getElementById(`coin${index + 1}-name`).innerText = coin.name;
  document.getElementById(`coin${index + 1}-balance`).innerText =
    `${coin.balance.toFixed(4)} ${coin.symbol}`;
});

async function fetchPrices() {
  const ids = coins
    .filter((coin) => coin.id)
    .map((coin) => coin.id)
    .join(",");
  if (!ids) return {};

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_7d_change=true`,
  );
  const prices = await response.json();
  return prices;
}

async function updatePortfolioValue() {
  const prices = await fetchPrices();
  let totalValue = 0;
  let initialTotalValue = 0;

  coins.forEach((coin, index) => {
    const price = prices[coin.id]?.usd || customPrices[coin.id] || 0; 
    const priceChangePercentage = prices[coin.id]?.usd_7d_change || 0; 
    const coinValue = price * coin.balance;
    totalValue += coinValue;

    const coinPriceElement = document.getElementById(`coin${index + 1}-price`);
    const coinBalanceElement = document.getElementById(
      `coin${index + 1}-balance`,
    );

    if (coinPriceElement) {
      coinPriceElement.innerText = `$${price.toFixed(10)} USD (${priceChangePercentage.toFixed(2)}% 7d)`;
      if (price > 0) {
        coinPriceElement.classList.add("positive-value");
      } else {
        coinPriceElement.classList.remove("positive-value");
      }
    }

    if (coinBalanceElement) {
      coinBalanceElement.innerText = `${coin.balance.toFixed(4)} ${coin.symbol} ($${coinValue.toFixed(2)})`;
      if (coinValue > 0) {
        coinBalanceElement.classList.add("positive-value");
      } else {
        coinBalanceElement.classList.remove("positive-value");
      }
    }

    initialTotalValue += coin.balance * (prices[coin.id]?.usd / (1 + priceChangePercentage / 100) || customPrices[coin.id]);
  });

  const totalValueElement = document.getElementById("total-value");
  const initialInvestmentElement = document.getElementById("initial-investment");
  const currentValueElement = document.getElementById("current-value");
  const totalProfitElement = document.getElementById("total-profit");

  const portfolioChangePercentage = ((totalValue - initialTotalValue) / initialTotalValue) * 100;

  if (totalValueElement) {
    totalValueElement.innerText = `$${totalValue.toFixed(2)} (${portfolioChangePercentage.toFixed(2)}% 7d)`;
    if (totalValue > 0) {
      totalValueElement.classList.add("positive-value");
    } else {
      totalValueElement.classList.remove("positive-value");
    }
  }

  // Display the initial investment, current value, and total profit/loss
  if (initialInvestmentElement) {
    initialInvestmentElement.innerText = `$${initialInvestment.toFixed(2)}`;
  }
  if (currentValueElement) {
    currentValueElement.innerText = `$${totalValue.toFixed(2)}`;
  }
  if (totalProfitElement) {
    const totalProfit = totalValue - initialInvestment;
    totalProfitElement.innerText = `$${totalProfit.toFixed(2)}`;
    if (totalProfit >= 0) {
      totalProfitElement.classList.add("positive-value");
    } else {
      totalProfitElement.classList.remove("positive-value");
    }
  }
}

updatePortfolioValue();
setInterval(updatePortfolioValue, 60000); // Update every 60 seconds
