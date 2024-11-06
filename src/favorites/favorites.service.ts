import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Artist } from '../artist/artist.interface';
import { Album } from '../album/album.interface';
import { Track } from '../track/track.interface';

@Injectable()
export class FavoritesService {
  private favoriteArtists = new Map<string, Artist>();
  private favoriteAlbums = new Map<string, Album>();
  private favoriteTracks = new Map<string, Track>();

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  getFavorites() {
    return {
      artists: Array.from(this.favoriteArtists.values()),
      albums: Array.from(this.favoriteAlbums.values()),
      tracks: Array.from(this.favoriteTracks.values()),
    };
  }

  addTrackToFavorites(id: string) {
    const track = this.trackService.findById(id);
    if (!track) throw new UnprocessableEntityException('Track does not exist');
    this.favoriteTracks.set(id, track);
  }

  removeTrackFromFavorites(id: string) {
    if (!this.favoriteTracks.has(id))
      throw new NotFoundException('Track is not in favorites');
    this.favoriteTracks.delete(id);
  }

  addAlbumToFavorites(id: string) {
    const album = this.albumService.findById(id);
    if (!album) throw new UnprocessableEntityException('Album does not exist');
    this.favoriteAlbums.set(id, album);
  }

  removeAlbumFromFavorites(id: string) {
    if (!this.favoriteAlbums.has(id))
      throw new NotFoundException('Album is not in favorites');
    this.favoriteAlbums.delete(id);
  }

  addArtistToFavorites(id: string) {
    const artist = this.artistService.findById(id);
    if (!artist)
      throw new UnprocessableEntityException('Artist does not exist');
    this.favoriteArtists.set(id, artist);
  }

  removeArtistFromFavorites(id: string) {
    if (!this.favoriteArtists.has(id))
      throw new NotFoundException('Artist is not in favorites');
    this.favoriteArtists.delete(id);
  }
}
