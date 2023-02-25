import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid, validate, version } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
// import { Users, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  // private users: Array<User> = [];
  constructor(private prisma: PrismaService) {}

  hidePassword(user) {
    const returnedUser = JSON.parse(JSON.stringify(user));
    delete returnedUser.password;
    return returnedUser;
  }

  async create(createUserDto: CreateUserDto) {
    // return 'This action adds a new user';
    //check required fields and types
    const hasAllRequiredFields = createUserDto.login && createUserDto.password;
    const hasCorrectTypes =
      typeof createUserDto.login === 'string' &&
      typeof createUserDto.password === 'string';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. Login should be string, password should be string`,
      );
    }

    // create a user, with random id, version and created time and data sent
    const createdAt = Date.now();
    const newUser = {
      id: uuid(),
      version: 1,
      createdAt: createdAt,
      updatedAt: createdAt,
      ...createUserDto,
    };

    const user = await this.prisma.users.create({
      data: newUser,
    });
    return this.hidePassword(user);
  }

  async findAll() {
    const users = await this.prisma.users.findMany();
    return users.map((user) => this.hidePassword(user));
  }

  async findOne(id: string) {
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`userId ${id} is invalid (not uuid)`);
    }

    // Check user exists
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.hidePassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;

    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`userId ${id} is invalid (not uuid)`); //400
    }

    // Check user exists
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // check old password is correct
    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old passowrd is wrong.'); //403
    }

    //create updated user
    const updatedUserData = {
      id: id,
      login: user.login,
      version: user.version + 1,
      createdAt: user.createdAt,
      updatedAt: Date.now(),
      password: updateUserDto.newPassword,
    };
    const updatedUser = await this.prisma.users.update({
      data: updatedUserData,
      where: { id },
    });
    return plainToInstance(User, updatedUser);
    // return this.hidePassword(updatedUser);
  }

  async remove(id: string) {
    // return `This action removes a #${id} user`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`userId ${id} is invalid (not uuid)`); //400
    }

    //
    try {
      await this.prisma.users.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException('User not found.'); //404
    }
  }
}
