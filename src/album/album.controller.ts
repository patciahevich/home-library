import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { UuidGuard } from 'src/utils/uuid.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @Get()
  getAllAlbums() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @UseGuards(UuidGuard)
  async getAlbumById(@Param('id') id: string) {
    const album = await this.albumService.findById(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Post()
  async createArtist(@Body() albumData: CreateAlbumDto) {
    if (!albumData.name || albumData.year === undefined) {
      throw new HttpException(
        'Name and year fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.albumService.create(albumData);
  }

  @Put(':id')
  @UseGuards(UuidGuard)
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const album = await this.albumService.update(id, updateAlbumDto);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Delete(':id')
  @UseGuards(UuidGuard)
  async deleteAlbum(@Param('id') id: string) {
    const isDeleted = await this.albumService.delete(id);
    if (!isDeleted) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return { status: 204, message: 'Album deleted successfully' };
  }
}
