import { Album } from 'src/album/album.interface';
import { Artist } from 'src/artist/artist.interface';
import { Track } from 'src/track/track.interface';
import { User } from 'src/user/user.interface';

export interface DataBase {
  users: Map<string, User>;
  artists: Map<string, Artist>;
  tracks: Map<string, Track>;
  albums: Map<string, Album>;
  favoriteArtists: Map<string, Artist>;
  favoriteAlbums: Map<string, Album>;
  favoriteTracks: Map<string, Track>;
}
