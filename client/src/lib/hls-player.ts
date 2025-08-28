interface HLSPlayer {
  loadSource(url: string): void;
  attachMedia(video: HTMLVideoElement): void;
  destroy(): void;
  on(event: string, callback: Function): void;
}

declare global {
  interface Window {
    Hls: {
      new(): HLSPlayer;
      isSupported(): boolean;
      Events: {
        MANIFEST_LOADED: string;
        LEVEL_LOADED: string;
        ERROR: string;
      };
      ErrorTypes: {
        NETWORK_ERROR: string;
        MEDIA_ERROR: string;
        OTHER_ERROR: string;
      };
    };
  }
}

export class VideoPlayer {
  private hls: HLSPlayer | null = null;
  private video: HTMLVideoElement | null = null;

  constructor() {
    // Load HLS.js dynamically
    this.loadHLSScript();
  }

  private async loadHLSScript(): Promise<void> {
    return new Promise((resolve) => {
      if (window.Hls) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  async loadStream(videoElement: HTMLVideoElement, streamUrl: string): Promise<void> {
    await this.loadHLSScript();
    
    this.video = videoElement;

    // Check if HLS is natively supported
    if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = streamUrl;
      return;
    }

    // Use HLS.js for browsers that don't support HLS natively
    if (window.Hls && window.Hls.isSupported()) {
      this.hls = new window.Hls();
      
      this.hls.on(window.Hls.Events.ERROR, (event: any, data: any) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          this.handleError(data);
        }
      });

      this.hls.attachMedia(videoElement);
      this.hls.loadSource(streamUrl);
    } else {
      // Fallback for direct stream URLs
      videoElement.src = streamUrl;
    }
  }

  private handleError(data: any): void {
    if (!this.hls) return;

    switch (data.type) {
      case window.Hls.ErrorTypes.NETWORK_ERROR:
        console.log('Network error, attempting recovery...');
        (this.hls as any).startLoad();
        break;
      case window.Hls.ErrorTypes.MEDIA_ERROR:
        console.log('Media error, attempting recovery...');
        (this.hls as any).recoverMediaError();
        break;
      default:
        console.error('Fatal error, destroying HLS instance');
        this.destroy();
        break;
    }
  }

  destroy(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.video) {
      this.video.src = '';
      this.video = null;
    }
  }

  static isStreamUrl(url: string): boolean {
    const streamExtensions = ['.m3u8', '.ts', '.mp4', '.webm'];
    return streamExtensions.some(ext => url.toLowerCase().includes(ext));
  }
}
