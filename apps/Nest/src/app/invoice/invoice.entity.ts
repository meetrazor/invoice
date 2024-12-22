import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromName: string;

  @Column()
  fromAddress: string;

  @Column()
  toName: string;

  @Column()
  toAddress: string;

  @Column()
  invoiceDate: Date;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, {
    cascade: true,
  })
  items: InvoiceItem[];

  get totalAmount(): number {
    return this.items.reduce((acc, item) => acc + item.total, 0);
  }
}
