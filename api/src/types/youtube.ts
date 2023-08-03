export interface VideoInfo {
  videoId: string;
  stats: {
    transferredBytes: number;
    runtime: number;
    averageSpeed: number;
  };
  file: string;
  youtubeUrl: string;
  videoTitle: string;
  artist: string;
  title: string;
  thumbnail: string;
}
