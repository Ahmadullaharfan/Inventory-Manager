import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-dropzone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      <label class="text-sm font-medium text-gray-700">
        Product Image
      </label>

      <div
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
        [class.border-black]="dragging()"
        [class.bg-gray-50]="dragging()"
        class="relative w-full rounded-xl border-2 border-dashed border-gray-300
               transition-all duration-200 cursor-pointer
               hover:border-gray-400 hover:bg-gray-50/60
               aspect-[16/9] flex items-center justify-center overflow-hidden"
      >
        @if (previewUrl()) {
          <img
            [src]="previewUrl()!"
            alt="Preview"
            class="absolute inset-0 w-full h-full object-contain p-2"
          />

          <button
            type="button"
            (click)="clear($event)"
            class="absolute top-2 right-2 z-10
                   w-8 h-8 rounded-full bg-black/70 text-white
                   flex items-center justify-center
                   hover:bg-black transition-colors"
            aria-label="Remove image"
          >
            ✕
          </button>
        } @else {
          <div class="flex flex-col items-center gap-2 text-center px-4">
            <div
              class="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">
                Click to upload
                <span class="text-gray-500 font-normal">or drag & drop</span>
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          </div>
        }
      </div>

      <input
        #fileInput
        type="file"
        accept="image/*"
        class="hidden"
        (change)="onInputChange($event)"
      />
    </div>
  `,
})
export class ImageDropzoneComponent {
  @Input() previewUrl = signal<string | null>(null);
  @Output() fileSelected = new EventEmitter<File | null>();

  dragging = signal(false);

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.emit(file);
    }
  }

  onInputChange(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (file) this.emit(file);
  }

  clear(e: Event): void {
    e.stopPropagation();
    this.previewUrl.set(null);
    this.fileSelected.emit(null);
  }

  private emit(file: File): void {
    const url = URL.createObjectURL(file);
    this.previewUrl.set(url);
    this.fileSelected.emit(file);
  }
}