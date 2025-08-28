import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ChannelGrid } from "@/components/channel-grid";
import { VideoPlayer } from "@/components/video-player";
import { Grid3X3, List, TrendingUp } from "lucide-react";
import type { Channel } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load IPTV channels on first visit
  const loadChannelsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/channels/load-iptv', {}),
    onSuccess: (response) => {
      const data = response.json();
      toast({
        title: "Channels Loaded",
        description: `Successfully loaded channels from IPTV playlist`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/channels'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/countries'] });
    },
    onError: (error) => {
      console.error('Error loading channels:', error);
      toast({
        title: "Loading Failed",
        description: "Failed to load channels. Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Check if we need to load channels initially
  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ['/api/channels', { limit: 1 }],
  });

  useEffect(() => {
    // If no channels exist, automatically load them from IPTV
    if ((!channels || channels.length === 0) && !loadChannelsMutation.isPending) {
      loadChannelsMutation.mutate();
    }
  }, [channels.length]);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    // Scroll to top to show video player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePlayer = () => {
    setSelectedChannel(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Close video player when searching
    if (selectedChannel) {
      setSelectedChannel(null);
    }
  };

  const handleMenuToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="page-home">
      <Header onSearch={handleSearch} onMenuToggle={handleMenuToggle} />
      
      <div className="flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          selectedCategory={selectedCategory}
          selectedCountry={selectedCountry}
          onCategorySelect={(category) => {
            setSelectedCategory(category);
            // Close video player when changing category
            if (selectedChannel) {
              setSelectedChannel(null);
            }
          }}
          onCountrySelect={(country) => {
            setSelectedCountry(country);
            // Close video player when changing country  
            if (selectedChannel) {
              setSelectedChannel(null);
            }
          }}
        />

        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-6">
            {/* Video Player */}
            {selectedChannel && (
              <VideoPlayer
                channel={selectedChannel}
                onClose={handleClosePlayer}
              />
            )}

            {/* Channel Filters */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2" data-testid="text-page-title">
                  Live TV Channels
                </h2>
                <p className="text-muted-foreground" data-testid="text-page-description">
                  Watch live TV channels from around the world
                </p>
                {loadChannelsMutation.isPending && (
                  <p className="text-sm text-primary mt-1">Loading channels from IPTV playlist...</p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Category Filter */}
                <Select value={selectedCategory || "all"} onValueChange={(value) => {
                  const newCategory = value === "all" ? null : value;
                  setSelectedCategory(newCategory);
                  // Close video player when changing category
                  if (selectedChannel) {
                    setSelectedChannel(null);
                  }
                }}>
                  <SelectTrigger className="w-48" data-testid="select-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                    <SelectItem value="Documentary">Documentary</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Sort Options */}
                <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                  <Button
                    variant={sortBy === 'popular' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('popular')}
                    data-testid="sort-popular"
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Popular
                  </Button>
                  <Button
                    variant={sortBy === 'az' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('az')}
                    data-testid="sort-alphabetical"
                  >
                    A-Z
                  </Button>
                  <Button
                    variant={sortBy === 'country' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('country')}
                    data-testid="sort-country"
                  >
                    Country
                  </Button>
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    data-testid="view-grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    data-testid="view-list"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Channel Grid */}
            <ChannelGrid
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedCountry={selectedCountry}
              onChannelSelect={handleChannelSelect}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
