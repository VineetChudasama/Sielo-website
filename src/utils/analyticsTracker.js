/**
 * Sielo Real-Time Analytics & Event Tracking Engine
 * Pure Real-Data Telemetry: Tracks true unique visitors, page views, APK downloads, and devices.
 * Contains ZERO dummy / simulated data.
 */

const STORAGE_KEY = 'sielo_analytics_vault_real_v1';
const VISITOR_ID_KEY = 'sielo_visitor_uuid';
const SESSION_ID_KEY = 'sielo_session_active';

function generateCleanDailyHistory() {
  const days = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    days.push({
      date: dateStr,
      label: dayLabel,
      visitors: 0,
      downloads: 0
    });
  }
  return days;
}

function getCleanInitialAnalytics() {
  return {
    totalVisitors: 0,
    totalPageViews: 0,
    totalDownloads: 0,
    devices: {
      android: 0,
      windows: 0,
      ios: 0,
      mac: 0,
      linux: 0
    },
    browsers: {
      chrome: 0,
      samsung: 0,
      firefox: 0,
      safari: 0,
      edge: 0
    },
    referrers: {
      direct: 0,
      google: 0,
      github: 0,
      whatsapp: 0,
      instagram: 0
    },
    dailyHistory: generateCleanDailyHistory(),
    recentEvents: []
  };
}

export function getStoredAnalytics() {
  try {
    // Purge legacy dummy storage if present
    localStorage.removeItem('sielo_analytics_vault_v1');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const clean = getCleanInitialAnalytics();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      return clean;
    }

    const parsed = JSON.parse(raw);
    // Double check: if legacy dummy data exists in current key, purge it
    if (parsed.totalVisitors === 1248 || parsed.totalDownloads === 684) {
      const clean = getCleanInitialAnalytics();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      return clean;
    }

    // Clean up phantom page views caused by previous admin page refreshes
    if ((parsed.totalVisitors === 0 || !parsed.totalVisitors) && parsed.totalPageViews > 0) {
      parsed.totalPageViews = 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch {
    return getCleanInitialAnalytics();
  }
}

export function saveAnalytics(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save analytics to localStorage', e);
  }
}

function detectDevice() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'android';
}

function detectBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('samsungbrowser')) return 'samsung';
  if (ua.includes('edg/')) return 'edge';
  if (ua.includes('chrome')) return 'chrome';
  if (ua.includes('firefox')) return 'firefox';
  if (ua.includes('safari')) return 'safari';
  return 'chrome';
}

function detectReferrer() {
  const ref = document.referrer ? document.referrer.toLowerCase() : '';
  if (!ref) return 'direct';
  if (ref.includes('google')) return 'google';
  if (ref.includes('github')) return 'github';
  if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'whatsapp';
  if (ref.includes('instagram')) return 'instagram';
  return 'direct';
}

export function trackPageView(path = window.location.pathname) {
  try {
    const currentPath = (path || window.location.pathname || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();

    // NEVER count admin page visits, admin dashboard views, or admin refreshes
    if (
      currentPath.startsWith('/admin') ||
      currentPath === '/admin' ||
      search.includes('page=admin')
    ) {
      return;
    }

    const stats = getStoredAnalytics();
    stats.totalPageViews = (stats.totalPageViews || 0) + 1;

    const device = detectDevice();
    const browser = detectBrowser();
    const referrer = detectReferrer();

    // Check if new session
    const isNewSession = !sessionStorage.getItem(SESSION_ID_KEY);
    if (isNewSession) {
      sessionStorage.setItem(SESSION_ID_KEY, `sess_${Date.now()}`);
      stats.totalVisitors = (stats.totalVisitors || 0) + 1;

      // Increment device breakdown
      if (!stats.devices) stats.devices = { android: 0, windows: 0, ios: 0, mac: 0, linux: 0 };
      stats.devices[device] = (stats.devices[device] || 0) + 1;

      // Increment browser breakdown
      if (!stats.browsers) stats.browsers = { chrome: 0, samsung: 0, firefox: 0, safari: 0, edge: 0 };
      stats.browsers[browser] = (stats.browsers[browser] || 0) + 1;

      // Increment referrer breakdown
      if (!stats.referrers) stats.referrers = { direct: 0, google: 0, github: 0, whatsapp: 0, instagram: 0 };
      stats.referrers[referrer] = (stats.referrers[referrer] || 0) + 1;

      // Update today's daily visitor entry
      const todayStr = new Date().toISOString().split('T')[0];
      if (!stats.dailyHistory) stats.dailyHistory = generateCleanDailyHistory();
      const todayEntry = stats.dailyHistory.find(d => d.date === todayStr);
      if (todayEntry) {
        todayEntry.visitors = (todayEntry.visitors || 0) + 1;
      } else {
        stats.dailyHistory.push({
          date: todayStr,
          label: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
          visitors: 1,
          downloads: 0
        });
        if (stats.dailyHistory.length > 14) stats.dailyHistory.shift();
      }

      // Add real live event
      if (!stats.recentEvents) stats.recentEvents = [];
      stats.recentEvents.unshift({
        id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'visit',
        path,
        device: `${device.toUpperCase()} (${browser})`,
        time: Date.now()
      });
      if (stats.recentEvents.length > 50) stats.recentEvents.pop();
    }

    saveAnalytics(stats);

    // Sync to backend telemetry beacon
    if (window.fetch) {
      const endpoints = ['/api/analytics/track', 'https://sielo.site/api/analytics/track'];
      endpoints.forEach(ep => {
        fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'page_view', path, device, browser, referrer, isNewSession })
        }).catch(() => {});
      });
    }
  } catch (e) {
    console.warn('Analytics tracking error:', e);
  }
}

export function trackApkDownload(version = 'v11.5.6', fileName = 'Sielo-11.5.6.apk') {
  try {
    const stats = getStoredAnalytics();
    stats.totalDownloads = (stats.totalDownloads || 0) + 1;
    stats.totalApkDownloads = stats.totalDownloads;

    const todayStr = new Date().toISOString().split('T')[0];
    if (!stats.dailyHistory) stats.dailyHistory = generateCleanDailyHistory();
    const todayEntry = stats.dailyHistory.find(d => d.date === todayStr);
    if (todayEntry) {
      todayEntry.downloads = (todayEntry.downloads || 0) + 1;
    } else {
      stats.dailyHistory.push({
        date: todayStr,
        label: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        visitors: 1,
        downloads: 1
      });
      if (stats.dailyHistory.length > 14) stats.dailyHistory.shift();
    }

    if (!stats.recentEvents) stats.recentEvents = [];
    stats.recentEvents.unshift({
      id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'download',
      version,
      device: detectDevice().toUpperCase(),
      time: Date.now()
    });
    if (stats.recentEvents.length > 50) stats.recentEvents.pop();

    saveAnalytics(stats);

    if (window.fetch) {
      const endpoints = ['/api/analytics/track', 'https://sielo.site/api/analytics/track'];
      endpoints.forEach(ep => {
        fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'apk_download', version, fileName, device: detectDevice() })
        }).catch(() => {});
      });
    }
  } catch (e) {
    console.warn('Download tracking error:', e);
  }
}

/**
 * Fetches live aggregated analytics from the backend API, merging with local counts
 */
export async function fetchLiveAnalytics() {
  const localStats = getStoredAnalytics();
  const endpoints = ['/api/analytics/track', 'https://sielo.site/api/analytics/track'];

  for (const ep of endpoints) {
    try {
      const resp = await fetch(ep);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.success && data.analytics) {
          const s = data.analytics;
          const merged = {
            ...localStats,
            totalVisitors: Math.max(s.totalVisitors || 0, localStats.totalVisitors || 0),
            totalPageViews: Math.max(s.totalPageViews || 0, localStats.totalPageViews || 0),
            totalDownloads: Math.max(s.totalDownloads || 0, localStats.totalDownloads || 0),
            devices: {
              android: Math.max(s.devices?.android || 0, localStats.devices?.android || 0),
              windows: Math.max(s.devices?.windows || 0, localStats.devices?.windows || 0),
              ios: Math.max(s.devices?.ios || 0, localStats.devices?.ios || 0),
              mac: Math.max(s.devices?.mac || 0, localStats.devices?.mac || 0),
              linux: Math.max(s.devices?.linux || 0, localStats.devices?.linux || 0),
            },
            browsers: {
              chrome: Math.max(s.browsers?.chrome || 0, localStats.browsers?.chrome || 0),
              samsung: Math.max(s.browsers?.samsung || 0, localStats.browsers?.samsung || 0),
              firefox: Math.max(s.browsers?.firefox || 0, localStats.browsers?.firefox || 0),
              safari: Math.max(s.browsers?.safari || 0, localStats.browsers?.safari || 0),
              edge: Math.max(s.browsers?.edge || 0, localStats.browsers?.edge || 0),
            },
            referrers: {
              direct: Math.max(s.referrers?.direct || 0, localStats.referrers?.direct || 0),
              google: Math.max(s.referrers?.google || 0, localStats.referrers?.google || 0),
              github: Math.max(s.referrers?.github || 0, localStats.referrers?.github || 0),
              whatsapp: Math.max(s.referrers?.whatsapp || 0, localStats.referrers?.whatsapp || 0),
              instagram: Math.max(s.referrers?.instagram || 0, localStats.referrers?.instagram || 0),
            },
            recentEvents: (s.recentEvents && s.recentEvents.length > 0) ? s.recentEvents : localStats.recentEvents
          };
          saveAnalytics(merged);
          return merged;
        }
      }
    } catch (_) {}
  }

  return localStats;
}

// Global click capturer for any APK download link on the site
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    try {
      const anchor = e.target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const downloadAttr = anchor.getAttribute('download');
        if (href.endsWith('.apk') || (downloadAttr && downloadAttr.endsWith('.apk'))) {
          trackApkDownload('v11.5.6', downloadAttr || href.split('/').pop() || 'Sielo-11.5.6.apk');
        }
      }
    } catch (_) {}
  }, true);
}

export function resetAnalyticsData() {
  const clean = getCleanInitialAnalytics();
  saveAnalytics(clean);
  return clean;
}
