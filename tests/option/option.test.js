const request = require('supertest');
const app = require('../../apps/option-market/index');

describe('GET /api/option-market', () => {
  it('should return option market data', async () => {
    const res = await request(app).get('/api/option-market');
    expect(res.statusCode).toBe(200);
  });
});