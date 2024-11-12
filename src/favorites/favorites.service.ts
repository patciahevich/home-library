import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}
  getFavorites() {
    return this.databaseService.getFavorites();
  }

  addTrackToFavorites(id: string) {
    return this.databaseService.addTrackToFavorites(id);
  }

  removeTrackFromFavorites(id: string) {
    return this.databaseService.removeTrackFromFavorites(id);
  }

  addAlbumToFavorites(id: string) {
    return this.databaseService.addAlbumToFavorites(id);
  }

  removeAlbumFromFavorites(id: string) {
    return this.databaseService.removeAlbumFromFavorites(id);
  }

  addArtistToFavorites(id: string) {
    return this.databaseService.addArtistToFavorites(id);
  }

  removeArtistFromFavorites(id: string) {
    return this.databaseService.removeArtistFromFavorites(id);
  }
}
