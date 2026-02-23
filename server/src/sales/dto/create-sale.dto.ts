import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsString({ message: 'Дата обязательна' })
  @IsNotEmpty()
  date: string;

  @IsNumber({}, { message: 'Цена обязательна' })
  @IsNotEmpty()
  pointer: number;

  @IsNumber({}, { message: 'Количество обязательно' })
  @IsNotEmpty()
  quantity: number;

  @IsNumber({}, { message: 'Цена обязательна' })
  @IsNotEmpty()
  price: number;

  @IsNumber({}, { message: 'Сумма обязательна' })
  @IsNotEmpty()
  total: number;
}
