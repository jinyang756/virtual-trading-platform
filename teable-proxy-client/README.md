# Teable Proxy Client

A lightweight Node.js proxy for querying [Teable](https://teable.ai) databases via SQL.

## Features

- Query Teable via SQL
- Use as a standalone proxy server or import as a library
- TypeScript support
- Easy to deploy on any Node.js environment

## Installation

```bash
npm install teable-proxy-client
```

## Usage

### 1. As a standalone server

```bash
cp .env.example .env
# Edit .env to set your TEABLE_API_KEY
npm install
npm run build
npm start
```

Then POST to `http://localhost:42345/query` with:

```json
{
  "sql": "SELECT * FROM your_table LIMIT 10"
}
```

### 2. As a library

```ts
import { TeableProxyClient } from 'teable-proxy-client';

const client = new TeableProxyClient({ apiKey: 'your-key' });
const data = await client.query('SELECT * FROM your_table');
```

## API Reference

### TeableProxyClient

#### Constructor

```ts
new TeableProxyClient(options: TeableProxyOptions)
```

Options:
- `apiKey` (string, required): Your Teable API key
- `endpoint` (string, optional): Teable API endpoint (defaults to `https://api.teable.ai/query`)

#### query(sql)

Execute a SQL query against your Teable database.

```ts
const result = await client.query('SELECT * FROM your_table');
```

## Environment Variables

- `TEABLE_API_KEY`: Your Teable API key (required)
- `PORT`: Port for the server to listen on (defaults to 42345)

## License

MIT