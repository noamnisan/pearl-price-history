const API_BASE = "https://api.pearl-otc.com";
const PAGE_SIZE = 100;

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "PearlPriceHistory/1.0",
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Pearl API returned ${response.status}: ${body.slice(0, 160)}`);
  }

  return response.json();
}

async function fetchAllTrades() {
  const trades = [];
  let total = null;
  let offset = 0;

  while (total === null || offset < total) {
    const url = `${API_BASE}/trades/public/all?limit=${PAGE_SIZE}&offset=${offset}`;
    const page = await fetchJson(url);
    const pageTrades = Array.isArray(page.trades) ? page.trades : [];
    trades.push(...pageTrades);
    total = Number.isFinite(Number(page.total)) ? Number(page.total) : trades.length;

    if (pageTrades.length === 0) break;
    offset += pageTrades.length;

    if (offset > 100000) {
      throw new Error("Stopped after 100,000 trades to avoid an unexpected pagination loop.");
    }
  }

  return {
    fetched_at: new Date().toISOString(),
    total: trades.length,
    source: `${API_BASE}/trades/public/all`,
    trades,
  };
}

export default async function handler(_request, response) {
  try {
    response.setHeader("cache-control", "s-maxage=60, stale-while-revalidate=300");
    response.status(200).json(await fetchAllTrades());
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
