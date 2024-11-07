import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UuidGuard } from '../utils/uuid.guard';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @UseGuards(UuidGuard)
  addTrackToFavorites(@Param('id') id: string) {
    this.favoritesService.addTrackToFavorites(id);
    return { status: 201, message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @UseGuards(UuidGuard)
  removeTrackFromFavorites(@Param('id') id: string, @Res() res) {
    this.favoritesService.removeTrackFromFavorites(id);
    return res.status(204).json({ message: 'Track removed from favorites' });
  }

  @Post('album/:id')
  @UseGuards(UuidGuard)
  addAlbumToFavorites(@Param('id') id: string) {
    this.favoritesService.addAlbumToFavorites(id);
    return { status: 201, message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @UseGuards(UuidGuard)
  removeAlbumFromFavorites(@Param('id') id: string, @Res() res) {
    this.favoritesService.removeAlbumFromFavorites(id);
    return res.status(204).json({ message: 'Album removed from favorites' });
  }

  @Post('artist/:id')
  @UseGuards(UuidGuard)
  addArtistToFavorites(@Param('id') id: string) {
    this.favoritesService.addArtistToFavorites(id);
    return { status: 201, message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @UseGuards(UuidGuard)
  removeArtistFromFavorites(@Param('id') id: string, @Res() res) {
    this.favoritesService.removeArtistFromFavorites(id);
    return res.status(204).json({ message: 'Artist removed from favorites' });
  }
}
