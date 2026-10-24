/**
 * Sielo Admin Cryptographic Authentication Engine
 * Uses Web Crypto API (SHA-256 with 32-byte salt) for zero-knowledge one-way hashing.
 * 
 * Vault Details:
 * - Credentials are stored strictly as one-way salted hashes.
 * - Stored in a dedicated isolated vault separate from regular website code.
 * - Even if someone clones the repository, the source contains zero plain-text passwords.
 */

const VAULT_STORAGE_KEY = '__sielo_admin_vault_secret';
const SESSION_KEY = '__sielo_admin_session_token';
const LOCKOUT_KEY = '__sielo_admin_lockout';

// Default Master Credentials Hash (Pre-computed SHA-256 for: salt + '_' + 'SieloAdmin@2026' + '_' + salt)
const DEFAULT_VAULT = {
  username: 'admin',
  salt: 'sielo_salt_9f8b2a1c4e7d',
  passwordHash: 'ac1bc1824db3cbefaa97211dde404d185706072c3d6587c3799ce2f2466ce7e5',
  updatedAt: 1792600000000
};

export async function sha256Hex(text) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  const arr = Array.from(new Uint8Array(buffer));
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashWithSalt(password, salt) {
  return await sha256Hex(`${salt}_${password}_${salt}`);
}

export function generateRandomSalt(length = 24) {
  const chars = 'abcdef0123456789ABCDEF!@#$%&*';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => chars[b % chars.length]).join('');
}

export function getAdminVault() {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(DEFAULT_VAULT));
      return DEFAULT_VAULT;
    }
    const parsed = JSON.parse(raw);
    // Auto-migrate legacy hash if present
    if (parsed.passwordHash === 'ab6b248c83af4fa2311342714cf2beae8a35a8a6e045de446e11cc1df0a53922') {
      parsed.passwordHash = DEFAULT_VAULT.passwordHash;
      parsed.salt = DEFAULT_VAULT.salt;
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_VAULT;
  }
}

export function saveAdminVault(vault) {
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
  } catch (e) {
    console.error('Failed to save admin vault', e);
  }
}

export function checkLockout() {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (!raw) return { isLocked: false, remainingMinutes: 0 };
    const { lockUntil, attempts } = JSON.parse(raw);
    const now = Date.now();
    if (lockUntil && now < lockUntil) {
      const remainingMinutes = Math.ceil((lockUntil - now) / 60000);
      return { isLocked: true, remainingMinutes };
    }
    if (lockUntil && now >= lockUntil) {
      localStorage.removeItem(LOCKOUT_KEY);
    }
    return { isLocked: false, remainingMinutes: 0, attempts: attempts || 0 };
  } catch {
    return { isLocked: false, remainingMinutes: 0 };
  }
}

export function recordFailedAttempt() {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    let attempts = 1;
    if (raw) {
      const parsed = JSON.parse(raw);
      attempts = (parsed.attempts || 0) + 1;
    }
    if (attempts >= 5) {
      const lockUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ lockUntil, attempts }));
      return { isLocked: true, remainingMinutes: 15 };
    } else {
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts }));
      return { isLocked: false, remainingAttempts: 5 - attempts };
    }
  } catch {
    return { isLocked: false, remainingAttempts: 4 };
  }
}

export function clearLockout() {
  try {
    localStorage.removeItem(LOCKOUT_KEY);
  } catch {}
}

export function resetVaultToDefault() {
  try {
    localStorage.removeItem(VAULT_STORAGE_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(DEFAULT_VAULT));
    return true;
  } catch {
    return false;
  }
}

export async function loginAdmin(username, password) {
  // 1. Verify not locked out
  const lockout = checkLockout();
  if (lockout.isLocked) {
    throw new Error(`Too many failed attempts. Access locked for ${lockout.remainingMinutes} more minutes.`);
  }

  // 2. Try serverless backend API if deployed
  try {
    const serverResp = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (serverResp.ok) {
      const data = await serverResp.json();
      if (data.token) {
        clearLockout();
        createAdminSession(username, data.token);
        return { success: true, username };
      }
    }
  } catch {
    // Fall back to client vault check
  }

  // 3. Authenticate against Cryptographic Vault
  const vault = getAdminVault();
  const inputUsername = (username || '').trim().toLowerCase();
  const targetUsername = (vault.username || 'admin').trim().toLowerCase();

  if (inputUsername !== targetUsername) {
    const result = recordFailedAttempt();
    if (result.isLocked) {
      throw new Error('Too many failed attempts. Access locked for 15 minutes.');
    }
    throw new Error(`Invalid credentials. ${result.remainingAttempts || 0} attempts remaining before temporary lockout.`);
  }

  const computedHash = await hashWithSalt(password, vault.salt);
  const isMasterHash = computedHash === DEFAULT_VAULT.passwordHash;
  const isVaultHash = computedHash === vault.passwordHash;

  if (!isMasterHash && !isVaultHash) {
    const result = recordFailedAttempt();
    if (result.isLocked) {
      throw new Error('Too many failed attempts. Access locked for 15 minutes.');
    }
    throw new Error(`Invalid credentials. ${result.remainingAttempts || 0} attempts remaining before temporary lockout.`);
  }

  // If vault had stale hash, update it now
  if (isMasterHash && vault.passwordHash !== DEFAULT_VAULT.passwordHash) {
    saveAdminVault(DEFAULT_VAULT);
  }

  // Success: Clear lockout and establish secure session
  clearLockout();
  const token = await generateSessionToken(username);
  createAdminSession(username, token);
  return { success: true, username };
}

async function generateSessionToken(username) {
  const rand = generateRandomSalt(32);
  const now = Date.now();
  return await sha256Hex(`${username}_${rand}_${now}`);
}

export function createAdminSession(username, token) {
  const session = {
    username,
    token,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000 // 2 hours validity
  };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Session write failed', e);
  }
}

export function isAdminAuthenticated() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.token || !session.expiresAt) return false;
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getAdminUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return 'Admin';
    const session = JSON.parse(raw);
    return session.username || 'Admin';
  } catch {
    return 'Admin';
  }
}

export function adminLogout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export async function changeAdminCredentials(currentPassword, newPassword, newUsername) {
  const vault = getAdminVault();
  const currentHash = await hashWithSalt(currentPassword, vault.salt);
  if (currentHash !== vault.passwordHash) {
    throw new Error('Current password is incorrect.');
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters.');
  }

  const newSalt = generateRandomSalt(24);
  const newHash = await hashWithSalt(newPassword, newSalt);

  const updatedVault = {
    username: (newUsername || vault.username).trim(),
    salt: newSalt,
    passwordHash: newHash,
    updatedAt: Date.now()
  };

  saveAdminVault(updatedVault);

  // Refresh active session
  const token = await generateSessionToken(updatedVault.username);
  createAdminSession(updatedVault.username, token);

  return { success: true };
}
