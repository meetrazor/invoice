export interface InvoiceItem {
  id?: number;
  itemName: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Invoice {
  id?: number;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  invoiceDate: string;
  items: InvoiceItem[];
  totalAmount: number;
}
