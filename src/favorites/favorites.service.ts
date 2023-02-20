import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { validate, version } from 'uuid';
import { db } from 'src/data/db';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';

@Injectable()
export class FavoritesService {
  // private favTracks: Array<string> = [];
  // private favArtists: Array<string> = [];
  // private favAlbums: Array<string> = [];

  findAll() {
    // return `This action returns all favorites`;
    const tracksList = db.favorites.tracks.map((trackId) => {
      return db.tracks.find((track) => track.id === trackId);
    });
    const artistsList = db.favorites.artists.map((artistId) => {
      return db.artists.find((artist) => artist.id === artistId);
    });
    const albumsList = db.favorites.albums.map((albumId) => {
      return db.albums.find((album) => album.id === albumId);
    });
    // console.log('db.tracks:', db.tracks);
    // console.log('tracksList:', tracksList);
    // console.log('artistsList:', artistsList);
    // console.log('albumsList:', albumsList);
    return {
      tracks: tracksList,
      artists: artistsList,
      albums: albumsList,
    };
  }

  createFavTrack(id: string) {
    // return 'This action adds a new favorite Track';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`); //400
    }

    // Check track exists
    const track: Track = db.tracks.find((track) => track['id'] === id);
    if (!track || track === undefined) {
      throw new UnprocessableEntityException('Track not found.'); //422
    }

    // Check already in favorites
    if (db.favorites.tracks.includes(id)) return;

    // Add to favorites
    // console.log('Favorites - add track id:', id);
    // console.log('Favorites - db.favorites.tracks:', db.favorites.tracks);
    db.favorites.tracks.push(id);
    return;
  }

  createFavArtist(id: string) {
    // return 'This action adds a new favorite Artist';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`);
    }

    // Check artist exists
    const artist: Artist = db.artists.find((artist) => artist['id'] === id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }

    // Check already in favorites
    if (db.favorites.artists.includes(id)) return;

    // Add to favorites
    db.favorites.artists.push(id);
    return;
  }

  createFavAlbum(id: string) {
    // return 'This action adds a new favorite Album';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`);
    }

    // Check album exists
    const album: Album = db.albums.find((album) => album['id'] === id);
    if (!album) {
      throw new NotFoundException('Album not found.');
    }

    // Check already in favorites
    if (db.favorites.albums.includes(id)) return;

    // Add to favorites
    // console.log('favorites.service album id:', id);
    db.favorites.albums.push(id);
    return;
  }

  removeFavTrack(id: string) {
    // return `This action removes a #${id} favorite Track`;
    // db.favorites.tracks = db.favorites.tracks.filter((trackId) => {
    //   if (!trackId || trackId !== id || trackId === null) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // });
    db.favorites.tracks = db.favorites.tracks.filter((trackId) => {
      return trackId !== id;
    });
    return;
  }

  removeFavArtist(id: string) {
    // return `This action removes a #${id} favorite Artist`;
    db.favorites.artists = db.favorites.artists.filter((artistId) => {
      return artistId !== id;
    });
    return;
  }

  removeFavAlbum(id: string) {
    // return `This action removes a #${id} favorite Album`;
    // console.log('favorites servics: removing album...');
    // const filteredAlbums = db.favorites.albums.filter((albumId) => {
    //   return albumId !== id;
    // });
    // db.favorites.albums = filteredAlbums;
    db.favorites.albums = db.favorites.albums.filter((albumId) => {
      return albumId !== id;
    });
    return;
  }
}
