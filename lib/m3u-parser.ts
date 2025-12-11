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
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('#EXTINF:')) {
                // Parse metadata
                const info = trimmedLine.substring(8);
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

                currentChannel = {
                    id: tvgId || rawName,
                    name: rawName,
                    logo: tvgLogo,
                    category: groupTitle || 'Uncategorized',
                    country: groupTitle || 'Uncategorized',
                };
            } else if (trimmedLine.startsWith('http')) {
                if (currentChannel.name) {
                    channels.push({
                        ...currentChannel,
                        url: trimmedLine,
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
