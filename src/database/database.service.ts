import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DataBase } from './database.interface';
import { Album } from 'src/album/album.interface';
import { Artist } from 'src/artist/artist.interface';
import { Track } from 'src/track/track.interface';
import { User } from 'src/user/user.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';

@Injectable()
export class DatabaseService {
  database: DataBase;

  constructor() {
    this.database = {
      users: new Map<string, User>(),
      artists: new Map<string, Artist>(),
      tracks: new Map<string, Track>(),
      albums: new Map<string, Album>(),
      favoriteArtists: new Map<string, Artist>(),
      favoriteAlbums: new Map<string, Album>(),
      favoriteTracks: new Map<string, Track>(),
    };
  }

  private validateId(id: string | undefined, type: 'artist' | 'album') {
    if (!id) {
      return null;
    }
    const isValid = this.database[type + 's'].has(id);
    if (!isValid) {
      throw new HttpException(`Invalid ${type} ID`, HttpStatus.BAD_REQUEST);
    }
    return id;
  }

  private removePassword(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  findAllUsers() {
    return Array.from(this.database.users.values()).map((user) =>
      this.removePassword(user),
    );
  }

  findAllArtists(): Artist[] {
    return Array.from(this.database.artists.values());
  }
  findAllTracks(): Track[] {
    return Array.from(this.database.tracks.values());
  }
  findAllAlbums() {
    return Array.from(this.database.albums.values());
  }

  findUserById(id: string) {
    return this.removePassword(this.database.users.get(id)) || null;
  }
  findArtistById(id: string): Artist | null {
    return this.database.artists.get(id) || null;
  }
  findTrackById(id: string): Track | null {
    return this.database.tracks.get(id) || null;
  }

  findAlbumById(id: string) {
    return this.database.albums.get(id) || null;
  }

  createUser(createUserDto: CreateUserDto) {
    const id = uuid();
    const createdAt = new Date().getTime();
    const updatedAt = new Date().getTime();
    const version = 1;
    const newUser = { id, createdAt, updatedAt, version, ...createUserDto };
    this.database.users.set(id, newUser);
    return this.removePassword(newUser);
  }
  createArtist(artistData: CreateArtistDto): Artist {
    const id = uuid();
    const newArtist = { id, ...artistData };
    this.database.artists.set(id, newArtist);
    return newArtist;
  }
  createTrack(trackData: CreateTrackDto): Track {
    const id = uuid();
    const artistId = this.validateId(trackData.artistId, 'artist');
    const albumId = this.validateId(trackData.albumId, 'album');
    const newTrack = { id, albumId, artistId, ...trackData };

    this.database.tracks.set(id, newTrack);
    return newTrack;
  }

  createAlbum(albumData: CreateAlbumDto): Album {
    const id = uuid();
    const artistId = this.validateId(albumData.artistId, 'artist');
    const album = { id, artistId, ...albumData };
    this.database.albums.set(id, album);
    return album;
  }
  updateArtist(id: string, updateArtistDto: UpdateArtistDto): Artist | null {
    const artist = this.database.artists.get(id);
    if (!artist) return null;

    const updatedArtist = { ...artist, ...updateArtistDto };
    this.database.artists.set(id, updatedArtist);
    return updatedArtist;
  }

  updateUserPassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.database.users.get(id);
    if (!user) return null;

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    user.password = updatePasswordDto.newPassword;
    user.updatedAt = new Date().getTime();
    this.database.users.set(id, user);
    return this.removePassword(user);
  }
  updateTrack(id: string, updateTrackDto: UpdateTrackDto): Track | null {
    const track = this.database.tracks.get(id);
    if (!track) return null;

    const updatedTrack = { ...track, ...updateTrackDto };
    this.database.tracks.set(id, updatedTrack);
    return updatedTrack;
  }
  updateAlbum(id: string, updateAlbumData: UpdateAlbumDto): Album | null {
    const album = this.database.albums.get(id);

    if (!album) return null;

    const updatedAlbum = { ...album, ...updateAlbumData };
    this.database.albums.set(id, updatedAlbum);
    return updatedAlbum;
  }

  deleteUser(id: string) {
    return this.database.users.delete(id);
  }
  deleteArtist(id: string): boolean {
    this.database.albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
    this.database.tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    this.database.favoriteArtists.delete(id);
    return this.database.artists.delete(id);
  }
  deleteTrack(id: string): boolean {
    this.database.favoriteTracks.delete(id);
    return this.database.tracks.delete(id);
  }
  deleteAlbum(id: string): boolean {
    this.database.tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
    this.database.favoriteAlbums.delete(id);
    return this.database.albums.delete(id);
  }

  getFavorites() {
    return {
      artists: Array.from(this.database.favoriteArtists.values()),
      albums: Array.from(this.database.favoriteAlbums.values()),
      tracks: Array.from(this.database.favoriteTracks.values()),
    };
  }

  addTrackToFavorites(id: string) {
    const track = this.findTrackById(id);
    if (!track) throw new UnprocessableEntityException('Track does not exist');
    this.database.favoriteTracks.set(id, track);
  }
  removeTrackFromFavorites(id: string) {
    if (!this.database.favoriteTracks.has(id))
      throw new NotFoundException('Track is not in favorites');
    this.database.favoriteTracks.delete(id);
  }
  addAlbumToFavorites(id: string) {
    const album = this.findAlbumById(id);
    if (!album) throw new UnprocessableEntityException('Album does not exist');
    this.database.favoriteAlbums.set(id, album);
  }
  removeAlbumFromFavorites(id: string) {
    if (!this.database.favoriteAlbums.has(id))
      throw new NotFoundException('Album is not in favorites');
    this.database.favoriteAlbums.delete(id);
  }
  addArtistToFavorites(id: string) {
    const artist = this.findArtistById(id);
    if (!artist)
      throw new UnprocessableEntityException('Artist does not exist');
    this.database.favoriteArtists.set(id, artist);
  }
  removeArtistFromFavorites(id: string) {
    if (!this.database.favoriteArtists.has(id))
      throw new NotFoundException('Artist is not in favorites');
    this.database.favoriteArtists.delete(id);
  }
}
