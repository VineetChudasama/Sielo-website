// In-memory / serverless registry for synced users
let syncedUsersStore = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Sync user profile from Sielo App
  if (req.method === 'POST') {
    try {
      const user = req.body || {};
      if (!user.email && !user.id) {
        return res.status(400).json({ error: 'User id or email required' });
      }

      const existingIdx = syncedUsersStore.findIndex(
        u => (u.id && u.id === user.id) || (u.email && u.email === user.email)
      );

      const formattedUser = {
        id: user.id || `usr_${Date.now()}`,
        name: user.name || 'Sielo Listener',
        email: user.email || 'N/A',
        username: user.username || '',
        avatar: user.avatar || null,
        provider: user.provider || 'Google',
        createdAt: user.createdAt || Date.now(),
        lastSyncedAt: Date.now(),
        favoriteArtists: user.favoriteArtists || [],
        streamCount: typeof user.streamCount === 'number' ? user.streamCount : (parseInt(user.streamCount, 10) || 0),
        likedCount: typeof user.likedCount === 'number' ? user.likedCount : (parseInt(user.likedCount, 10) || 0),
        status: user.status || 'Active Now',
        appVersion: user.appVersion || '11.5.6',
        device: user.device || 'Android'
      };

      if (existingIdx >= 0) {
        syncedUsersStore[existingIdx] = { ...syncedUsersStore[existingIdx], ...formattedUser };
      } else {
        syncedUsersStore.unshift(formattedUser);
      }

      return res.status(200).json({ success: true, user: formattedUser });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to record user' });
    }
  }

  // GET: Fetch real registered users from Firestore sielo_users and synced store
  const FIRESTORE_PROJECT_ID = 'sielo-94459';
  const FIRESTORE_API_KEY = 'AIzaSyAb91mTVyDM3eCVqYwvyjcHy2sniPqy0AI';

  const combinedUsers = [...syncedUsersStore];

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/sielo_users?key=${FIRESTORE_API_KEY}`;
    const fsResp = await fetch(url);
    if (fsResp.ok) {
      const fsData = await fsResp.json();
      if (fsData.documents && Array.isArray(fsData.documents)) {
        for (const doc of fsData.documents) {
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

            const existingIdx = combinedUsers.findIndex(u => u.id === uid || (email !== 'N/A' && u.email === email));
            const userObj = {
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

            if (existingIdx >= 0) {
              combinedUsers[existingIdx] = { ...combinedUsers[existingIdx], ...userObj, streamCount: Math.max(combinedUsers[existingIdx].streamCount || 0, streamCount) };
            } else {
              combinedUsers.push(userObj);
            }
          } catch (innerErr) {
            console.warn('Error reading user subdoc:', innerErr);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not query Firestore API:', err);
  }

  return res.status(200).json({
    success: true,
    users: combinedUsers
  });
}
