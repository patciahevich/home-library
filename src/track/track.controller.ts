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
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UuidGuard } from '../utils/uuid.guard';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.findAll();
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
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || createTrackDto.duration === undefined) {
      throw new HttpException(
        'Name and duration are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  @UseGuards(UuidGuard)
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
  async deleteTrack(@Param('id') id: string) {
    const isDeleted = await this.trackService.delete(id);
    if (!isDeleted) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return { status: 204, message: 'Track deleted successfully' };
  }
}
