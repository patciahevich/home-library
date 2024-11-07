import { Injectable } from '@nestjs/common';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}
  findAll() {
    return this.databaseService.findAllArtists();
  }

  findById(id: string) {
    return this.databaseService.findArtistById(id);
  }
  create(artistData: CreateArtistDto) {
    return this.databaseService.createArtist(artistData);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    return this.databaseService.updateArtist(id, updateArtistDto);
  }

  delete(id: string) {
    return this.databaseService.deleteArtist(id);
  }
}
