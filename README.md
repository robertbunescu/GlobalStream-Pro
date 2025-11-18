
# 📺 GlobalTV - Worldwide Streaming TV

![GitHub Banner](./attached_assets/generated_images/GitHub_repository_banner_c46794c1.png)

![GlobalTV Hero](./attached_assets/generated_images/GlobalTV_hero_banner_mockup_71b62d77.png)

A modern TV streaming app that lets you watch live channels from all over the world, with a Netflix-like interface and advanced features.

## ✨ Features

- 🌍 **10,000+ TV channels** worldwide
- 🔍 **Search & filter** by country, category, and name
- 📱 **Responsive design** - works perfectly on mobile and desktop
- 🎬 **Advanced video player** with HLS.js adaptive streaming
- ❤️ **Favorites system** for your preferred channels
- 🏴 **Country flags** and category organization
- 🌙 **Modern dark theme** with purple and blue accents

## 🖼️ Previews

### Main Desktop Interface
![Desktop Interface](./attached_assets/generated_images/Real_GlobalTV_application_interface_6a58eedb.png)

### Responsive Mobile Interface
![Mobile Interface](./attached_assets/generated_images/Mobile_GlobalTV_interface_screenshot_7c64e522.png)

### Integrated Video Player
![Video Player](./attached_assets/generated_images/GlobalTV_video_player_interface_3bed55a0.png)

## 🚀 Technologies Used

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** for components
- **TanStack Query** for state management
- **HLS.js** for video streaming
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript**
- **Drizzle ORM** with PostgreSQL
- **Zod** for validation

### Streaming
- **IPTV-ORG** - Free channel sources
- **TVMaze API** - Channel metadata
- **HLS.js** - Adaptive streaming

## 📋 Installation & Usage

### Prerequisites
- Node.js 20+
- npm or pnpm

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/globaltv.git
cd globaltv
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the app**
```bash
npm run dev
```

4. **Open in browser**
Go to `http://localhost:5000` in your browser.

## 🎯 How to Use

1. **Browse channels** - Navigate the grid or use the sidebar
2. **Filter by country** - Select your country from the sidebar
3. **Search channels** - Use the search bar in the header
4. **Watch live** - Click any channel to start streaming
5. **Add to favorites** - Click the heart button to save favorite channels

## 🛠️ Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # App pages
│   │   ├── lib/         # Utilities and config
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── services/        # IPTV & TVMaze services
│   └── routes.ts        # API endpoints
├── shared/              # Shared types
└── attached_assets/     # Images and assets
```

## 🔧 API Endpoints

- `GET /api/channels` - List all channels with filtering
- `GET /api/countries` - List available countries
- `GET /api/categories` - List categories
- `POST /api/channels/load-iptv` - Load channels from IPTV
- `GET /api/proxy/stream` - Proxy for CORS streaming

## 🎨 Design & UX

The app uses a modern dark color palette:
- **Background**: Very dark gray for eye comfort
- **Primary**: Vibrant purple (#a855f7) for accents
- **Secondary**: Blue for secondary elements
- **Cards**: Lighter gray tones for contrast

## ⚖️ Legal

This app only uses:
- ✅ Public and free TV channels
- ✅ Open source APIs (IPTV-ORG, TVMaze)
- ✅ Legal and public streaming sources

**Note**: Users are responsible for complying with local laws regarding TV content viewing.

## 🤝 Contributions

Contributions are welcome! Please:
1. Fork the repository
2. Create a branch for your feature
3. Commit your changes
4. Push the branch
5. Open a Pull Request

## 🎨 Generated Assets

All images and mockups in this project were created specifically for the app:

- **GlobalTV Logo**: `./attached_assets/generated_images/GlobalTV_logo_design_a60d0fe4.png`
- **Hero Banner**: `./attached_assets/generated_images/GlobalTV_hero_banner_mockup_71b62d77.png`
- **Desktop Screenshot**: `./attached_assets/generated_images/Desktop_interface_screenshot_de552309.png`
- **Mobile Interface**: `./attached_assets/generated_images/Mobile_app_interface_mockup_27a48446.png`
- **Features Showcase**: `./attached_assets/generated_images/Features_showcase_collage_3a92a4e6.png`
- **Figma Mockup**: `./attached_assets/generated_images/Figma_design_mockup_b2c6534a.png`
- **GitHub Banner**: `./attached_assets/generated_images/GitHub_repository_banner_c46794c1.png`

## 🔧 Development

### Run in development mode
```bash
npm run dev
```
This command starts the Express server on port 5000 and the Vite dev server for the frontend.

### Build for production
```bash
npm run build
```

### Environment variables
```env
NODE_ENV=development
DATABASE_URL=your_postgres_url
```

## 🎯 Future Plans

- [ ] User authentication system
- [ ] EPG (Electronic Program Guide)
- [ ] Program recording
- [ ] Live chat for channels
- [ ] Personalized recommendations
- [ ] Native mobile app

## 📊 Stats

- **10,000+** TV channels worldwide
- **150+** countries represented
- **20+** content categories
- **Free and open source**

## 📧 Contact

For questions or support, open an issue on GitHub.

---

**Developed with ❤️ for the global TV streaming community**