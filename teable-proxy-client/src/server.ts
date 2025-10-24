import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { TeableProxyClient } from './index';

dotenv.config();
const app = express();
app.use(express.json());

const client = new TeableProxyClient({
  apiKey: process.env.TEABLE_API_KEY!,
  endpoint: process.env.TEABLE_API_ENDPOINT,
});

app.post('/query', async (req: Request, res: Response) => {
  try {
    const result = await client.query(req.body.sql);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 42345;
app.listen(PORT, () => {
  console.log(`Teable Proxy running at http://localhost:${PORT}`);
});