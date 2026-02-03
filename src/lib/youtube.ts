/**
 * Extracts the YouTube video ID from various YouTube URL formats
 *
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 *
 * @param url - YouTube URL
 * @returns Video ID or null if not a valid YouTube URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Generates a YouTube embed URL from a video ID
 *
 * @param videoId - YouTube video ID
 * @returns Embed URL for iframe
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Generates a YouTube watch URL from a video ID
 *
 * @param videoId - YouTube video ID
 * @returns Watch URL for linking
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * Generates a YouTube thumbnail URL from a video ID
 *
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, medium, high, standard, maxres)
 * @returns Thumbnail image URL
 */
export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Checks if a URL is a YouTube URL
 *
 * @param url - URL to check
 * @returns True if the URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}
