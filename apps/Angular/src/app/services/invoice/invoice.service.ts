import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../../interface/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly apiUrl = 'http://localhost:3000/api/invoice';
  constructor(private readonly http: HttpClient) {}

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}`, invoice);
  }

  getInvoices(order?: { field: string; order: number }): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(`${this.apiUrl}/getAll`, order);
  }

  getOneInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  deleteInvoice(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  updateInvoice(id: number, invoice: Invoice): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, invoice);
  }
}
