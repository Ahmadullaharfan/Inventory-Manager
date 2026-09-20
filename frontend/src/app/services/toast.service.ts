import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private containerId = 'toast-container';

  success(title: string, message: string): void {
    this.show('success', title, message);
  }

  error(title: string, message: string): void {
    this.show('error', title, message);
  }

  info(title: string, message: string): void {
    this.show('info', title, message);
  }

  warning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  private show(type: ToastType, title: string, message: string): void {
    const container = this.ensureContainer();
    const toast = document.createElement('div');
    const safeTitle = this.escapeHtml(title);
    const safeMessage = this.escapeHtml(message);

    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="toast-title">${safeTitle}</div>
      <div class="toast-message">${safeMessage}</div>
      <button type="button" class="toast-close-button" aria-label="Close">&times;</button>
    `;

    const closeButton = toast.querySelector('.toast-close-button');
    closeButton?.addEventListener('click', () => this.dismiss(toast));

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    window.setTimeout(() => this.dismiss(toast), 5000);
  }

  private dismiss(element: HTMLElement): void {
    if (!element || !element.parentNode) {
      return;
    }

    element.classList.remove('show');
    window.setTimeout(() => {
      element.remove();
      if (!this.containerHasVisibleToasts()) {
        const container = document.getElementById(this.containerId);
        container?.remove();
      }
    }, 250);
  }

  private ensureContainer(): HTMLDivElement {
    let container = document.getElementById(this.containerId) as HTMLDivElement | null;

    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'toast-top-right';
      document.body.appendChild(container);
    }

    return container;
  }

  private containerHasVisibleToasts(): boolean {
    const container = document.getElementById(this.containerId);
    return !!container && container.querySelector('.toast') !== null;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
