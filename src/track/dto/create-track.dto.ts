export class CreateTrackDto {
  name: string;
  duration: number;
  artistId?: string;
  albumId?: string;
}
