import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Favorites } from 'src/favorites/entities/favorite.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';

const users = [];
const tracks = [];
const artists = [];
const albums = [];
const favorites: Favorites = { tracks: [], artists: [], albums: [] };
export interface DB {
  users: User[];
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  favorites: Favorites;
}

export const db = {
  users,
  tracks,
  artists,
  albums,
  favorites,
};
