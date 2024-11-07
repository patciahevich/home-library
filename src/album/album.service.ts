import { Injectable } from '@nestjs/common';
import { Album } from './album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AlbumService {
  constructor(private readonly databaseService: DatabaseService) {}
  findAll() {
    return this.databaseService.findAllAlbums();
  }
  findById(id: string) {
    return this.databaseService.findAlbumById(id);
  }

  create(albumData: CreateAlbumDto): Album {
    return this.databaseService.createAlbum(albumData);
  }

  update(id: string, updateAlbumData: UpdateAlbumDto): Album | null {
    return this.databaseService.updateAlbum(id, updateAlbumData);
  }

  delete(id: string): boolean {
    return this.databaseService.deleteAlbum(id);
  }
}
