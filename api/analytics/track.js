import fs from 'fs';

const TMP_FILE = '/tmp/sielo_analytics_v1.json';

export function alignDailyHistory(existing = []) {
  const targetDays = [];
  const now = new Date();
  const existingMap = new Map();
  if (Array.isArray(existing)) {
    existing.forEach(item => {
      if (item && item.date) {
        existingMap.set(item.date, item);
      }
    });
  }

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    const prev = existingMap.get(dateStr);
    targetDays.push({
      date: dateStr,
      label: dayLabel,
      visitors: prev ? (Number(prev.visitors) || 0) : 0,
      downloads: prev ? (Number(prev.downloads) || 0) : 0
    });
  }
  return targetDays;
}

let memoryAnalytics = {
  totalVisitors: 0,
  totalPageViews: 0,
  totalDownloads: 0,
  devices: { android: 0, windows: 0, ios: 0, mac: 0, linux: 0 },
  browsers: { chrome: 0, samsung: 0, firefox: 0, safari: 0, edge: 0 },
  referrers: { direct: 0, google: 0, github: 0, whatsapp: 0, instagram: 0 },
  dailyHistory: alignDailyHistory(),
  recentEvents: []
};

// Warm read from temporary storage if available
try {
  if (fs.existsSync(TMP_FILE)) {
    const raw = fs.readFileSync(TMP_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.totalDownloads === 'number') {
      memoryAnalytics = {
        ...memoryAnalytics,
        ...parsed,
        devices: { ...memoryAnalytics.devices, ...(parsed.devices || {}) },
        browsers: { ...memoryAnalytics.browsers, ...(parsed.browsers || {}) },
        referrers: { ...memoryAnalytics.referrers, ...(parsed.referrers || {}) },
        dailyHistory: alignDailyHistory(parsed.dailyHistory)
      };
    }
  }
} catch (_) {}

function saveToTmp() {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(memoryAnalytics), 'utf8');
  } catch (_) {}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure daily history always matches current 14 calendar days
  memoryAnalytics.dailyHistory = alignDailyHistory(memoryAnalytics.dailyHistory);

  // GET: Return current live analytics state
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      analytics: memoryAnalytics
    });
  }

  // POST: Record telemetry event
  if (req.method === 'POST') {
    try {
      const event = req.body || {};
      const now = Date.now();
      const todayStr = new Date().toISOString().split('T')[0];
      const today = memoryAnalytics.dailyHistory.find(d => d.date === todayStr);

      if (event.type === 'page_view') {
        const path = (event.path || '/').toLowerCase();
        if (!path.startsWith('/admin')) {
          memoryAnalytics.totalPageViews = (memoryAnalytics.totalPageViews || 0) + 1;
          if (event.isNewSession) {
            memoryAnalytics.totalVisitors = (memoryAnalytics.totalVisitors || 0) + 1;
            const dev = (event.device || 'android').toLowerCase();
            if (memoryAnalytics.devices[dev] !== undefined) {
              memoryAnalytics.devices[dev] = (memoryAnalytics.devices[dev] || 0) + 1;
            }
            const br = (event.browser || 'chrome').toLowerCase();
            if (memoryAnalytics.browsers[br] !== undefined) {
              memoryAnalytics.browsers[br] = (memoryAnalytics.browsers[br] || 0) + 1;
            }
            const ref = (event.referrer || 'direct').toLowerCase();
            if (memoryAnalytics.referrers[ref] !== undefined) {
              memoryAnalytics.referrers[ref] = (memoryAnalytics.referrers[ref] || 0) + 1;
            }

            if (today) {
              today.visitors = (today.visitors || 0) + 1;
            }
          }

          memoryAnalytics.recentEvents.unshift({
            id: `ev-${now}-${Math.floor(Math.random() * 1000)}`,
            type: 'visit',
            path: event.path || '/',
            device: `${(event.device || 'Android').toUpperCase()} (${event.browser || 'Browser'})`,
            time: now
          });
          if (memoryAnalytics.recentEvents.length > 50) memoryAnalytics.recentEvents.pop();
        }
      } else if (event.type === 'apk_download') {
        memoryAnalytics.totalDownloads = (memoryAnalytics.totalDownloads || 0) + 1;
        if (today) {
          today.downloads = (today.downloads || 0) + 1;
        }

        memoryAnalytics.recentEvents.unshift({
          id: `ev-${now}-${Math.floor(Math.random() * 1000)}`,
          type: 'download',
          version: event.version || 'v11.5.6',
          device: (event.device || 'Android').toUpperCase(),
          time: now
        });
        if (memoryAnalytics.recentEvents.length > 50) memoryAnalytics.recentEvents.pop();
      }

      saveToTmp();
      return res.status(200).json({ success: true, analytics: memoryAnalytics });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to record analytics' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
