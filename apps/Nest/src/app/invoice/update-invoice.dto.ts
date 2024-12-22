import {
  IsOptional,
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateItemDto {
  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  fromName?: string;

  @IsOptional()
  @IsString()
  fromAddress?: string;

  @IsOptional()
  @IsString()
  toName?: string;

  @IsOptional()
  @IsString()
  toAddress?: string;

  @IsOptional()
  @IsDate()
  invoiceDate?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemDto)
  items?: UpdateItemDto[];
}
