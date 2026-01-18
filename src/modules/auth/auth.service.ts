import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, verify } from 'argon2';
import { Repository } from 'typeorm';
import {
  AuthJWTPayload,
  AuthPayload,
  ConnectUserInput,
  CreateUserInput,
  JWTUser,
  Role,
} from '../user/dtos/user.DTO';
import { UserSchema } from '../user/schema/user.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserSchema) private userRepo: Repository<UserSchema>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(input: CreateUserInput) {
    
    const isUnique = await this.userRepo.findOne({ where: { email: input.email } });
    if (isUnique) {
      throw new HttpException(
        {
          message: 'User already exist, please login !',
          error: 'email already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(input.password);
    const newUser = this.userRepo.create({
      ...input,
      password: hashedPassword,
      role: Role.USER,
      accessToken: null,
    });

    const savedUser = await this.userRepo.save(newUser);
    const { accessToken } = await this.generateToken(savedUser._id.toString());
    savedUser.accessToken = accessToken;
    await this.userRepo.save(savedUser);

    return savedUser;
  }

  async validateUser({ email, password }: ConnectUserInput) {
    const user = this.userRepo.findOneByOrFail({ email });
    const passwordMatch = await verify((await user).password, password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid creadentials');
    }
    return user;
  }

  async generateToken(userId: string) {
    const payload: AuthJWTPayload = {
      sub: {
        userId: userId,
      },
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async login(user: UserSchema): Promise<AuthPayload> {
    const { accessToken } = await this.generateToken(user._id.toString());
    if (!user._id) {
      throw new Error('User ID is missing');
    }
    const savedUser = await this.userRepo.save(user);
    savedUser.accessToken = accessToken;
    await this.userRepo.save(savedUser);

    return {
      userId: user._id.toString(),
      role: user.role,
      accessToken,
    };
  }

  async findById(id: string): Promise<UserSchema> {
    const user = await this.userRepo.findOneBy({
      _id: new ObjectId(id)
    })
    if (!user) {
      throw new NotFoundException(`User with email ${id} not found`);
    }
    return user;
  }

  async validateJWTUser(userId: string) {
    const user = await this.userRepo.findOneByOrFail({
      _id: new ObjectId(userId),
    });
    const JWTUser: JWTUser = {
      userId: user._id.toString(),
      role: user.role,
    };
    return JWTUser;
  }

  async getCurrentUserFromToken(token: string): Promise<UserSchema> {
    console.log("🚀 ~ AuthService ~ getCurrentUserFromToken ~ token:", token)
    try {
      const decoded = this.jwtService.verify<AuthJWTPayload>(token);
  
      const userId = decoded.sub.userId;
  
      const user = await this.userRepo.findOneByOrFail({
        _id: new ObjectId(userId),
      });
  
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
