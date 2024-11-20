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
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { UuidGuard } from 'src/utils/uuid.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AuthGuard } from 'src/utils/auth.guard';

@UseGuards(AuthGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @Get()
  async getAllAlbums() {
    return await this.albumService.findAll();
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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createArtist(@Body() albumData: CreateAlbumDto) {
    if (!albumData.name || albumData.year === undefined) {
      throw new HttpException(
        'Name and year fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.albumService.create(albumData);
  }

  @Put(':id')
  @UseGuards(UuidGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
  async deleteAlbum(@Param('id') id: string, @Res() res) {
    const isDeleted = await this.albumService.delete(id);
    if (!isDeleted) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return res.status(204).json({ message: 'Album deleted successfully' });
  }
}
