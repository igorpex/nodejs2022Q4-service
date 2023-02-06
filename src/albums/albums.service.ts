import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuid, validate, version } from 'uuid';
import { db } from 'src/data/db';

@Injectable()
export class AlbumsService {
  private albums: Array<Album> = [];
  create(createAlbumDto: CreateAlbumDto) {
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
    const newAlbum = {
      id: uuid(),
      ...createAlbumDto,
    };
    // console.log('newAlbum:', newAlbum);
    db.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    // return `This action returns all albums`;
    return db.albums;
  }

  findOne(id: string) {
    // return `This action returns a #${id} album`;
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`);
    }

    // Check album exists
    const album: Album = db.albums.find((album) => album['id'] === id);
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
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
    const index: number = db.albums.findIndex((album) => album['id'] === id);
    const album: Album = db.albums.find((album) => album['id'] === id);
    if (!album) {
      // console.log('No album to PUT!');
      // throw new BadRequestException('Album does not exist'); //400
      throw new NotFoundException('Album not found.'); //404
    }

    //create updated album
    const updatedAlbum = {
      id: id,
      ...updateAlbumDto,
    };
    db.albums[index] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string) {
    // return `This action removes a #${id} album`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`); //400
    }
    // Check album exists
    const album: Album = db.albums.find((album) => album['id'] === id);
    if (!album) {
      throw new NotFoundException('Album not found.'); //404
    }

    // Check album exists 2
    // const index: number = db.albums.findIndex((album) => album['id'] === id);
    // if (index === -1) {
    //   throw new NotFoundException('Album not found.'); //404
    // }

    // Null links in related entities
    db.tracks = db.tracks.map((track) => {
      if (track.albumId === id) {
        track.albumId = null;
        return track;
      } else {
        return track;
      }
    });

    // Remove from favorites
    db.favorites.albums = db.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    // Remove album itself
    db.albums = db.albums.filter((album) => album['id'] !== id);
    return;
  }
}
