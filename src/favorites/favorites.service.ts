import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}
  async getFavorites() {
    const artists = await this.prisma.artist.findMany({
      where: { isFavorite: true },
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });
    const albums = await this.prisma.album.findMany({
      where: { isFavorite: true },
      select: {
        id: true,
        name: true,
        year: true,
        artistId: true,
      },
    });
    const tracks = await this.prisma.track.findMany({
      where: { isFavorite: true },
      select: {
        id: true,
        name: true,
        artistId: true,
        albumId: true,
        duration: true,
      },
    });
    return { artists, albums, tracks };
  }

  async addTrackToFavorites(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      return;
    }

    return await this.prisma.track.update({
      where: { id },
      data: { isFavorite: true },
    });
  }

  async removeTrackFromFavorites(id: string) {
    return await this.prisma.track.update({
      where: { id },
      data: { isFavorite: false },
    });
  }

  async addAlbumToFavorites(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      return;
    }
    return await this.prisma.album.update({
      where: { id },
      data: { isFavorite: true },
    });
  }

  async removeAlbumFromFavorites(id: string) {
    return await this.prisma.album.update({
      where: { id },
      data: { isFavorite: false },
    });
  }

  async addArtistToFavorites(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return;
    }
    return await this.prisma.artist.update({
      where: { id },
      data: { isFavorite: true },
    });
  }

  async removeArtistFromFavorites(id: string) {
    return await this.prisma.artist.update({
      where: { id },
      data: { isFavorite: false },
    });
  }
}
