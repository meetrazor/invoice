import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceItem } from './invoice-item.entity';
import { Invoice } from './invoice.entity';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './create-Invoice.dto';
import { UpdateInvoiceDto } from './update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>
  ) {}

  // Create a new invoice
  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { items, ...invoiceData } = createInvoiceDto;

    const invoice = this.invoiceRepository.create(invoiceData);
    await this.invoiceRepository.save(invoice);

    const invoiceItems = items.map((item) => {
      const newItem = this.invoiceItemRepository.create({
        ...item,
        invoice: invoice, // associate the item with the invoice
      });
      return newItem;
    });

    await this.invoiceItemRepository.save(invoiceItems);

    return invoice;
  }

  async getAllInvoices(
    sortBy: { field?: string; order?: 1 | -1 } = {
      field: 'invoiceDate',
      order: 1,
    }
  ): Promise<Invoice[]> {
    const { field = 'invoiceDate', order = 1 } = sortBy;
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.items', 'item');
    if (field !== 'totalAmount') {
      const orderValue = order === 1 ? 'ASC' : 'DESC';
      queryBuilder.addOrderBy(`invoice.${field}`, orderValue);
    }

    const invoices = await queryBuilder.getMany();

    const invoicesWithoutItems = invoices.map((invoice) => {
      const totalAmount = invoice.items.reduce(
        (acc, item) => acc + item.total,
        0
      );
      return { ...invoice, totalAmount, items: undefined };
    });

    if (field === 'totalAmount') {
      invoicesWithoutItems.sort((a, b) => {
        if (order === 1) {
          return a.totalAmount - b.totalAmount;
        } else {
          return b.totalAmount - a.totalAmount;
        }
      });
    }

    return invoicesWithoutItems;
  }

  async getOneInvoice(id: number): Promise<Invoice> {
    // Find the invoice with items
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items'], // Include items in the query
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // Calculate the total amount
    const totalAmount = invoice.items.reduce(
      (acc, item) => acc + item.total,
      0
    );

    // Return the invoice details including the total amount
    return {
      ...invoice,
      totalAmount,
    };
  }

  async deleteOneInvoice(id: number): Promise<{ message: string }> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    await this.invoiceRepository.delete(id);

    return { message: `Invoice with ID ${id} has been successfully deleted.` };
  }

  async updateInvoice(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    Object.assign(invoice, updateInvoiceDto);

    return this.invoiceRepository.save(invoice);
  }
}
