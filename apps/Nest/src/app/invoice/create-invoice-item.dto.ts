import { IsString, IsNumber } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsString()
  itemName: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  rate: number;

  @IsNumber()
  total: number;
}
