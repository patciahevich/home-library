import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}
  findAll() {
    return this.databaseService.findAllTracks();
  }
  findById(id: string) {
    return this.databaseService.findTrackById(id);
  }
  create(trackData: CreateTrackDto) {
    return this.databaseService.createTrack(trackData);
  }
  update(id: string, updateTrackDto: UpdateTrackDto) {
    return this.databaseService.updateTrack(id, updateTrackDto);
  }
  delete(id: string) {
    return this.databaseService.deleteTrack(id);
  }
}
