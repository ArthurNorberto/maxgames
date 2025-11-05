import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ForcaService {
    private words = [
        'PNEU',
        'MOTOR',
        'VIDRO',
        'PARABRISA',
        'RETROVISOR',
        'FREIO',
        'BATERIA',
        'AIRBAG',
        'CINTA',
        'VOLANTE',
        'CARROCERIA',
        'AMORTECEDOR',
        'FAROL',
        'ESCAPAMENTO',
        'PORTA',
        'PAINEL',
        'CAPÔ',
        'RODA',
        'LANTERNA',
        "APÓLICE",
        "FRANQUIA",
        "SEGURADORA",
        "SINISTRO",
        "CORRETOR",
        "VIDRAÇARIA",
        "CALIBRAGEM",
        "ALINHAMENTO",
        "BALANCEAMENTO",
        "GUINCHO",
        "LATARIA",
        "CHASSI",
        "LICENCIAMENTO",
        "DOCUMENTAÇÃO",
        "INSPEÇÃO",
        "CRISTAL",
        "PELÍCULA",
        "DESPACHANTE",
        "OFICINA",
        "CLIENTE",
        "PARACHOQUE",
        "EMBREAGEM",
        "TRANSMISSÃO",
        "VEÍCULO",
        "CONSERTOS",
        "REPARO",
        "POLIMENTO",
        "LIMPEZA",
        "VISTORIA",
        "APROVAÇÃO",
        "ORÇAMENTO",
        "ATENDIMENTO",
        "COTIZAÇÃO",
        "REBOQUE",
        "AGENDAMENTO",
        "COBERTURA",
        "GARANTIA",
        "REVISÃO",
        "MANUTENÇÃO",
        "PROTEÇÃO"
    ];

    /** Retorna uma palavra aleatória em letras maiúsculas */
    getRandomWord(): string {
        const index = Math.floor(Math.random() * this.words.length);
        return this.words[index].toUpperCase();
    }

    /** Retorna todas as palavras (caso queira listar no futuro) */
    getAllWords(): string[] {
        return [...this.words];
    }
}
