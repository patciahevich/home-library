import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Album } from './album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  private albums = new Map<string, Album>();

  findAll() {
    return Array.from(this.albums.values());
  }

  findById(id: string) {
    return this.albums.get(id) || null;
  }

  create(albumData: CreateAlbumDto): Album {
    const id = uuid();
    const artistId = albumData.artistId || null;
    const album = { id, artistId, ...albumData };
    this.albums.set(id, album);
    return album;
  }

  update(id: string, updateAlbumData: UpdateAlbumDto): Album | null {
    const album = this.albums.get(id);

    if (!album) return null;

    const updatedAlbum = { ...album, ...updateAlbumData };
    this.albums.set(id, updatedAlbum);
    return updatedAlbum;
  }

  delete(id: string): boolean {
    return this.albums.delete(id);
  }
}
