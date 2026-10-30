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
      pageViews: prev ? (Math.max(0, Number(prev.pageViews || prev.visitors)) || 0) : 0,
      visitors: prev ? (Math.max(0, Number(prev.visitors)) || 0) : 0,
      downloads: prev ? (Math.max(0, Number(prev.downloads)) || 0) : 0
    });
  }
  return targetDays;
}

export function reconcileDailyHistory(history = [], totalVisitors = 0, totalDownloads = 0, recentEvents = []) {
  const aligned = alignDailyHistory(history);

  aligned.forEach(d => {
    d.pageViews = Math.max(0, Number(d.pageViews || d.visitors) || 0);
    d.visitors = Math.max(0, Number(d.visitors) || 0);
    d.downloads = Math.max(0, Number(d.downloads) || 0);
  });

  // Reconcile directly against recent genuine telemetry events
  if (Array.isArray(recentEvents) && recentEvents.length > 0) {
    const eventsByDate = {};
    recentEvents.forEach(ev => {
      if (!ev || !ev.time) return;
      const dateStr = new Date(ev.time).toISOString().split('T')[0];
      if (!eventsByDate[dateStr]) {
        eventsByDate[dateStr] = { visits: 0, devices: new Set(), downloads: 0 };
      }
      if (ev.type === 'visit') {
        eventsByDate[dateStr].visits++;
        eventsByDate[dateStr].devices.add(ev.device || 'user');
      } else if (ev.type === 'download') {
        eventsByDate[dateStr].downloads++;
      }
    });

    aligned.forEach(d => {
      const dayData = eventsByDate[d.date];
      if (dayData) {
        d.pageViews = Math.max(d.pageViews, dayData.visits);
        d.visitors = Math.max(d.visitors, dayData.devices.size);
        d.downloads = Math.max(d.downloads, dayData.downloads);
      }
    });
  }

  // Ensure pageViews >= visitors
  aligned.forEach(d => {
    if (d.pageViews < d.visitors) {
      d.pageViews = d.visitors;
    }
  });

  const tVisitors = Math.max(0, Number(totalVisitors) || 0);
  const tDownloads = Math.max(0, Number(totalDownloads) || 0);

  let visitorSum = aligned.reduce((sum, d) => sum + d.visitors, 0);
  let downloadSum = aligned.reduce((sum, d) => sum + d.downloads, 0);

  if (visitorSum > tVisitors && tVisitors > 0) {
    let excess = visitorSum - tVisitors;
    for (let i = 0; i < aligned.length && excess > 0; i++) {
      if (aligned[i].visitors > 0) {
        const take = Math.min(aligned[i].visitors, excess);
        aligned[i].visitors -= take;
        excess -= take;
      }
    }
  }

  if (downloadSum > tDownloads && tDownloads > 0) {
    let excess = downloadSum - tDownloads;
    for (let i = 0; i < aligned.length && excess > 0; i++) {
      if (aligned[i].downloads > 0) {
        const take = Math.min(aligned[i].downloads, excess);
        aligned[i].downloads -= take;
        excess -= take;
      }
    }
  }

  return aligned;
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

function readFromTmp() {
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
          dailyHistory: alignDailyHistory(parsed.dailyHistory),
          recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : []
        };
      }
    }
  } catch (_) {}

  // Filter out any admin visits from memory (admin uses Windows Chrome from Google)
  if (Array.isArray(memoryAnalytics.recentEvents)) {
    memoryAnalytics.recentEvents = memoryAnalytics.recentEvents.filter(e => {
      if (!e) return false;
      const p = (e.path || '').toLowerCase();
      const d = (e.device || '').toLowerCase();
      const r = (e.referrer || '').toLowerCase();
      return !p.startsWith('/admin') && !p.includes('admin') && !d.includes('windows') && !r.includes('google');
    });

    // Deduplicate memory events occurring within 5 seconds
    const deduped = [];
    for (const ev of memoryAnalytics.recentEvents) {
      const isDup = deduped.some(prev => {
        if (prev.type !== ev.type) return false;
        const sameTarget = (prev.path || prev.fileName || '') === (ev.path || ev.fileName || '');
        const sameDev = (prev.device || '') === (ev.device || '');
        const timeDiff = Math.abs((Number(prev.time) || 0) - (Number(ev.time) || 0));
        return sameTarget && sameDev && timeDiff < 5000;
      });
      if (!isDup) deduped.push(ev);
    }
    memoryAnalytics.recentEvents = deduped;
  }

  // Admin visits must never pollute Windows OS metrics or Google referrer metrics
  if (memoryAnalytics.devices) {
    memoryAnalytics.devices.windows = 0;
  }
  if (memoryAnalytics.referrers) {
    memoryAnalytics.referrers.google = 0;
  }

  // Ensure daily history is reconciled with true totals
  memoryAnalytics.dailyHistory = reconcileDailyHistory(
    memoryAnalytics.dailyHistory,
    memoryAnalytics.totalVisitors,
    memoryAnalytics.totalDownloads
  );
}

readFromTmp();

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

  readFromTmp();

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

      if (event.type === 'purge_admin') {
        const initialLen = memoryAnalytics.recentEvents.length;
        memoryAnalytics.recentEvents = (memoryAnalytics.recentEvents || []).filter(e => {
          if (!e) return false;
          const p = (e.path || '').toLowerCase();
          const d = (e.device || '').toLowerCase();
          const r = (e.referrer || '').toLowerCase();
          return !p.startsWith('/admin') && !p.includes('admin') && !d.includes('windows') && !r.includes('google');
        });

        const removed = Math.max(1, initialLen - memoryAnalytics.recentEvents.length);
        memoryAnalytics.totalVisitors = Math.max(0, (memoryAnalytics.totalVisitors || 0) - removed);
        memoryAnalytics.totalPageViews = Math.max(0, (memoryAnalytics.totalPageViews || 0) - removed);

        if (memoryAnalytics.devices) memoryAnalytics.devices.windows = 0;
        if (memoryAnalytics.referrers) memoryAnalytics.referrers.google = 0;

        const today = memoryAnalytics.dailyHistory.find(d => d.date === todayStr);
        if (today) {
          today.visitors = Math.max(0, (today.visitors || 0) - removed);
        }

        memoryAnalytics.dailyHistory = reconcileDailyHistory(
          memoryAnalytics.dailyHistory,
          memoryAnalytics.totalVisitors,
          memoryAnalytics.totalDownloads
        );

        saveToTmp();
        return res.status(200).json({ success: true, analytics: memoryAnalytics });
      }

      if (event.type === 'page_view') {
        const path = (event.path || '/').toLowerCase();
        const search = (event.search || '').toLowerCase();
        const dev = (event.device || 'android').toLowerCase();
        const isExplicitAdmin = event.isAdmin ||
          dev === 'windows' ||
          path.startsWith('/admin') ||
          path.includes('admin') ||
          search.includes('admin') ||
          search.includes('page=admin');

        // Strictly ignore any administrator visits
        if (isExplicitAdmin) {
          return res.status(200).json({ success: true, analytics: memoryAnalytics });
        }

        memoryAnalytics.totalPageViews = (memoryAnalytics.totalPageViews || 0) + 1;
        memoryAnalytics.dailyHistory = alignDailyHistory(memoryAnalytics.dailyHistory);
        const todayPv = memoryAnalytics.dailyHistory.find(d => d.date === todayStr);
        if (todayPv) {
          todayPv.pageViews = (todayPv.pageViews || 0) + 1;
        }
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

          memoryAnalytics.dailyHistory = alignDailyHistory(memoryAnalytics.dailyHistory);
          const today = memoryAnalytics.dailyHistory.find(d => d.date === todayStr);
          if (today) {
            today.visitors = (today.visitors || 0) + 1;
          }
        }

        memoryAnalytics.recentEvents.unshift({
          id: `ev-${now}-${Math.floor(Math.random() * 1000)}`,
          type: 'visit',
          path: event.path || '/',
          device: `${(event.device || 'Android').toUpperCase()} (${event.browser || 'Browser'})`,
          browser: event.browser || 'Browser',
          referrer: event.referrer || 'direct',
          time: now
        });
        if (memoryAnalytics.recentEvents.length > 50) memoryAnalytics.recentEvents.pop();

      } else if (event.type === 'apk_download') {
        if (event.isAdmin) {
          return res.status(200).json({ success: true, analytics: memoryAnalytics });
        }

        memoryAnalytics.totalDownloads = (memoryAnalytics.totalDownloads || 0) + 1;
        memoryAnalytics.dailyHistory = alignDailyHistory(memoryAnalytics.dailyHistory);
        const today = memoryAnalytics.dailyHistory.find(d => d.date === todayStr);
        if (today) {
          today.downloads = (today.downloads || 0) + 1;
        }

        memoryAnalytics.recentEvents.unshift({
          id: `ev-${now}-${Math.floor(Math.random() * 1000)}`,
          type: 'download',
          version: event.version || 'v11.5.6',
          fileName: event.fileName || 'Sielo-11.5.6.apk',
          device: (event.device || 'Android').toUpperCase(),
          time: now
        });
        if (memoryAnalytics.recentEvents.length > 50) memoryAnalytics.recentEvents.pop();
      }

      memoryAnalytics.dailyHistory = reconcileDailyHistory(
        memoryAnalytics.dailyHistory,
        memoryAnalytics.totalVisitors,
        memoryAnalytics.totalDownloads,
        memoryAnalytics.recentEvents
      );

      saveToTmp();
      return res.status(200).json({ success: true, analytics: memoryAnalytics });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to record analytics' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
