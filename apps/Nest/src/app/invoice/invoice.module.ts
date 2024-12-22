import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItem } from './invoice-item.entity';
import { Invoice } from './invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
