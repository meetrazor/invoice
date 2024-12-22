import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemName: string;

  @Column()
  quantity: number;

  @Column()
  rate: number;

  @Column()
  total: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  invoice: Invoice;
}
