import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
// import { Album } from './entities/album.entity';
import { v4 as uuid, validate, version } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}
  // private albums: Array<Album> = [];
  async create(createAlbumDto: CreateAlbumDto) {
    // return 'This action adds a new album';
    //check required fields and types
    const hasAllRequiredFields = createAlbumDto.name && createAlbumDto.year;
    const hasCorrectTypes =
      typeof createAlbumDto.name === 'string' &&
      typeof createAlbumDto.year === 'number';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, year should be number`,
      );
    }

    // create a album with random id
    const newAlbumData = {
      id: uuid(),
      ...createAlbumDto,
    };
    // console.log('newAlbum:', newAlbum);
    // db.albums.push(newAlbum);
    const newAlbum = await this.prisma.albums.create({
      data: newAlbumData,
    });
    return newAlbum;
  }

  async findAll() {
    // return `This action returns all albums`;
    const albums = await this.prisma.albums.findMany();
    return albums;
  }

  async findOne(id: string) {
    // return `This action returns a #${id} album`;
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`);
    }

    // Check album exists
    // const album: Album = db.albums.find((album) => album['id'] === id);
    const album = await this.prisma.albums.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    // return `This action updates a #${id} album`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`); //400
    }

    //check required fields and types
    const hasAllRequiredFields = updateAlbumDto.name && updateAlbumDto.year;
    const hasCorrectTypes =
      typeof updateAlbumDto.name === 'string' &&
      typeof updateAlbumDto.year === 'number';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, year should be number`,
      );
    }

    // Check album exists
    const album = await this.prisma.albums.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found.');
    }

    //create updated album
    const updatedAlbumData = {
      id: id,
      ...updateAlbumDto,
    };
    const updatedAlbum = await this.prisma.albums.update({
      data: updatedAlbumData,
      where: { id },
    });
    return updatedAlbum;
  }

  async remove(id: string) {
    // return `This action removes a #${id} album`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`); //400
    }

    try {
      await this.prisma.albums.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      // console.log('####albums.service remove error:', error);
      throw new NotFoundException('Album not found.'); //404
    }
  }
}
