import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.track.findMany();
  }
  async findById(id: string) {
    return await this.prisma.track.findUnique({ where: { id } });
  }
  async create(trackData: CreateTrackDto) {
    return await this.prisma.track.create({ data: trackData });
  }
  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
  }
  async delete(id: string) {
    return await this.prisma.track.delete({ where: { id } });
  }
}
