export interface Channel {
    id: string;
    name: string;
    logo: string;
    url: string;
    category: string;
    country: string;
}

export interface CountryGroup {
    name: string;
    code: string;
    channels: Channel[];
}

export async function fetchAndParseM3U(url: string): Promise<CountryGroup[]> {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const lines = text.split('\n');

        const channels: Channel[] = [];
        let currentChannel: Partial<Channel> = {};

        for (const line of lines) {
            if (line.startsWith('#EXTINF:')) {
                // Parse metadata
                const info = line.substring(8);
                const parts = info.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/); // Split by comma, ignoring commas in quotes

                // Extract attributes
                const getAttr = (name: string) => {
                    const match = info.match(new RegExp(`${name}="([^"]*)"`));
                    return match ? match[1] : '';
                };

                const tvgId = getAttr('tvg-id');
                const tvgName = getAttr('tvg-name');
                const tvgLogo = getAttr('tvg-logo');
                const groupTitle = getAttr('group-title');
                // raw name is usually the last part after the comma
                const rawName = parts[parts.length - 1]?.trim() || '';

                // Try to guess country from group-title or other hints if simplest appraoch is insufficient,
                // but for iptv-org, group-title usually contains useful categorization.
                // However, iptv-org/iptv main list is massive and categorized. 
                // The user link is https://iptv-org.github.io/iptv/index.m3u which is the "grouped by country" list usually? 
                // Actually index.m3u is the main one. Let's see. 
                // Often group-title="CountryName" or "Category". 

                currentChannel = {
                    id: tvgId || rawName,
                    name: rawName,
                    logo: tvgLogo,
                    category: groupTitle || 'Uncategorized',
                    country: groupTitle || 'Uncategorized', // Using group-title as country proxy for now as it's common
                };
            } else if (line.startsWith('http')) {
                if (currentChannel.name) {
                    channels.push({
                        ...currentChannel,
                        url: line.trim(),
                    } as Channel);
                    currentChannel = {};
                }
            }
        }

        // Group by country
        const grouped: Record<string, Channel[]> = {};
        channels.forEach(ch => {
            const country = ch.country || 'Other';
            if (!grouped[country]) {
                grouped[country] = [];
            }
            grouped[country].push(ch);
        });

        return Object.entries(grouped).map(([name, chans]) => ({
            name,
            code: name, // We don't have code easily, using name
            channels: chans.sort((a, b) => a.name.localeCompare(b.name))
        })).sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error('Error fetching playlist:', error);
        return [];
    }
}
