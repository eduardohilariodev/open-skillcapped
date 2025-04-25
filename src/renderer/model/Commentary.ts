export interface Commentary {
  uuid: string;
  title: string;
  description: string;
  releaseDate: Date;
  durationInSeconds: number;
  imageUrl: string;
  skillCappedUrl: string;
  role: string;
  staff: string;
  matchLink: string;
  champion: string;
  opponent: string;
  kills: number;
  deaths: number;
  assists: number;
  gameLengthInMinutes: number;
  carry: string;
  type: string;
}

export function isCommentary(item: any): item is Commentary {
  return item?.uuid !== undefined && item?.staff !== undefined;
}
