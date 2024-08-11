// main.js

const walletAddress = "0xAAee01e392ef10865685B4f66b19e5a8EAA678DD";
const coins = [
  { name: "Ethereum", balance: 0.0, symbol: "ETH", id: "ethereum" },
  { name: "Bitcoin", balance: 0.005, symbol: "BTC", id: "bitcoin" }, // Updated balance to 0.0050 (half of 0.0100)
  { name: "Litecoin", balance: 0.0, symbol: "LTC", id: "litecoin" },
  { name: "XRP", balance: 2718.77, symbol: "XRP", id: "ripple" }, // Updated balance to 2718.7700
  { name: "Brett", balance: 1698.31, symbol: "Brett", id: "brett-coin-id" }, // Replace with actual ID
  { name: "Wolf", balance: 74589.43, symbol: "Wolf", id: "wolf-coin-id" }, // Replace with actual ID
  { name: "Pika", balance: 192307.69, symbol: "Pika", id: "pika-coin-id" }, // Replace with actual ID
  { name: "Bdag", balance: 69302.88, symbol: "Bdag", id: "bdag-coin-id" }, // Replace with actual ID
  { name: "ADA", balance: 793.0, symbol: "ADA", id: "cardano" }, // Added ADA with balance 793
  { name: "$PEPU", balance: 31250.0, symbol: "$PEPU", id: "pepu-coin-id" }, // Added PEPU with balance 31250.0000
];

// Custom prices for coins not available on CoinGecko
const customPrices = {
  "brett-coin-id": 0.09022, // Updated price for Brett
  "wolf-coin-id": 0.006091, // Updated price for Wolf
  "pika-coin-id": 0.0000000003066, // Updated price for Pika
  "bdag-coin-id": 0.017, // Updated price for Bdag
  "pepu-coin-id": 0.008032, // Price for PEPU
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
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
  );
  const prices = await response.json();
  return prices;
}

async function updatePortfolioValue() {
  const prices = await fetchPrices();
  let totalValue = 0;

  coins.forEach((coin, index) => {
    const price = prices[coin.id]?.usd || customPrices[coin.id] || 0; // Use custom price if not available
    const coinValue = price * coin.balance;
    totalValue += coinValue;

    const coinPriceElement = document.getElementById(`coin${index + 1}-price`);
    const coinBalanceElement = document.getElementById(
      `coin${index + 1}-balance`,
    );

    if (coinPriceElement) {
      coinPriceElement.innerText = `$${price.toFixed(10)} USD`;
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
  });

  const totalValueElement = document.getElementById("total-value");
  if (totalValueElement) {
    totalValueElement.innerText = `$${totalValue.toFixed(2)}`;
    if (totalValue > 0) {
      totalValueElement.classList.add("positive-value");
    } else {
      totalValueElement.classList.remove("positive-value");
    }
  }
}

updatePortfolioValue();
setInterval(updatePortfolioValue, 60000); // Update every 60 seconds
