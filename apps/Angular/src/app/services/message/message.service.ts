import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToasterMessageService {
  constructor(private readonly messageService: MessageService) {}

  showSuccess(message: string, title?: 'Success') {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
    });
  }

  showError(message: string, title?: 'Error') {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
    });
  }
}
