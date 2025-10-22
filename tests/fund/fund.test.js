const request = require('supertest');
const app = require('../../apps/fund-server/index');

describe('GET /api/funds', () => {
  it('should return fund list', async () => {
    const res = await request(app).get('/api/funds');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});