import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacaPalavrasService {

    private todasPalavras: string[] = [
        'VIDRO', 'RODAS', 'MOTOR', 'FREIO', 'BANCO', 'PORTA', 'PARABRISA',
        'RETROVISOR', 'LANTERNA', 'ALINHAMENTO', 'BALANCEAMENTO', 'CAPOTAS',
        'CAMBIO', 'EMBREAGEM', 'SUSPENSAO', 'PNEU', 'AIRBAG', 'BATERIA',
        'POLIMENTO', 'LIMPADOR', 'SEGURO', 'CARRO', 'AUTOGLASS', 'OFICINA',
        'REVISAO', 'OLEO', 'ESCAPAMENTO', 'AMORTECEDOR', 'ESTEPE', 'PAINEL',
        'LATARIA', 'GUINCHO', 'SINISTRO', 'APOLICE', 'FRANQUIA', 'COBERTURA',
        'CONDUTOR', 'CLIENTE', 'ASSISTENCIA', 'CORRETOR', 'VEICULO', 'SERVICO',
        'REPARO', 'GARANTIA', 'DANO', 'COLISAO', 'PROTECAO', 'MAXPAR',
        'INSPECAO', 'CHASSI', 'DOCUMENTO', 'LICENCIAMENTO', 'REGULADOR', 'OFICIAL',
        'ATENDIMENTO', 'CADASTRO', 'VISTORIA', 'TRANSPORTE', 'SEGURADORA', 'SINISTRO',
        'BLOQUEADOR', 'ALERTA', 'RASTREADOR', 'MONITORAMENTO', 'SEGURADO', 'FROTA',
        'REBOQUE', 'DESPACHANTE', 'COTACAO', 'PREMIO', 'RENOVACAO', 'COBERTOR',
        'ORCAMENTO', 'LIMITE', 'SINISTRADO', 'TELEMETRIA', 'PERITO', 'PORTAL',
        'CENTRAL', 'CREDENCIADO'
    ];


    getPalavras(): string[] {
        return this.todasPalavras;
    }


    getPalavrasAleatorias(n: number): string[] {
        const shuffled = [...this.todasPalavras].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
    }
}
