# Pearl Price History

A small public dashboard for Pearl OTC settlement history.

The app fetches public completed settlements from Pearl OTC, computes quantity-weighted average PRL prices by time bucket, and displays interactive chart buckets with included transaction details.

## Features

- 1 day and 1 week views at hourly granularity
- 1 month and 1 year views at daily granularity
- Quantity-weighted average price per bucket
- Error bars from lowest to highest trade price in each bucket
- Clickable chart points for bucket transaction details
- Public Pearl OTC link and refresh button

## Deploy

This repo is ready for Vercel. Static files live at the repo root and `/api/trades.js` is the Vercel serverless proxy for Pearl OTC data.
