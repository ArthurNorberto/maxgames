import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question, QuizService } from '../../../pages/games/services/quiz.service';
declare var bootstrap: any;

@Component({
    standalone: true,
    selector: 'app-quiz-config',
    templateUrl: './quiz-config.component.html',
    styleUrls: ['./quiz-config.component.scss'],
    imports: [CommonModule, FormsModule]
})
export class QuizConfigComponent {

    questions: Question[] = [];
    selectedQuestion: any = null;
    isNew = false;
    editingIndex: number | null = null;
    modalInstance: any;

    levels = ['Fácil', 'Médio', 'Difícil', 'Muito Difícil', 'Especialista'];

    constructor(private quizService: QuizService) { }

    ngOnInit() {
        this.questions = [...this.quizService.questions];

        setTimeout(() => {
            const modalEl = document.getElementById('quizModal');
            this.modalInstance = new bootstrap.Modal(modalEl, { backdrop: 'static' });
        });
    }


    openNewQuestion() {
        this.isNew = true;
        this.editingIndex = null;
        this.selectedQuestion = {
            question: '',
            options: [''],
            answer: '',
            hint: '',
            level: 'Fácil'
        };

        this.modalInstance.show();
    }

    editQuestion(q: Question) {
        this.isNew = false;
        this.editingIndex = this.quizService.questions.indexOf(q);
        this.selectedQuestion = JSON.parse(JSON.stringify(q));

        this.modalInstance.show();
    }

    closeModal() {
        this.modalInstance.hide();
        this.selectedQuestion = null;
        this.editingIndex = null;
    }

    save() {
        if (!this.selectedQuestion) return;

        // validações básicas
        const { question, options } = this.selectedQuestion;
        if (!question.trim()) { alert('Informe a pergunta'); return; }

        this.selectedQuestion.options = (options as string[]).map((o: string) => o.trim()).filter((o: string) => o.length);
        if (this.selectedQuestion.options.length < 2) {
            alert('Ao menos 2 opções.');
            return;
        }

        if (this.isNew) {
            this.quizService.questions.push(JSON.parse(JSON.stringify(this.selectedQuestion)));
        } else if (this.editingIndex !== null) {
            this.quizService.questions[this.editingIndex] = JSON.parse(JSON.stringify(this.selectedQuestion));
        }

        this.questions = [...this.quizService.questions];
        this.closeModal();
    }

    addOption() {
        this.selectedQuestion.options.push('');
    }

    removeOption(i: number) {
        this.selectedQuestion.options.splice(i, 1);
    }

    deleteQuestion(q: Question) {
        if (!confirm("Excluir pergunta?")) return;

        this.quizService.questions = this.quizService.questions.filter(x => x !== q);
        this.questions = [...this.quizService.questions];
    }
}
