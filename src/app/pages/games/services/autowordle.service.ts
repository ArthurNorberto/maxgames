import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AutowordleService {

    private words: string[] = [

        'VIDA', 'AUTO', 'PNEU', 'MOTO', 'FARO', 'LUVA', 'RODA', 'TETO', 'VELA',
        'EIXO', 'LONA', 'TRIZ', 'LUZ', 'BICO', 'CHAO', 'TALA', 'PARA',


        'VIDRO', 'RODAS', 'MOTOR', 'FREIO', 'PORTA', 'FAROL', 'PLACA', 'BANCO', 'TRAVA',
        'PINTA', 'LIMPA', 'CAMPO', 'CABOS', 'RETRO', 'EIXOS', 'PNEUS', 'LENTE',
        'VIDAS', 'NIVEL', 'BOLAS', 'ESTER',


        'CAMBIO', 'CARROS', 'BARRAS', 'FREIOS', 'SENSOR', 'ESCAPA', 'RODADO', 'POLIDO',
        'LANTAS', 'BATIDA', 'LIMPAS', 'AMORTE', 'PAINEL', 'JANELA', 'MANUAL', 'CAPOTA', 'LAVADO', 'PORTAS', 'SEGURO', 'PARADO',


        'ALINHAR', 'POLIDOR', 'LIMPADOR', 'REBOQUE', 'CAPOTAS', 'ADESIVO', 'GARAGEM', 'SERVICO',
        'CLIENTE', 'VEICULO', 'REPARAR',


        'PARABRISA', 'SINISTRO', 'VISTORIA', 'CHASSIS', 'OFICINAS',
        'SEGURADO', 'ALINHADO', 'REPARADO', 'REVISAO', 'GARANTIA', 'CONSERTO',
        'RETROVISOR', 'LANTERNAS', 'BATERIAS', 'VIDRACEIRO', 'CALIBRAR',
        'CLIENTES'
    ];

    constructor() { }


    getRandomWord(): string {
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        return word.toUpperCase();
    }
}
