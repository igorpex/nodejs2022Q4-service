import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  createFavTrack(@Param('id') id: string) {
    // console.log('id:', id);
    return this.favoritesService.createFavTrack(id);
  }

  @Post('/artist/:id')
  createFavArtist(@Param('id') id: string) {
    // console.log('id:', id);
    return this.favoritesService.createFavArtist(id);
  }

  @Post('/album/:id')
  createFavAlbum(@Param('id') id: string) {
    // console.log('id:', id);
    return this.favoritesService.createFavAlbum(id);
  }

  @HttpCode(204)
  @Delete('/track/:id')
  removeFavTrack(@Param('id') id: string) {
    return this.favoritesService.removeFavTrack(id);
  }

  @HttpCode(204)
  @Delete('/artist/:id')
  removeFavArtist(@Param('id') id: string) {
    return this.favoritesService.removeFavArtist(id);
  }

  @HttpCode(204)
  @Delete('/album/:id')
  removeFavAlbum(@Param('id') id: string) {
    return this.favoritesService.removeFavAlbum(id);
  }
}
