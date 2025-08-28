import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VideoPlayer as HLSVideoPlayer } from "@/lib/hls-player";
import type { Channel } from "@shared/schema";

interface VideoPlayerProps {
  channel: Channel;
  onClose: () => void;
}

export function VideoPlayer({ channel, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HLSVideoPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current || !channel.url) return;

    let timeoutId: NodeJS.Timeout;
    let cleanupListeners: (() => void) | undefined;

    const initPlayer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Set timeout for loading (15 seconds)
        timeoutId = setTimeout(() => {
          setError('Stream took too long to load. Channel might be offline.');
          setIsLoading(false);
        }, 15000);

        // First try direct stream
        if (videoRef.current) {
          // Check if it's a direct video URL
          const isDirect = channel.url.includes('.mp4') || channel.url.includes('.webm') || 
                          channel.url.includes('.mkv') || channel.url.includes('.avi');
          
          if (isDirect) {
            // Direct video file
            videoRef.current.src = channel.url;
          } else if (channel.url.includes('.m3u8')) {
            // HLS stream - try both direct and through proxy
            try {
              playerRef.current = new HLSVideoPlayer();
              await playerRef.current.loadStream(videoRef.current, channel.url);
            } catch (hlsError) {
              console.log('HLS direct failed, trying proxy...', hlsError);
              // Fallback to proxy stream
              const proxyUrl = `/api/proxy/stream?url=${encodeURIComponent(channel.url)}`;
              videoRef.current.src = proxyUrl;
            }
          } else {
            // Try proxy for other formats
            const proxyUrl = `/api/proxy/stream?url=${encodeURIComponent(channel.url)}`;
            videoRef.current.src = proxyUrl;
          }
          
          // Add event listeners with better error handling
          const handleLoadStart = () => {
            setIsLoading(true);
            setError(null);
          };
          const handleLoadedData = () => {
            setIsLoading(false);
            setError(null);
            clearTimeout(timeoutId);
          };
          const handleCanPlay = () => {
            setIsLoading(false);
            setError(null);
            clearTimeout(timeoutId);
          };
          const handleError = async (e: Event) => {
            console.error('Video error:', e);
            clearTimeout(timeoutId);
            // Try fallback through proxy if direct failed
            if (videoRef.current && !videoRef.current.src.includes('/api/proxy/stream')) {
              console.log('Trying proxy fallback...');
              setError(null);
              setIsLoading(true);
              const proxyUrl = `/api/proxy/stream?url=${encodeURIComponent(channel.url)}`;
              videoRef.current.src = proxyUrl;
              // Set new timeout for proxy attempt
              timeoutId = setTimeout(() => {
                setError('Stream unavailable. Channel might be offline or geo-blocked.');
                setIsLoading(false);
              }, 10000);
            } else {
              setError('Stream unavailable. Channel might be offline or geo-blocked.');
              setIsLoading(false);
            }
          };
          
          videoRef.current.addEventListener('loadstart', handleLoadStart);
          videoRef.current.addEventListener('loadeddata', handleLoadedData);
          videoRef.current.addEventListener('canplay', handleCanPlay);
          videoRef.current.addEventListener('error', handleError);
          
          // Clean up listeners
          cleanupListeners = () => {
            if (videoRef.current) {
              videoRef.current.removeEventListener('loadstart', handleLoadStart);
              videoRef.current.removeEventListener('loadeddata', handleLoadedData);
              videoRef.current.removeEventListener('canplay', handleCanPlay);
              videoRef.current.removeEventListener('error', handleError);
            }
          };
        }
        
      } catch (err) {
        console.error('Error loading stream:', err);
        setError('Stream not available - format may not be supported');
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initPlayer();

    return () => {
      clearTimeout(timeoutId);
      if (cleanupListeners) {
        cleanupListeners();
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [channel.url]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const volumeValue = value[0] / 100;
    videoRef.current.volume = volumeValue;
    setVolume(value);
    
    if (volumeValue === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="video-player-container mb-8 fade-in" data-testid="video-player">
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls={false}
            autoPlay
            muted={isMuted}
            data-testid="video-element"
          />
          
          {/* Loading/Error State */}
          {(isLoading || error) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                {isLoading ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <h3 className="text-lg font-medium text-white">Loading Stream...</h3>
                  </>
                ) : error ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                      <X className="text-red-400 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Stream Error</h3>
                    <p className="text-gray-400 text-sm mb-4">{error}</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      size="sm"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      Try Again
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                      <Play className="text-primary text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-white" data-testid="text-channel-name">
                      {channel.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Click play to start watching</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:text-primary"
                  data-testid="button-play-pause"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:text-primary"
                    data-testid="button-mute"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-full"
                      data-testid="slider-volume"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">Live</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                  data-testid="button-favorite"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:text-primary"
                  data-testid="button-fullscreen"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:text-primary"
                  data-testid="button-close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Channel Info Bar */}
        <div className="p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold" data-testid="text-country-flag">
                  {channel.country === 'United States' ? '🇺🇸' : 
                   channel.country === 'United Kingdom' ? '🇬🇧' : 
                   channel.country === 'Canada' ? '🇨🇦' : 
                   channel.country === 'Germany' ? '🇩🇪' : 
                   channel.country === 'France' ? '🇫🇷' : '🏳️'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold" data-testid="text-channel-title">{channel.name}</h4>
                <p className="text-sm text-muted-foreground" data-testid="text-channel-info">
                  {channel.group} • {channel.country}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
