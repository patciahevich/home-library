import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.album.findMany();
  }
  async findById(id: string) {
    return await this.prisma.album.findUnique({ where: { id } });
  }

  async create(albumData: CreateAlbumDto) {
    return await this.prisma.album.create({ data: albumData });
  }

  async update(id: string, updateAlbumData: UpdateAlbumDto) {
    const album = await this.findById(id);

    if (!album) {
      return;
    }

    return await this.prisma.album.update({
      where: { id },
      data: updateAlbumData,
    });
  }

  async delete(id: string) {
    const album = await this.findById(id);

    if (!album) {
      return;
    }

    return await this.prisma.album.delete({ where: { id } });
  }
}
