// track.service.ts
import { Injectable } from '@nestjs/common';
import { Track } from './track.interface';
import { v4 as uuid } from 'uuid';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {
  private tracks = new Map<string, Track>();

  findAll(): Track[] {
    return Array.from(this.tracks.values());
  }

  findById(id: string): Track | null {
    return this.tracks.get(id) || null;
  }

  create(trackData: CreateTrackDto): Track {
    const id = uuid();
    const artistId = trackData.artistId ?? null;
    const albumId = trackData.albumId ?? null;
    const newTrack = { id, albumId, artistId, ...trackData };
    this.tracks.set(id, newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track | null {
    const track = this.tracks.get(id);
    if (!track) return null;

    const updatedTrack = { ...track, ...updateTrackDto };
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }

  delete(id: string): boolean {
    return this.tracks.delete(id);
  }
}
