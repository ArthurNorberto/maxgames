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
        'CAPO',
        'RODA',
        'LANTERNA',
        "APÓLICE",
        "FRANQUIA",
        "SEGURADORA",
        "SINISTRO",
        "CORRETOR",
        "VIDRACARIA",
        "CALIBRAGEM",
        "ALINHAMENTO",
        "BALANCEAMENTO",
        "GUINCHO",
        "LATARIA",
        "CHASSI",
        "LICENCIAMENTO",
        "DOCUMENTACAO",
        "INSPECAO",
        "CRISTAL",
        "PELICULA",
        "DESPACHANTE",
        "OFICINA",
        "CLIENTE",
        "PARACHOQUE",
        "EMBREAGEM",
        "TRANSMISSAO",
        "VEICULO",
        "CONSERTOS",
        "REPARO",
        "POLIMENTO",
        "LIMPEZA",
        "VISTORIA",
        "APROVACAO",
        "ORCAMENTO",
        "ATENDIMENTO",
        "COTIZACAO",
        "REBOQUE",
        "AGENDAMENTO",
        "COBERTURA",
        "GARANTIA",
        "REVISAO",
        "MANUTENCAO",
        "PROTECAO"
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
