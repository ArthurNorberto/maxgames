import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AutowordleService {

    private words: string[] = [

        'VIDA', 'AUTO', 'PNEU', 'MOTO', 'FARO', 'LUVA', 'RODA', 'TETO', 'VELA',
        'EIXO', 'LONA', 'BICO', 'CHÃO', 'TALA', 'PARA',

        'VIDRO', 'RODAS', 'MOTOR', 'FREIO', 'PORTA', 'FAROL', 'PLACA', 'BANCO', 'TRAVA',
        'PINTA', 'LIMPA', 'CAMPO', 'CABOS', 'RETRO', 'EIXOS', 'PNEUS', 'LENTE',
        'VIDAS', 'NÍVEL', 'BOLAS',

        'CAMBIO', 'CARROS', 'BARRAS', 'FREIOS', 'SENSOR', 'ESCAPA', 'RODADO', 'POLIDO',
        'LANTAS', 'BATIDA', 'PAINEL', 'JANELA', 'MANUAL', 'CAPOTA', 'LAVADO', 'PORTAS', 'SEGURO', 'PARADO',

        'ALINHAR', 'POLIDOR', 'LIMPADOR', 'REBOQUE', 'CAPOTAS', 'ADESIVO', 'GARAGEM', 'SERVIÇO',
        'CLIENTE', 'VEÍCULO', 'REPARAR',

        'PARABRISA', 'SINISTRO', 'VISTORIA', 'CHASSIS', 'OFICINAS',
        'SEGURADO', 'ALINHADO', 'REPARADO', 'REVISÃO', 'GARANTIA', 'CONSERTO',
        'RETROVISOR', 'LANTERNAS', 'BATERIAS', 'VIDRACEIRO', 'CALIBRAR',
        'CLIENTES', 'CHAVE', 'BUJÃO', 'MANGUEIRA', 'CILINDRO', 'EMBREAGEM', 'CORRENTE', 'TUBO', 'PASTILHA', 'SUSPENSÃO',
        'AMORTECEDOR', 'ESCAPAMENTO', 'DIFERENCIAL', 'CABO', 'ENGRENAGEM', 'FILTRO', 'BORRACHA',
        'PONTEIRA', 'MOTORISTA',
        'ALAVANCA', 'CARREGADOR', 'ENGATE', 'RADIADOR', 'BUZINA', 'TAMPA', 'LAMINADO',
        'MATRÍCULA', 'CABINE', 'SUPORTE', 'FUSÍVEL', 'PNEUMÁTICO', 'MOTORCICLO', 'RETENTOR',
        'SILENCIOSO', 'CILINDROS', 'VELAS', 'IGNIÇÃO', 'TENSOR',

    ];


    constructor() { }


    getRandomWord(): string {
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        return word.toUpperCase();
    }
}
