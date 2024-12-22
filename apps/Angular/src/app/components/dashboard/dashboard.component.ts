import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule, DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InvoiceComponent } from '../invoice/invoice.component';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { Invoice } from '../../interface/invoice';
import { ToasterMessageService } from '../../services/message/message.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    ButtonModule,
    BreadcrumbModule,
    RouterModule,
    TableModule,
    SelectModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    TextareaModule,
    CommonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [ConfirmationService, DialogService, InvoiceService, DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef | undefined;
  invoice!: Invoice[];
  filterInvoices!: Invoice[];
  cols!: Column[];
  loading = true;
  totalRecords = 0;
  sortField = 'invoiceDate';
  sortOrder = 1;
  searchTerm = '';
  searchFileds: (keyof Invoice)[] = ['fromName', 'toName', 'id'];
  items: MenuItem[] = [];

  constructor(
    public dialogService: DialogService,
    private readonly invoiceService: InvoiceService,
    private readonly alert: ToasterMessageService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.items = [{ icon: 'pi pi-home', route: '/dashboard' }];
  }

  ngOnInit(): void {
    this.loadData();
  }

  load(order: { field: string; order: number }) {
    console.log(order);
    this.sortField = order.field;
    this.sortOrder = order.order;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const order = { field: this.sortField, order: this.sortOrder };
    this.invoiceService.getInvoices(order).subscribe((data) => {
      this.invoice = data;
      this.filterInvoices = [...this.invoice];
      this.totalRecords = this.filterInvoices.length;
      this.loading = false;
    });
  }

  openNew(mode: 'Create' | 'Update' | 'View', invoice?: Invoice) {
    this.ref = this.dialogService.open(InvoiceComponent, {
      header: `${mode} Invoice`,
      width: '50vw',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '768px': '75vw',
        '1024px': '90vw',
      },
      data: { invoice, mode },
    });

    this.ref.onClose.subscribe(() => {
      this.loadData();
    });
  }

  filterTable() {
    const term = this.searchTerm.toLowerCase();
    this.filterInvoices = this.invoice.filter(
      (item) =>
        this.searchFileds.some((key) =>
          item[key]?.toString().toLowerCase().includes(term)
        ) ||
        (item.invoiceDate &&
          new Date(item.invoiceDate)
            .toLocaleDateString()
            .toLowerCase()
            .includes(term))
    );
    this.totalRecords = this.filterInvoices.length;
  }

  viewInvoice(invoice: Invoice) {
    this.openNew('View', invoice);
  }
  editInvoice(invoice: Invoice) {
    this.openNew('Update', invoice);
  }

  deleteInvoice(invoice: Invoice) {
    if (!invoice.id) {
      this.alert.showError('Something Went Wrong!!!');
      return;
    }
    this.invoiceService.deleteInvoice(invoice?.id).subscribe((response) => {
      this.alert.showSuccess(response.message);
      this.loadData();
    });
  }

  confirm(event: Event, invoice: Invoice) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        icon: 'pi pi-times',
        label: 'Cancel',
        outlined: true,
      },
      acceptButtonProps: {
        severity: 'danger',
        icon: 'pi pi-check',
        label: 'Confirm',
      },
      accept: () => {
        this.deleteInvoice(invoice);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.destroy();
    }
  }
}

interface Column {
  field: string;
  header: string;
}
