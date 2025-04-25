import axios from "axios";

export class ManifestLoader {
  private static manifestUrl = "https://www.skill-capped.com/lol/api/videos/manifest/v1";

  async load(): Promise<unknown> {
    try {
      const response = await axios.get(ManifestLoader.manifestUrl);
      return response.data;
    } catch (error) {
      console.error("Error loading manifest:", error);
      throw error;
    }
  }
} 
