export interface M3UChannel {
  name: string;
  url: string;
  logo?: string;
  group?: string;
  country?: string;
  language?: string;
  tvg_id?: string;
  tvg_name?: string;
}

export class IPTVService {
  private static readonly GITHUB_IPTV_BASE = 'https://iptv-org.github.io/iptv';
  private static readonly FREE_TV_BASE = 'https://raw.githubusercontent.com/Free-TV/IPTV/master';

  static async fetchMainPlaylist(): Promise<string> {
    try {
      const response = await fetch(`${this.GITHUB_IPTV_BASE}/index.m3u`);
      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching main playlist:', error);
      throw error;
    }
  }

  static async fetchCountryPlaylist(countryCode: string): Promise<string> {
    try {
      const response = await fetch(`${this.GITHUB_IPTV_BASE}/streams/${countryCode.toLowerCase()}.m3u`);
      if (!response.ok) {
        throw new Error(`Failed to fetch country playlist: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching playlist for ${countryCode}:`, error);
      throw error;
    }
  }

  static parseM3U(content: string): M3UChannel[] {
    const channels: M3UChannel[] = [];
    const lines = content.split('\n').filter(line => line.trim());

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        const nextLine = lines[i + 1]?.trim();
        if (!nextLine || nextLine.startsWith('#')) continue;

        const channel = this.parseExtInfLine(line);
        if (channel) {
          const fullChannel: M3UChannel = { ...channel, url: nextLine };
          channels.push(fullChannel);
        }
        i++; // Skip the URL line
      }
    }

    return channels;
  }

  private static parseExtInfLine(line: string): Omit<M3UChannel, 'url'> | null {
    // Example: #EXTINF:-1 tvg-id="CNN.us" tvg-name="CNN" tvg-logo="https://..." group-title="News",CNN International
    
    const match = line.match(/#EXTINF:.*?,(.*?)$/);
    if (!match) return null;

    const name = match[1].trim();
    const channel: Omit<M3UChannel, 'url'> = { name };

    // Extract attributes
    const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
    if (tvgIdMatch) channel.tvg_id = tvgIdMatch[1];

    const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
    if (tvgNameMatch) channel.tvg_name = tvgNameMatch[1];

    const logoMatch = line.match(/tvg-logo="([^"]*)"/);
    if (logoMatch) channel.logo = logoMatch[1];

    const groupMatch = line.match(/group-title="([^"]*)"/);
    if (groupMatch) channel.group = groupMatch[1];

    // Try to extract country from tvg-id or make educated guess
    if (channel.tvg_id) {
      const countryMatch = channel.tvg_id.match(/\.([a-z]{2})$/i);
      if (countryMatch) {
        channel.country = this.getCountryName(countryMatch[1].toUpperCase());
      }
    }

    return channel;
  }

  private static getCountryName(code: string): string {
    const countryNames: Record<string, string> = {
      'US': 'United States',
      'GB': 'United Kingdom', 
      'CA': 'Canada',
      'DE': 'Germany',
      'FR': 'France',
      'IT': 'Italy',
      'ES': 'Spain',
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'SK': 'Slovakia',
      'HU': 'Hungary',
      'RO': 'Romania',
      'BG': 'Bulgaria',
      'GR': 'Greece',
      'TR': 'Turkey',
      'RU': 'Russia',
      'UA': 'Ukraine',
      'IN': 'India',
      'CN': 'China',
      'JP': 'Japan',
      'KR': 'South Korea',
      'AU': 'Australia',
      'NZ': 'New Zealand',
      'BR': 'Brazil',
      'MX': 'Mexico',
      'AR': 'Argentina',
      'CL': 'Chile',
      'CO': 'Colombia',
      'PE': 'Peru',
      'VE': 'Venezuela',
      'ZA': 'South Africa',
      'EG': 'Egypt',
      'MA': 'Morocco',
      'NG': 'Nigeria',
      'KE': 'Kenya',
      'IL': 'Israel',
      'AE': 'United Arab Emirates',
      'SA': 'Saudi Arabia',
      'QA': 'Qatar',
    };
    return countryNames[code] || code;
  }

  static getCountryFlag(countryName: string): string {
    const flagMap: Record<string, string> = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Poland': '🇵🇱',
      'Czech Republic': '🇨🇿',
      'Slovakia': '🇸🇰',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Bulgaria': '🇧🇬',
      'Greece': '🇬🇷',
      'Turkey': '🇹🇷',
      'Russia': '🇷🇺',
      'Ukraine': '🇺🇦',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Peru': '🇵🇪',
      'Venezuela': '🇻🇪',
      'South Africa': '🇿🇦',
      'Egypt': '🇪🇬',
      'Morocco': '🇲🇦',
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'Israel': '🇮🇱',
      'United Arab Emirates': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Qatar': '🇶🇦',
    };
    return flagMap[countryName] || '🏳️';
  }
}
