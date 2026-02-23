import { IsEmail, IsOptional, MinLength, IsString } from 'class-validator';

export class AuthDto {
  @IsString({
    message: 'Почта обязательна',
  })
  @IsEmail()
  email: string;

  @IsString({
    message: 'Номер телефона обязательна',
  })
  phone: string;

  @IsString({
    message: 'Пароль обязателен',
  })
  @MinLength(6, {
    message: 'Пароль должен содержать минимум 6 символов',
  })
  password: string;

  @IsOptional()
  @IsString()
  name: string;
}
