import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate, version } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // return `This action returns all favorites`;
    const favorites = await this.prisma.favorites.findMany();
    const tracksList = favorites
      .filter((favorite) => favorite.trackId !== null)
      .map((favorite) => favorite.trackId);
    const artistsList = favorites
      .filter((favorite) => favorite.artistId !== null)
      .map((favorite) => favorite.artistId);
    const albumsList = favorites
      .filter((favorite) => favorite.albumId !== null)
      .map((favorite) => favorite.albumId);

    const tracks = await this.prisma.tracks.findMany({
      where: {
        id: { in: tracksList },
      },
    });
    const artists = await this.prisma.artists.findMany({
      where: {
        id: { in: artistsList },
      },
    });
    const albums = await this.prisma.albums.findMany({
      where: {
        id: { in: albumsList },
      },
    });

    return {
      tracks: tracks,
      artists: artists,
      albums: albums,
    };
  }

  async createFavTrack(id: string) {
    // return 'This action adds a new favorite Track';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`); //400
    }

    try {
      await this.prisma.favorites.create({
        data: { trackId: id },
      });
    } catch (error) {
      // console.log('####favorites.service add track error:', error);
      throw new UnprocessableEntityException('Track not found.'); //422
    }
    return;
  }

  async createFavArtist(id: string) {
    // return 'This action adds a new favorite Artist';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`);
    }

    // Add to favorites

    try {
      await this.prisma.favorites.create({
        data: { artistId: id },
      });
    } catch (error) {
      // console.log('####favorites.service add artist error:', error);
      throw new UnprocessableEntityException('Artist not found.'); //422
    }

    return;
  }

  async createFavAlbum(id: string) {
    // return 'This action adds a new favorite Album';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`);
    }

    try {
      await this.prisma.favorites.create({
        data: { albumId: id },
      });
    } catch (error) {
      // console.log('####favorites.service add album error:', error);
      throw new UnprocessableEntityException('Album not found.'); //422
    }
    return;
  }

  async removeFavTrack(id: string) {
    try {
      await this.prisma.favorites.deleteMany({
        where: {
          trackId: { equals: id },
        },
      });
    } catch (error) {
      // console.log('####favorites.service remove error:', error);
    }

    return;
  }

  async removeFavArtist(id: string) {
    // return `This action removes a #${id} favorite Artist`;
    try {
      await this.prisma.favorites.deleteMany({
        where: {
          artistId: { equals: id },
        },
      });
    } catch (error) {
      // console.log('####favorites.service remove error:', error);
      // throw new NotFoundException('Favorite track not found.'); //404
    }
    return;
  }

  async removeFavAlbum(id: string) {
    // return `This action removes a #${id} favorite Album`;
    try {
      await this.prisma.favorites.deleteMany({
        where: {
          albumId: { equals: id },
        },
      });
    } catch (error) {
      // console.log('####favorites.service remove error:', error);
      // throw new NotFoundException('Favorite track not found.'); //404
    }
    return;
  }
}
