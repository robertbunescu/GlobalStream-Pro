import { useState } from "react";
import { Link } from "wouter";
import { Search, Heart, Settings, Tv, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearch: (query: string) => void;
  onMenuToggle: () => void;
}

export function Header({ onSearch, onMenuToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Tv className="text-primary text-2xl" />
              <h1 className="text-2xl font-bold text-foreground">GlobalTV</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="nav-home">
                Home
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-live">
                Live TV
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-categories">
                Categories
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-favorites">
                Favorites
              </Link>
            </nav>
          </div>
          
          {/* Search and Controls */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuToggle}
              data-testid="button-menu-toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-80 pl-10 pr-4 bg-input border-border focus:ring-primary"
                data-testid="input-search"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                console.log('Opening favorites page...');
                // TODO: Navigate to favorites page or show favorites sidebar
              }}
              data-testid="button-favorites"
            >
              <Heart className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                console.log('Opening settings...');
                // TODO: Open settings dialog or navigate to settings page
              }}
              data-testid="button-settings"
            >
              <Settings className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
