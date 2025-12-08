import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Tribo {
    id: string;
    nome: string;
}


@Injectable({ providedIn: 'root' })
export class TribosService {

    tribos: Tribo[] = [
        { id: '1', nome: 'Porto' },
        { id: '2', nome: 'Bradesco' },
        { id: '3', nome: 'Azul' },
        { id: '4', nome: 'HDI' },
        { id: '5', nome: 'Allianz' },
        { id: '6', nome: 'Tokio' },
        { id: '7', nome: 'CIM' },
        { id: '8', nome: 'QA' },
        { id: '9', nome: 'Desenvolvimento' },
        { id: '10', nome: 'Administrador' }
    ];


    getTribos(): Observable<Tribo[]> {
        return of(this.tribos);
    }
}
