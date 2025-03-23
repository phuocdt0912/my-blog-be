import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    console.log('registerUser :>> ');
    const { firstName, lastName, email, password } = registerUserDto;
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    //Create user entity
    const newUser = await this.usersRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });


    try {
      return this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('Email already exists abcdef');
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const rs = await this.usersRepository.findOne({ where: { email } });
    return rs;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async compareHashPassword(incomingPwd: string, hashedPwd: string): Promise<boolean> {
    return bcrypt.compare(incomingPwd, hashedPwd);
  }
}
