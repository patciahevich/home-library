import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}
  async getFavorites() {
    const artists = await this.prisma.artist.findMany({
      where: { isFavorite: true },
    });
    const albums = await this.prisma.album.findMany({
      where: { isFavorite: true },
    });
    const tracks = await this.prisma.track.findMany({
      where: { isFavorite: true },
    });
    return { artists, albums, tracks };
  }

  async addTrackToFavorites(id: string) {
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
