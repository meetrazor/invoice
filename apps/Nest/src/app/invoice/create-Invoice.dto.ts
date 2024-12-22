import {
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
  @IsString()
  fromName: string;

  @IsString()
  fromAddress: string;

  @IsString()
  toName: string;

  @IsString()
  toAddress: string;

  @IsDateString()
  invoiceDate: string;

  @IsArray()
  items: CreateInvoiceItemDto[];
}
