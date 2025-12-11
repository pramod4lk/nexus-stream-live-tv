import { fetchAndParseM3U } from '@/lib/m3u-parser';
import AppLayout from './components/AppLayout';

export const dynamic = 'force-dynamic'; // Ensure we don't cache stale playlists too aggressively if not ISG

export default async function Home() {
  const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.country.m3u';
  const data = await fetchAndParseM3U(PLAYLIST_URL);

  return (
    <div className="min-h-screen bg-black">
      <AppLayout initialData={data} />
    </div>
  );
}
