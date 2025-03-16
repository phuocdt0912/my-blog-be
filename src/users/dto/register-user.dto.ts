import { IsString, IsEmail, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  @Length(1, 50)
  firstName: string;

  @ApiProperty({ example: 'William', description: 'The middle name of the user', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  middleName?: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  @Length(1, 50)
  lastName: string;

  @ApiProperty({ example: '+1234567890', description: 'The mobile number of the user', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 15)
  mobile?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  @IsEmail()
  @Length(1, 50)
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password for the user account', minLength: 6 })
  @IsString()
  @Length(6, 255)
  password: string;

  @ApiProperty({ example: 'Hello, I am a software developer', description: 'A brief introduction of the user', required: false })
  @IsOptional()
  @IsString()
  intro?: string;

  @ApiProperty({ example: 'Experienced software developer with 5 years of experience', description: 'Detailed profile of the user', required: false })
  @IsOptional()
  @IsString()
  profile?: string;
}