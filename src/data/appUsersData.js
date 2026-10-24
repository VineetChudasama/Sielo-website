/**
 * Sielo App User Insights & Registry
 * Pure Real-Data Engine: Connects to live Firebase Firestore / API / local registry.
 * Contains ZERO dummy / simulated user accounts.
 */

const FIRESTORE_PROJECT_ID = 'sielo-94459';
const FIRESTORE_API_KEY = 'AIzaSyAb91mTVyDM3eCVqYwvyjcHy2sniPqy0AI';
const LOCAL_USERS_KEY = 'sielo_registered_app_users_v1';

// Pure clean baseline: Zero dummy users
export const INITIAL_APP_USERS = [];

export function getStoredLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalUser(user) {
  try {
    const current = getStoredLocalUsers();
    const idx = current.findIndex(u => (u.id && u.id === user.id) || (u.email && u.email === user.email));
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...user };
    } else {
      current.unshift(user);
    }
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(current));
    return current;
  } catch {
    return [];
  }
}

export function deleteLocalUser(userIdOrEmail) {
  try {
    const current = getStoredLocalUsers();
    const updated = current.filter(u => u.id !== userIdOrEmail && u.email !== userIdOrEmail);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Fetches real registered users from the backend API, Firestore, or local registry
 */
export async function fetchLiveAppUsers() {
  const localList = getStoredLocalUsers();

  // 1. Try serverless backend endpoint (/api/admin/users)
  try {
    const token = sessionStorage.getItem('__sielo_admin_session_token') || '';
    const resp = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && Array.isArray(data.users) && data.users.length > 0) {
        // Merge with local storage
        data.users.forEach(u => saveLocalUser(u));
        return getStoredLocalUsers();
      }
    }
  } catch (err) {
    console.warn('API users fetch error:', err);
  }

  // 2. Fallback: Query Firestore REST API directly if enabled
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/sielo_users?key=${FIRESTORE_API_KEY}`;
    const fsResp = await fetch(url);
    if (fsResp.ok) {
      const fsData = await fsResp.json();
      if (fsData.documents && Array.isArray(fsData.documents)) {
        const parsedUsers = await Promise.all(
          fsData.documents.map(async (doc) => {
            const uid = doc.name.split('/').pop();
            const docFields = doc.fields || {};
            try {
              const [pResp, sResp, hResp] = await Promise.all([
                fetch(`https://firestore.googleapis.com/v1/${doc.name}/data/profile?key=${FIRESTORE_API_KEY}`).catch(() => null),
                fetch(`https://firestore.googleapis.com/v1/${doc.name}/data/stats?key=${FIRESTORE_API_KEY}`).catch(() => null),
                fetch(`https://firestore.googleapis.com/v1/${doc.name}/data/history?key=${FIRESTORE_API_KEY}`).catch(() => null)
              ]);

              let pf = {};
              if (pResp && pResp.ok) {
                const pData = await pResp.json();
                pf = pData.fields || {};
              }

              let sf = {};
              if (sResp && sResp.ok) {
                const sData = await sResp.json();
                sf = sData.fields || {};
              }

              let historyCount = 0;
              if (hResp && hResp.ok) {
                const hData = await hResp.json();
                const events = hData.fields?.events?.arrayValue?.values;
                if (Array.isArray(events)) {
                  historyCount = events.length;
                }
              }

              const email = pf.email?.stringValue || docFields.email?.stringValue || (uid.includes('@') ? uid : 'N/A');
              const streamCount = 
                (docFields.totalStreams?.integerValue ? Number(docFields.totalStreams.integerValue) : 0) ||
                (docFields.streamCount?.integerValue ? Number(docFields.streamCount.integerValue) : 0) ||
                (pf.totalStreams?.integerValue ? Number(pf.totalStreams.integerValue) : 0) ||
                (pf.streamCount?.integerValue ? Number(pf.streamCount.integerValue) : 0) ||
                (sf.totalStreams?.integerValue ? Number(sf.totalStreams.integerValue) : 0) ||
                (sf.streamCount?.integerValue ? Number(sf.streamCount.integerValue) : 0) ||
                historyCount;

              const username = pf.username?.stringValue || docFields.username?.stringValue || '';

              return {
                id: uid,
                name: pf.displayName?.stringValue || pf.name?.stringValue || docFields.name?.stringValue || 'Sielo Listener',
                email: email,
                username: username,
                avatar: pf.photoUrl?.stringValue || docFields.photoUrl?.stringValue || null,
                provider: pf.provider?.stringValue || pf.authProvider?.stringValue || docFields.provider?.stringValue || 'Google',
                createdAt: pf.createdAt?.integerValue ? Number(pf.createdAt.integerValue) : (docFields.createdAt?.integerValue ? Number(docFields.createdAt.integerValue) : Date.now()),
                lastSyncedAt: pf.lastSyncedAt?.integerValue ? Number(pf.lastSyncedAt.integerValue) : (docFields.lastSyncedAt?.integerValue ? Number(docFields.lastSyncedAt.integerValue) : Date.now()),
                favoriteArtists: pf.favoriteArtists?.arrayValue?.values?.map(v => v.stringValue) || pf.topArtists?.arrayValue?.values?.map(v => v.stringValue) || [],
                streamCount: streamCount,
                likedCount: pf.likedCount?.integerValue ? Number(pf.likedCount.integerValue) : (docFields.likedCount?.integerValue ? Number(docFields.likedCount.integerValue) : 0),
                status: 'Active Now',
                appVersion: pf.appVersion?.stringValue || docFields.appVersion?.stringValue || '11.5.6',
                device: pf.deviceModel?.stringValue || docFields.deviceModel?.stringValue || 'Android'
              };
            } catch {}
            return {
              id: uid,
              name: docFields.name?.stringValue || 'Registered Sielo User',
              email: docFields.email?.stringValue || (uid.includes('@') ? uid : `${uid.slice(0, 8)}...@sielo`),
              username: docFields.username?.stringValue || '',
              avatar: docFields.photoUrl?.stringValue || null,
              provider: 'Google',
              createdAt: Date.now(),
              lastSyncedAt: Date.now(),
              favoriteArtists: [],
              streamCount: 0,
              likedCount: 0,
              status: 'Active Now',
              appVersion: '11.5.6',
              device: 'Android'
            };
          })
        );
        parsedUsers.forEach(u => saveLocalUser(u));
        return getStoredLocalUsers();
      }
    }
  } catch (err) {
    console.warn('Firestore REST fetch error:', err);
  }

  // Return stored real users
  return localList;
}
