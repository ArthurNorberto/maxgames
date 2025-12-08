import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Perfil {
    id: string;
    nome: string;
}



@Injectable({ providedIn: 'root' })
export class PerfisService {

    perfis: Perfil[] = [
        { id: '1', nome: 'Administrador' },
        { id: '2', nome: 'Liderança' },
        { id: '3', nome: 'Usuário' }
    ];


    getPerfis(): Observable<Perfil[]> {
        return of(this.perfis);
    }
}
