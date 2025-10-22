const request = require('supertest');
const app = require('../../apps/contract-market/index');

describe('GET /api/contract-market', () => {
  it('should return contract market data', async () => {
    const res = await request(app).get('/api/contract-market');
    expect(res.statusCode).toBe(200);
  });
});