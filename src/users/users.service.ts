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
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  // private users: Array<User> = [];
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  hidePassword(user: CreateUserDto) {
    const returnedUser = JSON.parse(JSON.stringify(user));
    delete returnedUser.password;
    return returnedUser;
  }

  async hashPassword(password) {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
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

    const password = await this.hashPassword(createUserDto.password);

    const newUser = {
      id: uuid(),
      version: 1,
      createdAt: createdAt,
      updatedAt: createdAt,
      ...createUserDto,
      password,
    };

    const checkUser = await this.prisma.users.findFirst({
      where: {
        login: createUserDto.login,
      },
    });

    if (!checkUser) {
      const user = await this.prisma.users.create({
        data: newUser,
      });
      return this.hidePassword(user);
    } else {
      try {
        const updatedUser = await this.prisma.users.update({
          where: { login: createUserDto.login },
          data: newUser,
        });
        // console.log('updatedUser', updatedUser);
        return this.hidePassword(updatedUser);
      } catch (error) {
        throw new BadRequestException(`some problem creating`);
      }
    }
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
    const validatePassword = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!validatePassword) {
      throw new ForbiddenException('Old password is wrong.'); //403
    }

    updateUserDto.newPassword = await this.hashPassword(
      updateUserDto.newPassword,
    );

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
