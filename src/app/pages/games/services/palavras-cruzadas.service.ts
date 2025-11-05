import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PalavrasCruzadasService {
    private palavras = [
        'VIDRO', 'CARRO', 'FREIO', 'PORTA', 'RODA', 'FAROL', 'MOTOR', 'CAPO',
        'RETROVISOR', 'BATERIA', 'SEGURO', 'APOLICE', 'SINISTRO', 'GUINCHO',
        'LATARIA', 'OFICINA', 'CLIENTE', 'CORRETOR', 'CRISTAL', 'SUSPENSAO',
        'ALINHAMENTO', 'BALANCEAMENTO', 'PELICULA', 'ATENDIMENTO', 'CHASSI',
        'DOCUMENTACAO', 'LICENCIAMENTO', 'MONITORAMENTO', 'CAMBIO', 'LATARIA',
        "PARABRISA",
        "AMORTECEDOR",
        "PARACHOQUE",
        "EMBREAGEM",
        "TRANSMISSAO",
        "POLIMENTO",
        "REVISAO",
        "VISTORIA",
        "GARANTIA",
        "REPARO",
        "ORCAMENTO",
        "CALIBRAGEM",
        "VELA",
        "OLEO",
        "ANTENA",
        "VOLANTE",
        "ALARME",
        "SENSOR",
        "PAINEL",
        "AIRBAG"

    ];

    getPalavras(): string[] {
        return [...this.palavras];
    }
}
