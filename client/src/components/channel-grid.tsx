import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Channel } from "@shared/schema";

interface ChannelGridProps {
  searchQuery: string;
  selectedCategory: string | null;
  selectedCountry: string | null;
  onChannelSelect: (channel: Channel) => void;
}

const getChannelLogo = (channel: Channel): string => {
  // Generate branded backgrounds based on channel name
  const name = channel.name.toLowerCase();
  
  if (name.includes('cnn')) return 'from-red-600 to-red-800';
  if (name.includes('bbc')) return 'from-purple-700 to-purple-900';
  if (name.includes('espn')) return 'from-red-700 to-red-900';
  if (name.includes('fox')) return 'from-blue-600 to-blue-800';
  if (name.includes('nbc')) return 'from-blue-500 to-purple-600';
  if (name.includes('abc')) return 'from-yellow-600 to-red-700';
  if (name.includes('mtv')) return 'from-pink-600 to-purple-700';
  if (name.includes('discovery')) return 'from-blue-600 to-indigo-700';
  if (name.includes('disney')) return 'from-blue-500 to-purple-600';
  if (name.includes('national') || name.includes('nat geo')) return 'from-yellow-600 to-yellow-800';
  if (name.includes('history')) return 'from-yellow-700 to-orange-800';
  if (name.includes('animal')) return 'from-green-600 to-green-800';
  if (name.includes('cartoon')) return 'from-orange-500 to-red-600';
  if (name.includes('comedy')) return 'from-purple-600 to-pink-700';
  if (name.includes('food')) return 'from-orange-600 to-red-700';
  if (name.includes('travel')) return 'from-blue-600 to-teal-700';
  if (name.includes('science')) return 'from-indigo-600 to-purple-700';
  
  // Default gradient based on first letter
  const firstChar = name.charAt(0);
  const gradients = [
    'from-blue-600 to-purple-700',
    'from-green-600 to-blue-700',
    'from-purple-600 to-pink-700',
    'from-red-600 to-orange-700',
    'from-yellow-600 to-red-700',
    'from-indigo-600 to-purple-700',
    'from-teal-600 to-blue-700',
    'from-orange-600 to-red-700',
  ];
  
  return gradients[firstChar.charCodeAt(0) % gradients.length];
};

const getChannelDisplayName = (channel: Channel): string => {
  // Clean up channel names for display
  return channel.name
    .replace(/\s*\[.*?\]/g, '') // Remove brackets
    .replace(/\s*\(.*?\)/g, '') // Remove parentheses
    .trim();
};

const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'News': 'bg-red-500/20 text-red-400',
    'Sports': 'bg-orange-500/20 text-orange-400',
    'Entertainment': 'bg-purple-500/20 text-purple-400',
    'Movies': 'bg-blue-500/20 text-blue-400',
    'Music': 'bg-pink-500/20 text-pink-400',
    'Kids': 'bg-indigo-500/20 text-indigo-400',
    'Documentary': 'bg-green-500/20 text-green-400',
    'Science': 'bg-cyan-500/20 text-cyan-400',
    'History': 'bg-amber-500/20 text-amber-400',
    'Lifestyle': 'bg-violet-500/20 text-violet-400',
  };
  
  return colorMap[category] || 'bg-gray-500/20 text-gray-400';
};

const getCountryFlag = (country: string): string => {
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
  return flagMap[country] || '🏳️';
};

export function ChannelGrid({ 
  searchQuery, 
  selectedCategory, 
  selectedCountry, 
  onChannelSelect 
}: ChannelGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const { data: channels = [], isLoading, error } = useQuery<Channel[]>({
    queryKey: ['/api/channels', { 
      search: searchQuery || undefined,
      group: selectedCategory || undefined,
      country: selectedCountry || undefined,
      limit: pageSize,
      offset: currentPage * pageSize
    }],
    enabled: true,
  });

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-2">Failed to load channels</div>
        <p className="text-muted-foreground text-sm">Please check your connection and try again</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="channel-card bg-card rounded-xl border border-border overflow-hidden shadow-sm cursor-pointer"
            onClick={() => onChannelSelect(channel)}
            data-testid={`card-channel-${channel.id}`}
          >
            <div className="relative aspect-video bg-muted">
              {/* Channel Logo/Brand Background */}
              <div className={`w-full h-full bg-gradient-to-br ${getChannelLogo(channel)} flex items-center justify-center`}>
                {channel.logo ? (
                  <img 
                    src={channel.logo} 
                    alt={channel.name}
                    className="max-w-[80%] max-h-[80%] object-contain"
                    onError={(e) => {
                      // Fallback to text if image fails
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-white font-bold text-lg text-center px-2">
                    {getChannelDisplayName(channel).substring(0, 10).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Live indicator */}
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-white/90 bg-black/50 px-2 py-1 rounded">LIVE</span>
              </div>
              
              {/* Country flag */}
              <div className="absolute top-2 right-2">
                <span className="text-lg" data-testid={`flag-${channel.id}`}>
                  {getCountryFlag(channel.country || '')}
                </span>
              </div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-primary/90 hover:bg-primary"
                  data-testid={`button-play-${channel.id}`}
                >
                  <Play className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Favorite button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 rounded-full text-white hover:bg-primary hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement favorites functionality
                }}
                data-testid={`button-favorite-${channel.id}`}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 truncate" data-testid={`text-channel-name-${channel.id}`}>
                {getChannelDisplayName(channel)}
              </h3>
              <p className="text-xs text-muted-foreground mb-2 truncate" data-testid={`text-channel-country-${channel.id}`}>
                {channel.country || 'Unknown Country'}
              </p>
              <div className="flex items-center justify-between">
                {channel.group && (
                  <Badge 
                    className={`text-xs ${getCategoryColor(channel.group)}`}
                    data-testid={`badge-category-${channel.id}`}
                  >
                    {channel.group}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground" data-testid={`text-viewers-${channel.id}`}>
                  {Math.floor(Math.random() * 2000) + 100}K viewers
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Loading skeleton cards */}
        {isLoading && Array.from({ length: 8 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {channels && channels.length > 0 && channels.length === pageSize && (
        <div className="text-center mt-12">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            data-testid="button-load-more"
          >
            {isLoading ? 'Loading...' : 'Load More Channels'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {channels?.length || 0} channels
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!channels || channels.length === 0) && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">No channels found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
