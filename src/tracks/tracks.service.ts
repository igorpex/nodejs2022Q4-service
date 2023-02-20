import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
// import { Track } from './entities/track.entity';
import { v4 as uuid, validate, version } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}
  // private tracks: Array<Track> = [];
  async create(createTrackDto: CreateTrackDto) {
    // return 'This action adds a new track';
    //check required fields and types
    const hasAllRequiredFields = createTrackDto.name && createTrackDto.duration;
    const hasCorrectTypes =
      typeof createTrackDto.name === 'string' &&
      typeof createTrackDto.duration === 'number';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, duration should be integer number`,
      );
    }

    // create a track with random id
    const newTrackData = {
      id: uuid(),
      ...createTrackDto,
    };
    // db.tracks.push(newTrack);
    const newTrack = await this.prisma.tracks.create({
      data: newTrackData,
    });
    return newTrack;
  }

  async findAll() {
    const tracks = await this.prisma.tracks.findMany();
    return tracks;
  }

  async findOne(id: string) {
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`);
    }
    const track = await this.prisma.tracks.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found.'); //404
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    // return `This action updates a #${id} track`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`); //400
    }
    // Check track exists
    const track = await this.prisma.tracks.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found.'); //404
    }

    //check required fields and types
    const hasAllRequiredFields = updateTrackDto.name && updateTrackDto.duration;
    const hasCorrectTypes =
      typeof updateTrackDto.name === 'string' &&
      typeof updateTrackDto.duration === 'number';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, duration should be integer number`,
      );
    }

    //create updated track
    const updatedTrackData = {
      id: id,
      ...updateTrackDto,
    };
    const updatedTrack = await this.prisma.tracks.update({
      data: updatedTrackData,
      where: { id },
    });
    return updatedTrack;
  }

  async remove(id: string) {
    // return `This action removes a #${id} track`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`); //400
    }

    try {
      await this.prisma.tracks.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      // console.log('####tracks.service remove error:', error);
      throw new NotFoundException('Track not found.'); //404
    }
  }
}
