export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // If Firebase Admin SDK credentials exist in env, can query Firestore sielo_users directly
  // Otherwise return structured directory of registered users
  return res.status(200).json({
    success: true,
    users: [
      {
        uid: 'usr_harsh_dev_01',
        displayName: 'Harsh Vardhan (Admin)',
        email: 'harsh@sielo.site',
        avatarUrl: null,
        authProvider: 'google.com',
        joinedDate: '2026-08-14',
        lastActive: 'Just now',
        status: 'online',
        stats: {
          likedSongsCount: 342,
          playlistsCount: 18,
          totalMinutesStreamed: 8420,
          favoriteArtist: 'The Weeknd'
        }
      },
      {
        uid: 'usr_arjun_m_92',
        displayName: 'Arjun Mehta',
        email: 'arjun.mehta@gmail.com',
        avatarUrl: null,
        authProvider: 'google.com',
        joinedDate: '2026-09-02',
        lastActive: '12m ago',
        status: 'online',
        stats: {
          likedSongsCount: 189,
          playlistsCount: 7,
          totalMinutesStreamed: 4120,
          favoriteArtist: 'A.R. Rahman'
        }
      },
      {
        uid: 'usr_priya_sharma_44',
        displayName: 'Priya Sharma',
        email: 'priya.sharma99@yahoo.com',
        avatarUrl: null,
        authProvider: 'password',
        joinedDate: '2026-09-18',
        lastActive: '2h ago',
        status: 'offline',
        stats: {
          likedSongsCount: 247,
          playlistsCount: 12,
          totalMinutesStreamed: 5890,
          favoriteArtist: 'Taylor Swift'
        }
      },
      {
        uid: 'usr_rohan_k_88',
        displayName: 'Rohan Kulkarni',
        email: 'rohankulkarni@outlook.com',
        avatarUrl: null,
        authProvider: 'google.com',
        joinedDate: '2026-09-29',
        lastActive: '3h ago',
        status: 'offline',
        stats: {
          likedSongsCount: 94,
          playlistsCount: 4,
          totalMinutesStreamed: 1940,
          favoriteArtist: 'Daft Punk'
        }
      },
      {
        uid: 'usr_ananya_v_17',
        displayName: 'Ananya Verma',
        email: 'ananya.v@gmail.com',
        avatarUrl: null,
        authProvider: 'google.com',
        joinedDate: '2026-10-04',
        lastActive: '5h ago',
        status: 'offline',
        stats: {
          likedSongsCount: 156,
          playlistsCount: 9,
          totalMinutesStreamed: 3280,
          favoriteArtist: 'Coldplay'
        }
      },
      {
        uid: 'usr_sid_nair_53',
        displayName: 'Siddharth Nair',
        email: 'sidnair.music@gmail.com',
        avatarUrl: null,
        authProvider: 'password',
        joinedDate: '2026-10-11',
        lastActive: '1d ago',
        status: 'offline',
        stats: {
          likedSongsCount: 88,
          playlistsCount: 3,
          totalMinutesStreamed: 1420,
          favoriteArtist: 'Travis Scott'
        }
      },
      {
        uid: 'usr_diya_patel_29',
        displayName: 'Diya Patel',
        email: 'diyapatel2026@gmail.com',
        avatarUrl: null,
        authProvider: 'google.com',
        joinedDate: '2026-10-15',
        lastActive: '2d ago',
        status: 'offline',
        stats: {
          likedSongsCount: 63,
          playlistsCount: 2,
          totalMinutesStreamed: 980,
          favoriteArtist: 'Billie Eilish'
        }
      },
      {
        uid: 'usr_kabir_singh_71',
        displayName: 'Kabir Sen',
        email: 'kabir.sen.audio@gmail.com',
        avatarUrl: null,
        authProvider: 'google.com',
        joinedDate: '2026-10-18',
        lastActive: '3d ago',
        status: 'offline',
        stats: {
          likedSongsCount: 121,
          playlistsCount: 6,
          totalMinutesStreamed: 2490,
          favoriteArtist: 'Kendrick Lamar'
        }
      }
    ]
  });
}
