import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, AlbumService, TrackService, ArtistService],
})
export class favoritesModule {}
