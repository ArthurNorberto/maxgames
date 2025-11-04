import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MemoriaService {

    private readonly todasPalavras: string[] = [
        'Parabrisa', 'Farol', 'Lanterna', 'Retrovisor', 'Para-choque',
        'ADAS', 'Airbag', 'Rodas', 'Pneu', 'Sensor de Estacionamento',
        'Limpador', 'Câmera Traseira', 'Banco', 'Cinto de Segurança',
        'Capô', 'Painel', 'Volante', 'Freio', 'Escapamento', 'Radiador',
        'Bateria', 'Filtro de Ar', 'Filtro de Óleo', 'Amortecedor', 'Mola',
        'Vidro Lateral', 'Trava Eletrônica', 'Sensor de Luz', 'Retrovisor Interno',
        'Farol de Neblina', 'Teto Solar', 'Catalisador', 'Painel de LED',
        'Porta', 'Airbag Lateral', 'Vidro Traseiro', 'Carroceria', 'Para-lama',
        'GPS', 'Alarme', 'Computador de Bordo', 'Direção Elétrica',
        'Embreagem', 'Cambio', 'Refrigeração', 'ABS', 'Suspensão', 'Rádio',
        'Som Automotivo', 'Câmbio Automático', 'Farol Principal', 'Motor', 'Sinistro',
        'Apólice',
        'Corretor',
        'Indenização',
        'Franquia',
        'Cobertura',
        'Assistência',
        'Oficina Credenciada',
        'Guincho',
        'Reparo',
        'Laudo',
        'Perícia',
        'Cristal',
        'Blindagem',
        'Chassi',
        'Licenciamento',
        'Documentação',
        'Renovação',
        'Protetor Solar',
        'Película',
        'Inspeção',
        'Serviço Autoglass',
        'Maxpar',
        'Atendimento',
        'Central de Serviços',
        'Cliente',
        'Vistoria',
        'Proteção Veicular',
        'Garantia',
        'Regulador'

    ];

    /**
     * Retorna uma lista aleatória de palavras distintas
     * @param quantidade número de palavras desejadas
     */
    getPalavrasAleatorias(quantidade: number): string[] {
        const embaralhadas = [...this.todasPalavras].sort(() => Math.random() - 0.5);
        return embaralhadas.slice(0, quantidade);
    }
}
