# Overview

GlobalTV is a modern IPTV streaming application that allows users to browse, search, and watch live television channels from around the world. The application provides a Netflix-like interface for discovering channels by country, category, and search functionality, with features like favorites management and playlist organization.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming, dark mode support
- **Component Library**: Radix UI primitives with shadcn/ui component system for consistent design
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **API Pattern**: RESTful API design with JSON responses
- **Development Server**: Express with Vite middleware for full-stack development

## Data Storage Solutions
- **Primary Database**: PostgreSQL (configured via Drizzle ORM)
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **In-Memory Storage**: MemStorage class for development/testing with channels, favorites, and playlists
- **Schema**: Strongly typed database schema with Zod validation

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Prepared Structure**: User ID fields in favorites table suggest future user system integration
- **Session Management**: Express session middleware configured for future use

## Core Features Architecture
- **Channel Management**: CRUD operations with filtering by country, category, and search
- **Video Streaming**: HLS.js integration for adaptive streaming with fallback support
- **Favorites System**: User-specific channel bookmarking (ready for user authentication)
- **Playlist Management**: M3U playlist parsing and organization
- **Real-time Updates**: React Query for optimistic updates and cache invalidation

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management

## Streaming Infrastructure
- **HLS.js**: HTTP Live Streaming playback library
- **IPTV Sources**: GitHub repositories (iptv-org/iptv, Free-TV/IPTV) for channel data
- **TVMaze API**: Television show metadata and channel information enrichment

## Development Tools
- **Replit Integration**: Development environment with cartographer plugin
- **Runtime Error Overlay**: Development error handling and debugging

## UI/UX Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Touch-friendly carousel component
- **Class Variance Authority**: Type-safe component variant management

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx/tailwind-merge**: Conditional CSS class handling
- **cmdk**: Command palette and search interface
- **Zod**: Runtime type validation and schema definition