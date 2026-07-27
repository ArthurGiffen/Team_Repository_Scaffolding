// Standalone check of the auth logic that doesn't require a live MongoDB
// connection: bcrypt hashing/compare, JWT sign/verify, and the requireAuth
// middleware's pass/reject behavior. Run with: node test-auth-logic.js
process.env.JWT_SECRET = 'test-secret-for-local-check-only';

const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('./src/middleware/requireAuth');

async function main() {
  // 1. bcrypt hash + compare round-trip
  const hash = await bcrypt.hash('correct-horse-battery-staple', 10);
  assert.strictEqual(await bcrypt.compare('correct-horse-battery-staple', hash), true);
  assert.strictEqual(await bcrypt.compare('wrong-password', hash), false);
  console.log('PASS: bcrypt hash/compare round-trip');

  // 2. JWT sign + verify round-trip
  const fakeUserId = '64f0000000000000000000aa';
  const token = jwt.sign({ sub: fakeUserId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  assert.strictEqual(decoded.sub, fakeUserId);
  console.log('PASS: JWT sign/verify round-trip');

  // 3. requireAuth rejects a request with no Authorization header
  await new Promise((resolve) => {
    const req = { headers: {} };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        assert.strictEqual(this.statusCode, 401);
        assert.ok(body.error.includes('missing'));
        console.log('PASS: requireAuth -> 401 when no token present');
        resolve();
      },
    };
    requireAuth(req, res, () => {
      throw new Error('next() should NOT have been called with no token');
    });
  });

  // 4. requireAuth rejects an invalid/garbage token
  await new Promise((resolve) => {
    const req = { headers: { authorization: 'Bearer not-a-real-token' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        assert.strictEqual(this.statusCode, 401);
        assert.ok(body.error.includes('invalid'));
        console.log('PASS: requireAuth -> 401 when token is invalid');
        resolve();
      },
    };
    requireAuth(req, res, () => {
      throw new Error('next() should NOT have been called with a bad token');
    });
  });

  // 5. requireAuth accepts a valid token, attaches req.userId, calls next()
  await new Promise((resolve) => {
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {}; // should never be touched on the success path
    requireAuth(req, res, () => {
      assert.strictEqual(req.userId, fakeUserId);
      console.log('PASS: requireAuth -> next() called and req.userId set for a valid token');
      resolve();
    });
  });

  console.log('\nAll auth-logic checks passed.');
}

main().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
