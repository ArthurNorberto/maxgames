import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-alterar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class ModalAlterarSenhaComponent {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  oldPwd = '';
  newPwd = '';
  confirmPwd = '';

  errorMessage = '';

  /** 🔹 Fecha ao apertar ESC */
  @HostListener('document:keydown.escape')
  onEsc() {
    this.close.emit();
  }

  /** 🔹 Clique no backdrop fecha */
  fecharAoClicarFora(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('overlay')) {
      this.close.emit();
    }
  }

  confirmar() {
    this.errorMessage = '';

    if (!this.oldPwd || !this.newPwd || !this.confirmPwd) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.newPwd.length < 4) {
      this.errorMessage = 'A nova senha deve ter no mínimo 4 caracteres.';
      return;
    }

    if (this.newPwd !== this.confirmPwd) {
      this.errorMessage = 'A confirmação não coincide com a nova senha.';
      return;
    }

    this.save.emit(this.newPwd);
  }
}
