import { type Channel, type InsertChannel, type Favorite, type InsertFavorite, type Playlist, type InsertPlaylist } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Channel operations
  getChannels(filters?: {
    country?: string;
    group?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Channel[]>;
  getChannel(id: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(id: string, updates: Partial<Channel>): Promise<Channel | undefined>;
  deleteChannel(id: string): Promise<boolean>;
  
  // Favorites operations
  getFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(channelId: string, userId: string): Promise<boolean>;
  
  // Playlist operations
  getPlaylists(): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | undefined>;
  
  // Utility operations
  getChannelsByIds(ids: string[]): Promise<Channel[]>;
  getCountries(): Promise<string[]>;
  getCategories(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private channels: Map<string, Channel>;
  private favorites: Map<string, Favorite>;
  private playlists: Map<string, Playlist>;

  constructor() {
    this.channels = new Map();
    this.favorites = new Map();
    this.playlists = new Map();
  }

  async getChannels(filters?: {
    country?: string;
    group?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Channel[]> {
    let channels = Array.from(this.channels.values());
    
    if (filters?.country) {
      channels = channels.filter(c => c.country?.toLowerCase() === filters.country!.toLowerCase());
    }
    
    if (filters?.group) {
      channels = channels.filter(c => c.group?.toLowerCase() === filters.group!.toLowerCase());
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      channels = channels.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.country?.toLowerCase().includes(search) ||
        c.group?.toLowerCase().includes(search)
      );
    }
    
    // Sort by name
    channels.sort((a, b) => a.name.localeCompare(b.name));
    
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    
    return channels.slice(offset, offset + limit);
  }

  async getChannel(id: string): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const id = this.generateChannelId(insertChannel.name);
    const channel: Channel = {
      ...insertChannel,
      id,
      group: insertChannel.group || null,
      country: insertChannel.country || null,
      logo: insertChannel.logo || null,
      language: insertChannel.language || null,
      tvg_id: insertChannel.tvg_id || null,
      tvg_name: insertChannel.tvg_name || null,
      isWorking: insertChannel.isWorking ?? true,
      viewerCount: insertChannel.viewerCount ?? 0
    };
    this.channels.set(id, channel);
    return channel;
  }

  async updateChannel(id: string, updates: Partial<Channel>): Promise<Channel | undefined> {
    const channel = this.channels.get(id);
    if (!channel) return undefined;
    
    const updated = { ...channel, ...updates };
    this.channels.set(id, updated);
    return updated;
  }

  async deleteChannel(id: string): Promise<boolean> {
    return this.channels.delete(id);
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(f => f.userId === userId);
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(channelId: string, userId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      f => f.channelId === channelId && f.userId === userId
    );
    if (!favorite) return false;
    return this.favorites.delete(favorite.id);
  }

  async getPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values());
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    const playlist: Playlist = {
      ...insertPlaylist,
      id,
      lastUpdated: insertPlaylist.lastUpdated || null,
      channelCount: insertPlaylist.channelCount ?? 0,
      isActive: insertPlaylist.isActive ?? true
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;
    
    const updated = { ...playlist, ...updates };
    this.playlists.set(id, updated);
    return updated;
  }

  async getChannelsByIds(ids: string[]): Promise<Channel[]> {
    return ids.map(id => this.channels.get(id)).filter(Boolean) as Channel[];
  }

  async getCountries(): Promise<string[]> {
    const countries = new Set<string>();
    const channelArray = Array.from(this.channels.values());
    for (const channel of channelArray) {
      if (channel.country) {
        countries.add(channel.country);
      }
    }
    return Array.from(countries).sort();
  }

  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    const channelArray = Array.from(this.channels.values());
    for (const channel of channelArray) {
      if (channel.group) {
        // Clean up category names - split on semicolons and take individual categories
        const cleanCategories = channel.group.split(';').map(cat => cat.trim()).filter(cat => cat);
        cleanCategories.forEach(cat => categories.add(cat));
      }
    }
    return Array.from(categories).sort();
  }

  private generateChannelId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
}

export const storage = new MemStorage();
