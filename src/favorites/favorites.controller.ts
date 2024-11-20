import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UuidGuard } from '../utils/uuid.guard';
import { AuthGuard } from 'src/utils/auth.guard';

@UseGuards(AuthGuard)
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites() {
    return await this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @UseGuards(UuidGuard)
  async addTrackToFavorites(@Param('id') id: string) {
    const track = await this.favoritesService.addTrackToFavorites(id);
    if (!track) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { status: 201, message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @UseGuards(UuidGuard)
  async removeTrackFromFavorites(@Param('id') id: string, @Res() res) {
    await this.favoritesService.removeTrackFromFavorites(id);
    return res.status(204).json({ message: 'Track removed from favorites' });
  }

  @Post('album/:id')
  @UseGuards(UuidGuard)
  async addAlbumToFavorites(@Param('id') id: string) {
    const album = await this.favoritesService.addAlbumToFavorites(id);
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { status: 201, message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @UseGuards(UuidGuard)
  async removeAlbumFromFavorites(@Param('id') id: string, @Res() res) {
    await this.favoritesService.removeAlbumFromFavorites(id);
    return res.status(204).json({ message: 'Album removed from favorites' });
  }

  @Post('artist/:id')
  @UseGuards(UuidGuard)
  async addArtistToFavorites(@Param('id') id: string) {
    const artist = await this.favoritesService.addArtistToFavorites(id);
    if (!artist) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { status: 201, message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @UseGuards(UuidGuard)
  async removeArtistFromFavorites(@Param('id') id: string, @Res() res) {
    await this.favoritesService.removeArtistFromFavorites(id);
    return res.status(204).json({ message: 'Artist removed from favorites' });
  }
}
