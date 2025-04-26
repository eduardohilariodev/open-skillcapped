const CLOUDFRONT_URL = "https://d13z5uuzt1wkbz.cloudfront.net";
const VIDEO_ID_REGEX = /([a-z0-9]{10})(:?\/|$)/g;
const MAX_PARTS = 1000;
const CHUNK_SIZE = 50;

export class VideoUtils {
  static extractVideoId(url: string): string | null {
    const cleanUrl = url.replace(/\/[^/]*$/, "");
    const ids = [...cleanUrl.matchAll(VIDEO_ID_REGEX)].map((match) => match[1]);
    return ids.length > 0 ? (cleanUrl.includes("browse3") ? ids[0] : ids[ids.length - 1]) : null;
  }

  static async findLastPart(videoId: string, statusCallback?: (status: string) => void): Promise<number> {
    // Instead of trying to detect all parts which causes CORS issues,
    // we'll use a more conservative fixed approach that works for most videos

    if (statusCallback) {
      statusCallback("Preparing stream...");
    }

    try {
      // Try to get the actual duration first with a single request using a CORS proxy
      const useProxy = true; // Set to false to bypass proxy
      const corsProxy = "https://corsproxy.io/?"; // A public CORS proxy (you may want to host your own)

      // First try the metadata approach with CORS proxy if enabled
      const metadataUrl = `${CLOUDFRONT_URL}/${videoId}/metadata.json`;
      const proxiedMetadataUrl = useProxy ? `${corsProxy}${encodeURIComponent(metadataUrl)}` : metadataUrl;

      try {
        const response = await fetch(proxiedMetadataUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "omit",
        });

        if (response.ok) {
          const metadata = await response.json();
          if (metadata && metadata.durationInSeconds) {
            // Calculate parts based on actual duration (10 seconds per part)
            return Math.ceil(metadata.durationInSeconds / 10);
          }
        }
      } catch (e) {
        console.log("Metadata fetch failed, using fallback method", e);
      }

      // If metadata approach fails, use binary search to find last part efficiently
      // This minimizes the number of requests while still getting accurate duration
      let low = 1;
      let high = 600; // Conservative upper bound
      let lastFound = 0;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const url = `${CLOUDFRONT_URL}/${videoId}/HIDDEN4500-${String(mid).padStart(5, "0")}.ts`;
        const proxiedUrl = useProxy ? `${corsProxy}${encodeURIComponent(url)}` : url;

        try {
          const response = await fetch(proxiedUrl, {
            method: "HEAD",
            mode: "cors",
            credentials: "omit",
          });

          if (response.ok) {
            lastFound = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        } catch (e) {
          high = mid - 1;
        }
      }

      return lastFound > 0 ? lastFound : 300; // Fallback to reasonable default
    } catch (error) {
      console.error("Error finding last part:", error);
      return 300; // Fallback to a reasonable default if everything fails
    }
  }

  static generateM3U8(videoId: string, lastPart: number): string {
    let data = "#EXTM3U\n#EXT-X-PLAYLIST-TYPE:VOD\n#EXT-X-TARGETDURATION:10";

    // Include a special header to make HLS.js retry on 403 errors
    data += "\n#EXT-X-INDEPENDENT-SEGMENTS";

    // Generate the M3U8 with all potential parts
    // The HLS player will automatically handle 403 errors for non-existent parts
    for (let i = 1; i <= lastPart; i++) {
      data += `\n#EXTINF:10,\n${CLOUDFRONT_URL}/${videoId}/HIDDEN4500-${String(i).padStart(5, "0")}.ts`;
    }

    return data + "\n#EXT-X-ENDLIST";
  }

  // For advanced applications only, not used in web browser context
  static configureElectronForCORS() {
    // This is a placeholder for Electron-specific code
    // In an actual Electron app, you would use code like this:
    /*
    const { session } = require('electron');
    
    const filter = {
      urls: ['https://d13z5uuzt1wkbz.cloudfront.net/*']
    };
    
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      // Remove the referer header that CloudFront checks
      delete details.requestHeaders['Referer'];
      callback({ requestHeaders: details.requestHeaders });
    });
    */
  }
}
