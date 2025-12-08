import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Comunidade {
    id: string;
    nome: string;
}



@Injectable({ providedIn: 'root' })
export class ComunidadesService {

    comunidades: Comunidade[] = [
        { id: '1', nome: 'Central de Atendimento' },
        { id: '2', nome: 'CIM' },
        { id: '3', nome: 'QA' },
        { id: '4', nome: 'Desenvolvimento' },
        { id: '5', nome: 'Administrador' }
    ];


    getComunidades(): Observable<Comunidade[]> {
        return of(this.comunidades);
    }
}
