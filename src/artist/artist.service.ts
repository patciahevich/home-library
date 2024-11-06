import { Injectable } from '@nestjs/common';
import { Artist } from './artist.interface';
import { v4 as uuid } from 'uuid';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistService {
  private artists = new Map<string, Artist>();

  findAll(): Artist[] {
    return Array.from(this.artists.values());
  }

  findById(id: string): Artist | null {
    return this.artists.get(id) || null;
  }

  create(artistData: CreateArtistDto): Artist {
    const id = uuid();
    const newArtist = { id, ...artistData };
    this.artists.set(id, newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist | null {
    const artist = this.artists.get(id);
    if (!artist) return null;

    const updatedArtist = { ...artist, ...updateArtistDto };
    this.artists.set(id, updatedArtist);
    return updatedArtist;
  }

  delete(id: string): boolean {
    return this.artists.delete(id);
  }
}
