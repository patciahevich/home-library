// track.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UuidGuard } from '../utils/uuid.guard';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllTracks() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @UseGuards(UuidGuard)
  async getTrackById(@Param('id') id: string) {
    const track = await this.trackService.findById(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || createTrackDto.duration === undefined) {
      throw new HttpException(
        'Name and duration are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.trackService.create(createTrackDto);
  }

  @Put(':id')
  @UseGuards(UuidGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const track = await this.trackService.update(id, updateTrackDto);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Delete(':id')
  @UseGuards(UuidGuard)
  async deleteTrack(@Param('id') id: string, @Res() res) {
    const isDeleted = await this.trackService.delete(id);
    if (!isDeleted) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return res.status(204).json({ message: 'Track deleted successfully' });
  }
}
