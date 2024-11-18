import { Injectable } from '@nestjs/common';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findById(id: string) {
    return await this.prisma.artist.findUnique({ where: { id } });
  }
  async create(artistData: CreateArtistDto) {
    return await this.prisma.artist.create({ data: artistData });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findById(id);

    if (!artist) {
      return null;
    }

    return await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async delete(id: string) {
    const artist = await this.findById(id);

    if (!artist) {
      return null;
    }

    return await this.prisma.artist.delete({ where: { id } });
  }
}
