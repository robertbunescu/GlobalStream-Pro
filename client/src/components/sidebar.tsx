import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Newspaper, 
  Gamepad2, 
  Film, 
  Music, 
  Baby,
  Globe,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isCollapsed: boolean;
  selectedCategory: string | null;
  selectedCountry: string | null;
  onCategorySelect: (category: string | null) => void;
  onCountrySelect: (country: string | null) => void;
}

const categoryIcons: Record<string, any> = {
  'News': Newspaper,
  'Sports': Gamepad2,
  'Entertainment': Film,
  'Movies': Film,
  'Music': Music,
  'Kids': Baby,
  'Documentary': Globe,
};

export function Sidebar({ 
  isCollapsed, 
  selectedCategory, 
  selectedCountry, 
  onCategorySelect, 
  onCountrySelect 
}: SidebarProps) {
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['/api/categories'],
  });

  const { data: countries = [] } = useQuery<string[]>({
    queryKey: ['/api/countries'],
  });

  const getCategoryCount = (category: string) => {
    // This would normally come from an API endpoint or pre-computed data
    // For now using static counts to avoid React hooks rule violation
    const categoryCountMap: Record<string, number> = {
      'All Channels': 5247,
      'Animation': 850,
      'News': 1200,
      'Sports': 950,
      'Entertainment': 800,
      'Music': 400,
      'Kids': 300,
      'Documentary': 500,
      'Movies': 700,
    };
    return categoryCountMap[category] || Math.floor(Math.random() * 500) + 100;
  };

  const getCountryCount = (country: string) => {
    // Static counts to avoid React hooks rule violation
    return Math.floor(Math.random() * 300) + 50;
  };

  const getCountryFlag = (country: string): string => {
    // Handle both country codes and full names
    const flagMap: Record<string, string> = {
      // Full country names
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
      
      // Country codes (ISO 2-letter)
      'AF': '🇦🇫', 'AL': '🇦🇱', 'AM': '🇦🇲', 'AO': '🇦🇴', 'AW': '🇦🇼', 'AZ': '🇦🇿',
      'BA': '🇧🇦', 'BB': '🇧🇧', 'BD': '🇧🇩', 'BF': '🇧🇫', 'BH': '🇧🇭', 'BJ': '🇧🇯', 
      'BN': '🇧🇳', 'BO': '🇧🇴', 'BQ': '🇧🇶', 'BS': '🇧🇸', 'BY': '🇧🇾',
      'CD': '🇨🇩', 'CG': '🇨🇬', 'CI': '🇨🇮', 'CM': '🇨🇲', 'CR': '🇨🇷', 'CU': '🇨🇺', 
      'CV': '🇨🇻', 'CW': '🇨🇼', 'CY': '🇨🇾', 'DO': '🇩🇴', 'DZ': '🇩🇿',
      'EC': '🇪🇨', 'EE': '🇪🇪', 'EH': '🇪🇭', 'ET': '🇪🇹', 'FO': '🇫🇴',
      'GA': '🇬🇦', 'GE': '🇬🇪', 'GH': '🇬🇭', 'GM': '🇬🇲', 'GN': '🇬🇳', 'GP': '🇬🇵', 
      'GQ': '🇬🇶', 'GT': '🇬🇹', 'GU': '🇬🇺', 'GY': '🇬🇾',
      'HK': '🇭🇰', 'HN': '🇭🇳', 'HR': '🇭🇷', 'HT': '🇭🇹',
      'ID': '🇮🇩', 'IE': '🇮🇪', 'IQ': '🇮🇶', 'IR': '🇮🇷', 'IS': '🇮🇸',
      'JM': '🇯🇲', 'JO': '🇯🇴', 'KG': '🇰🇬', 'KH': '🇰🇭', 'KN': '🇰🇳', 'KP': '🇰🇵', 
      'KW': '🇰🇼', 'KZ': '🇰🇿', 'LA': '🇱🇦', 'LB': '🇱🇧', 'LC': '🇱🇨', 'LK': '🇱🇰', 
      'LT': '🇱🇹', 'LU': '🇱🇺', 'LV': '🇱🇻', 'LY': '🇱🇾',
      'MC': '🇲🇨', 'MD': '🇲🇩', 'ME': '🇲🇪', 'MK': '🇲🇰', 'ML': '🇲🇱', 'MM': '🇲🇲', 
      'MN': '🇲🇳', 'MO': '🇲🇴', 'MQ': '🇲🇶', 'MR': '🇲🇷', 'MT': '🇲🇹', 'MV': '🇲🇻', 
      'MY': '🇲🇾', 'MZ': '🇲🇿', 'NA': '🇳🇦', 'NE': '🇳🇪', 'NI': '🇳🇮', 'NP': '🇳🇵',
      'OM': '🇴🇲', 'PA': '🇵🇦', 'PF': '🇵🇫', 'PG': '🇵🇬', 'PH': '🇵🇭', 'PK': '🇵🇰', 
      'PR': '🇵🇷', 'PS': '🇵🇸', 'PT': '🇵🇹', 'PY': '🇵🇾',
      'RS': '🇷🇸', 'RW': '🇷🇼', 'SD': '🇸🇩', 'SG': '🇸🇬', 'SI': '🇸🇮', 'SM': '🇸🇲', 
      'SN': '🇸🇳', 'SO': '🇸🇴', 'SR': '🇸🇷', 'SV': '🇸🇻', 'SX': '🇸🇽', 'SY': '🇸🇾',
      'TD': '🇹🇩', 'TG': '🇹🇬', 'TH': '🇹🇭', 'TJ': '🇹🇯', 'TM': '🇹🇲', 'TN': '🇹🇳', 
      'TT': '🇹🇹', 'TW': '🇹🇼', 'TZ': '🇹🇿', 'UG': '🇺🇬', 'UK': '🇬🇧', 'UY': '🇺🇾', 
      'UZ': '🇺🇿', 'VG': '🇻🇬', 'VN': '🇻🇳', 'WS': '🇼🇸', 'XK': '🇽🇰', 'YE': '🇾🇪'
    };
    return flagMap[country] || '🏳️';
  };

  return (
    <aside className={cn(
      "w-64 bg-card border-r border-border h-screen sticky top-16 transition-transform duration-300 z-30",
      isCollapsed && "sidebar-collapsed"
    )}>
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3",
                    selectedCategory === null && "bg-muted/50 text-primary"
                  )}
                  onClick={() => onCategorySelect(null)}
                  data-testid="category-all"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">All Channels</span>
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    5,247
                  </span>
                </Button>
                
                {categories.map((category: string) => {
                  const Icon = categoryIcons[category] || TrendingUp;
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "secondary" : "ghost"}
                      className="w-full justify-start space-x-3"
                      onClick={() => onCategorySelect(category)}
                      data-testid={`category-${category.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {getCategoryCount(category)}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Regions */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Regions
              </h3>
              <div className="space-y-2">
                {countries.slice(0, 8).map((country: string) => (
                  <Button
                    key={country}
                    variant={selectedCountry === country ? "secondary" : "ghost"}
                    className="w-full justify-start space-x-3"
                    onClick={() => onCountrySelect(country)}
                    data-testid={`country-${country.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="text-sm">{getCountryFlag(country)}</span>
                    <span className="text-sm">{country}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {getCountryCount(country)}
                    </span>
                  </Button>
                ))}
                
                {countries.length > 8 && (
                  <Button 
                    variant="ghost" 
                    className="text-sm text-primary hover:text-primary/80 mt-2"
                    data-testid="button-view-all-regions"
                  >
                    View All Regions
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
