import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateInvoiceDto } from './create-Invoice.dto';
import { InvoiceService } from './invoice.service';
import { Invoice } from './invoice.entity';
import { UpdateInvoiceDto } from './update-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Post('getAll')
  async getInvoices(
    @Body() sortBy: { field: string; order: 1 | -1 }
  ): Promise<Invoice[]> {
    return this.invoiceService.getAllInvoices(sortBy);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Invoice> {
    return this.invoiceService.getOneInvoice(id);
  }

  @Delete(':id')
  async deleteOneInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.deleteOneInvoice(id);
  }

  @Put(':id')
  async updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto
  ) {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }
}
