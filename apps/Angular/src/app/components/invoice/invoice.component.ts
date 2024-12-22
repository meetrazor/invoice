import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { ToasterMessageService } from '../../services/message/message.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Invoice } from '../../interface/invoice';

@Component({
  selector: 'app-invoice',
  imports: [
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    DatePickerModule,
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  loading = true;
  invoice: Invoice | undefined;
  mode: 'Create' | 'Update' | 'View' = 'Create';

  constructor(
    private readonly fb: FormBuilder,
    private readonly invoiceService: InvoiceService,
    private readonly alert: ToasterMessageService,
    private readonly config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    this.config.focusOnShow = false;
    if (this.config.data) {
      this.invoice = this.config.data['invoice'];
      this.mode = this.config.data['mode'];
    }
  }

  ngOnInit(): void {
    if (this.mode === 'Create' && !this.invoice) {
      this.formInit();
    }
    if (this.mode === 'View' && this.invoice?.id) {
      this.loading = true;
      this.invoiceService
        .getOneInvoice(this.invoice?.id)
        .subscribe((invoice) => {
          this.invoice = invoice;
          this.formInit();
          this.invoiceForm.patchValue(invoice);
          this.invoiceForm.patchValue({
            invoiceDate: new Date(invoice.invoiceDate),
          });
          while (this.items.length) {
            this.items.removeAt(0);
          }
          invoice.items.forEach((item) => this.items.push(this.fb.group(item)));
          this.disableForm();
          this.loading = false;
        });
    } else if (this.mode === 'Update' && this.invoice?.id) {
      this.loading = true;
      this.invoiceService
        .getOneInvoice(this.invoice?.id)
        .subscribe((invoice) => {
          this.invoice = invoice;
          this.formInit();
          this.invoiceForm.patchValue(invoice);
          this.invoiceForm.patchValue({
            invoiceDate: new Date(invoice.invoiceDate),
          });
          while (this.items.length) {
            this.items.removeAt(0);
          }
          invoice.items.forEach((item) => this.items.push(this.fb.group(item)));

          this.loading = false;
        });
    }
  }

  getError(index: number, field: string, error: string): boolean {
    const control = this.items.at(index).get(field);
    return (
      (control?.touched && control?.invalid && control?.hasError(error)) ||
      false
    );
  }

  formInit() {
    this.invoiceForm = this.fb.group({
      invoiceDate: ['', Validators.required],
      fromName: ['', Validators.required],
      fromAddress: ['', Validators.required],
      toName: ['', Validators.required],
      toAddress: ['', Validators.required],
      items: this.fb.array([this.createItem()]),
    });
    this.loading = false;
  }

  get fromDetails() {
    return this.invoiceForm?.get('fromDetails') as FormGroup;
  }

  get toDetails() {
    return this.invoiceForm?.get('toDetails') as FormGroup;
  }

  get items(): FormArray {
    return this.invoiceForm?.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotal(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const quantity = itemGroup.get('quantity')?.value || 0;
    const rate = itemGroup.get('rate')?.value || 0;
    const total = quantity * rate;

    itemGroup.get('total')?.setValue(total, { emitEvent: false });
  }

  onSubmit() {
    if (this.invoiceForm?.valid) {
      const invoiceData = this.invoiceForm.getRawValue();
      this.invoiceService.createInvoice(invoiceData).subscribe(() => {
        this.invoiceForm.reset();
        this.alert.showSuccess('Invoice created successfully');
      });
    } else {
      this.markFormGroupTouched(this.invoiceForm);
      this.alert.showError('Invalid Invoice Form');
    }
  }

  markFormGroupTouched(control: FormGroup | FormArray) {
    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach((childControl) => {
        if (
          childControl instanceof FormGroup ||
          childControl instanceof FormArray
        ) {
          this.markFormGroupTouched(childControl);
        } else {
          childControl.markAsTouched();
          childControl.markAsDirty();
        }
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach((childControl) => {
        if (
          childControl instanceof FormGroup ||
          childControl instanceof FormArray
        ) {
          this.markFormGroupTouched(childControl);
        } else {
          childControl.markAsTouched();
          childControl.markAsDirty();
        }
      });
    }
  }

  get fromName() {
    return this.invoiceForm?.get('fromName');
  }
  close() {
    this.ref.close();
  }

  disableForm() {
    Object.keys(this.invoiceForm.controls).forEach((key) => {
      this.invoiceForm.get(key)?.disable();
    });
  }

  onEdit() {
    if (this.invoiceForm?.valid && this.invoice?.id) {
      const invoiceData = this.invoiceForm.getRawValue();
      this.invoiceService
        .updateInvoice(this.invoice?.id, invoiceData)
        .subscribe(() => {
          this.close();
          this.alert.showSuccess('Invoice Updated successfully');
        });
    } else {
      this.alert.showError('Invalid Invoice Form');
    }
  }
}
