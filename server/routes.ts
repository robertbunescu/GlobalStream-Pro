import type { Express } from "express";
import { createServer, type Server } from "http";
import { Readable } from "stream";
import { storage } from "./storage";
import { IPTVService } from "./services/iptv";
import { TVMazeService } from "./services/tvmaze";
import { insertChannelSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all channels with optional filtering
  app.get("/api/channels", async (req, res) => {
    try {
      const { country, group, search, limit = "50", offset = "0" } = req.query;
      
      const channels = await storage.getChannels({
        country: country as string,
        group: group as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });

      res.json(channels);
    } catch (error) {
      console.error('Error fetching channels:', error);
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  // Get single channel
  app.get("/api/channels/:id", async (req, res) => {
    try {
      const channel = await storage.getChannel(req.params.id);
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch channel" });
    }
  });

  // Get countries list
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  // Get categories list
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Load channels from IPTV playlists
  app.post("/api/channels/load-iptv", async (req, res) => {
    try {
      console.log('Loading IPTV channels from GitHub...');
      const playlistContent = await IPTVService.fetchMainPlaylist();
      const channels = IPTVService.parseM3U(playlistContent);
      
      console.log(`Parsed ${channels.length} channels from playlist`);
      
      // Store channels in memory
      let addedCount = 0;
      for (const channelData of channels) {
        try {
          const validatedChannel = insertChannelSchema.parse(channelData);
          await storage.createChannel(validatedChannel);
          addedCount++;
        } catch (error) {
          // Skip invalid channels
          console.warn('Skipping invalid channel:', channelData.name);
        }
      }

      console.log(`Successfully added ${addedCount} channels`);
      res.json({ 
        success: true, 
        message: `Loaded ${addedCount} channels from IPTV playlist`,
        totalParsed: channels.length,
        totalAdded: addedCount
      });
    } catch (error) {
      console.error('Error loading IPTV channels:', error);
      res.status(500).json({ error: "Failed to load IPTV channels" });
    }
  });

  // Handle preflight requests for streaming proxy
  app.options("/api/proxy/stream", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.status(200).end();
  });

  // Proxy endpoint for streaming (to handle CORS and compatibility)
  app.get("/api/proxy/stream", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "Stream URL is required" });
      }

      console.log('Proxying stream:', url);

      // Set appropriate headers for streaming and CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      
      // Determine content type from URL
      if (url.includes('.m3u8')) {
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      } else if (url.includes('.ts')) {
        res.setHeader('Content-Type', 'video/mp2t');
      } else if (url.includes('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      } else {
        res.setHeader('Content-Type', 'video/mp4');
      }
      
      // Add headers for better streaming
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Accept-Encoding': 'identity',
          'Range': req.headers.range || 'bytes=0-'
        }
      });
      
      if (!response.ok) {
        console.error('Stream fetch failed:', response.status, response.statusText);
        return res.status(response.status).json({ error: `Stream not available: ${response.status}` });
      }

      // Copy headers from source
      if (response.headers.get('content-length')) {
        res.setHeader('Content-Length', response.headers.get('content-length')!);
      }
      if (response.headers.get('content-range')) {
        res.setHeader('Content-Range', response.headers.get('content-range')!);
      }

      // Handle streaming data
      if (response.body) {
        const reader = response.body.getReader();
        
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              if (!res.write(value)) {
                // Wait for drain event if write buffer is full
                await new Promise(resolve => res.once('drain', resolve));
              }
            }
            res.end();
          } catch (error) {
            console.error('Stream pumping error:', error);
            res.end();
          }
        };

        pump();
      } else {
        res.status(500).json({ error: "No stream body available" });
      }
      
    } catch (error) {
      console.error('Stream proxy error:', error);
      res.status(500).json({ error: "Stream proxy failed" });
    }
  });

  // Get favorites for a user
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const favorites = await storage.getFavorites(req.params.userId);
      const channelIds = favorites.map(f => f.channelId);
      const channels = await storage.getChannelsByIds(channelIds);
      res.json(channels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // Add to favorites
  app.post("/api/favorites", async (req, res) => {
    try {
      const { channelId, userId } = req.body;
      if (!channelId || !userId) {
        return res.status(400).json({ error: "channelId and userId are required" });
      }

      const favorite = await storage.addFavorite({ channelId, userId });
      res.json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  // Remove from favorites
  app.delete("/api/favorites/:channelId/:userId", async (req, res) => {
    try {
      const { channelId, userId } = req.params;
      const success = await storage.removeFavorite(channelId, userId);
      if (!success) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // Get channel metadata from TVMaze
  app.get("/api/metadata/:channelName", async (req, res) => {
    try {
      const metadata = await TVMazeService.getChannelMetadata(req.params.channelName);
      res.json(metadata || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metadata" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
