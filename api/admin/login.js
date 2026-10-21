import crypto from 'crypto';

// Server-side environment variables or isolated salted hash
// To customize on Vercel: set SIELO_ADMIN_USER, SIELO_ADMIN_SALT, SIELO_ADMIN_HASH in Vercel project environment
const ADMIN_USER = process.env.SIELO_ADMIN_USER || 'admin';
const ADMIN_SALT = process.env.SIELO_ADMIN_SALT || 'sielo_salt_9f8b2a1c4e7d';
const ADMIN_HASH = process.env.SIELO_ADMIN_HASH || 'ac1bc1824db3cbefaa97211dde404d185706072c3d6587c3799ce2f2466ce7e5';

function hashWithSalt(password, salt) {
  return crypto.createHash('sha256').update(`${salt}_${password}_${salt}`).digest('hex');
}

export default async function handler(req, res) {
  // Set CORS and security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const cleanUser = String(username).trim().toLowerCase();
    if (cleanUser !== ADMIN_USER.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const computedHash = hashWithSalt(password, ADMIN_SALT);
    if (computedHash !== ADMIN_HASH) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Success: Generate cryptographically secure token
    const token = crypto.randomBytes(32).toString('hex');
    return res.status(200).json({
      success: true,
      username: ADMIN_USER,
      token,
      expiresIn: 7200
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
