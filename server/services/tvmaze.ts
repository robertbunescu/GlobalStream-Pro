interface TVMazeShow {
  id: number;
  name: string;
  summary?: string;
  image?: {
    medium: string;
    original: string;
  };
  genres: string[];
  network?: {
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
}

export class TVMazeService {
  private static readonly BASE_URL = 'https://api.tvmaze.com';

  static async searchShows(query: string): Promise<TVMazeShow[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      
      const results = await response.json();
      return results.map((result: any) => result.show).slice(0, 5);
    } catch (error) {
      console.error('TVMaze search error:', error);
      return [];
    }
  }

  static async getShowById(id: number): Promise<TVMazeShow | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/shows/${id}`);
      if (!response.ok) return null;
      
      return await response.json();
    } catch (error) {
      console.error('TVMaze show fetch error:', error);
      return null;
    }
  }

  static async getChannelMetadata(channelName: string): Promise<{
    description?: string;
    logo?: string;
    genres?: string[];
  } | null> {
    const shows = await this.searchShows(channelName);
    if (shows.length === 0) return null;

    const show = shows[0];
    return {
      description: this.stripHtml(show.summary || ''),
      logo: show.image?.medium,
      genres: show.genres,
    };
  }

  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
