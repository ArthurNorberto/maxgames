import { Injectable } from '@angular/core';

export interface PerguntaAcerteOuErre {
    palavra: string;
    pergunta: string;
    level: 'Fácil' | 'Médio' | 'Difícil' | 'Muito Difícil' | 'Especialista';
}

@Injectable({
    providedIn: 'root'
})
export class AcerteOuErreService {
    private palavras: PerguntaAcerteOuErre[] = [
        { palavra: 'PNEU', pergunta: 'Peça circular que envolve a roda.', level: 'Fácil' },
        { palavra: 'PORTA', pergunta: 'Acesso lateral ao veículo.', level: 'Fácil' },
        { palavra: 'FAROL', pergunta: 'Ilumina a pista à noite.', level: 'Fácil' },
        { palavra: 'FREIO', pergunta: 'Sistema responsável por parar o veículo.', level: 'Fácil' },
        { palavra: 'CAPO', pergunta: 'Parte frontal que cobre o motor.', level: 'Fácil' },
        { palavra: 'MOTOR', pergunta: 'Coração mecânico do carro.', level: 'Fácil' },
        { palavra: 'RETROVISOR', pergunta: 'Peça usada para visualizar carros atrás de você.', level: 'Médio' },
        { palavra: 'BATERIA', pergunta: 'Fornece energia elétrica ao veículo.', level: 'Médio' },
        { palavra: 'PARABRISA', pergunta: 'Vidro frontal do veículo.', level: 'Médio' },
        { palavra: 'LATARIA', pergunta: 'Carcaça externa do carro.', level: 'Médio' },
        { palavra: 'TRAVA', pergunta: 'Sistema de segurança contra abertura.', level: 'Médio' },
        { palavra: 'GUINCHO', pergunta: 'Usado para rebocar veículos avariados.', level: 'Médio' },
        { palavra: 'CAMBIO', pergunta: 'Transmissão que muda as marchas.', level: 'Difícil' },
        { palavra: 'CHASSI', pergunta: 'Estrutura principal do veículo.', level: 'Difícil' },
        { palavra: 'SUSPENSAO', pergunta: 'Sistema que absorve impactos.', level: 'Difícil' },
        { palavra: 'OFICINA', pergunta: 'Local onde veículos são reparados.', level: 'Difícil' },
        { palavra: 'SEGURO', pergunta: 'Protege financeiramente o veículo.', level: 'Muito Difícil' },
        { palavra: 'SINISTRO', pergunta: 'Evento que causa acionamento do seguro.', level: 'Muito Difícil' },
        { palavra: 'CORRETOR', pergunta: 'Intermediário entre cliente e seguradora.', level: 'Muito Difícil' },
        { palavra: 'CRISTAL', pergunta: 'Material usado em vidros automotivos.', level: 'Especialista' },
        { palavra: 'PARACHOQUE', pergunta: 'Peça que absorve impactos frontais ou traseiros do veículo.', level: 'Fácil' },
        { palavra: 'LANTERNA', pergunta: 'Conjunto de luzes externas traseiras do carro.', level: 'Fácil' },
        { palavra: 'PISO DE BORRACHA', pergunta: 'Elemento colocado no chão do veículo para proteção/limpeza.', level: 'Médio' },
        { palavra: 'ALAVANCA DE MARCHAS', pergunta: 'Comando usado para mudar as marchas de transmissão manual.', level: 'Médio' },
        { palavra: 'ESPIRAL DE SPRING', pergunta: 'Mola helicoidal usada no sistema de suspensão.', level: 'Médio' },

        { palavra: 'VIDRO LATERAL', pergunta: 'Vidro que protege as portas laterais do veículo.', level: 'Médio' },
        { palavra: 'SENSOR DE ESTACIONAMENTO', pergunta: 'Dispositivo que ajuda a estimar distância entre o veículo e obstáculos.', level: 'Médio' },
        { palavra: 'CALIBRAGEM ADAS', pergunta: 'Procedimento de alinhamento de câmeras e sensores avançados de direção.', level: 'Médio' },
        { palavra: 'SERVIÇO SRA', pergunta: 'Técnica da Autoglass para disfarçar arranhões sem repintura. ', level: 'Médio' },
        { palavra: 'APÓLICE DE SEGURO AUTO', pergunta: 'Contrato que garante cobertura de danos ao veículo mediante prêmio.', level: 'Médio' },

        { palavra: 'FRANQUIA REDUZIDA', pergunta: 'Valor fixo que o segurado paga antes da seguradora assumir o sinistro.', level: 'Difícil' },
        { palavra: 'VIDRO LAMINADO AUTOMOTIVO', pergunta: 'Vidro que mantém fragmentos quando quebrado e é usado em para-brisas premium.', level: 'Difícil' },
        { palavra: 'ASSISTÊNCIA 24H MAXPAR', pergunta: 'Serviço de atendimento emergencial oferecido pelo Maxpar para frotas e segurados.', level: 'Difícil' },
        { palavra: 'COBERTURA DE ROUBO E FURTO', pergunta: 'Cláusula do seguro que protege contra subtração do veículo ou componentes.', level: 'Difícil' },
        { palavra: 'SISTEMA DE RETENÇÃO DE PASSAGEIROS', pergunta: 'Componentes como cintos e air-bags que garantem segurança de ocupantes.', level: 'Difícil' },

        { palavra: 'RESPONSABILIDADE CIVIL TERCEIROS', pergunta: 'Cobertura do seguro que protege contra danos causados a terceiros.', level: 'Muito Difícil' },
        { palavra: 'BÔNUS DE SEGURO AUTOMÓVEL', pergunta: 'Desconto obtido por tempo sem sinistro na apólice de seguro auto.', level: 'Muito Difícil' },
        { palavra: 'REPARO DE LATARIA PREMIUM', pergunta: 'Serviço especial da Autoglass para funilaria e pintura de veículos importados.', level: 'Muito Difícil' },
        { palavra: 'RESÍDUO DE COLISÃO', pergunta: 'Material resultante de acidente que exige descarte ou reforma certificada.', level: 'Muito Difícil' },
        { palavra: 'SINISTRO TOTAL APÓS AVARIA', pergunta: 'Quando o custo de reparo excede percentual da seguradora e o veículo é considerado perda.', level: 'Muito Difícil' },

        { palavra: 'SISTEMA ADAS CALIBRAGEM', pergunta: 'Procedimento técnico de calibração de câmeras e radares em veículos modernos.', level: 'Especialista' },
        { palavra: 'VIDRO MULTICAMADA COM PVB', pergunta: 'Vidro automotivo com camada intermediária de polímero para segurança acústica e fragmentação controlada.', level: 'Especialista' },
        { palavra: 'GESTÃO DE FROTA CORPORATIVA MAXPAR', pergunta: 'Serviço de terceirização de processos e manutenção para frotas gerenciadas pela Maxpar.', level: 'Especialista' },
        { palavra: 'ANÁLISE FORENSE DE SINISTROS AUTOMOTIVOS', pergunta: 'Método técnico de investigação de causas e responsabilidades em acidentes elegíveis ao seguro.', level: 'Especialista' },
        { palavra: 'TECBOND DE VIDROS AUTOMOTIVOS', pergunta: 'Adesivo estrutural utilizado na fixação de para-brisas em veículos modernos com sensores.', level: 'Especialista' },
        { palavra: 'ALINHAMENTO', pergunta: 'Serviço que ajusta a geometria das rodas para garantir desgaste uniforme.', level: 'Fácil' },
        { palavra: 'LIMPADOR DE PARA-BRISA', pergunta: 'Aparelho que limpa o vidro frontal do veículo durante chuva.', level: 'Médio' },
        { palavra: 'RETROVISOR INTERNO', pergunta: 'Espelho localizado dentro do veículo para visualizar a parte de trás.', level: 'Médio' },
        { palavra: 'TAMPA DE COMBUSTÍVEL', pergunta: 'Abertura externa onde se coloca combustível no veículo.', level: 'Médio' },
        { palavra: 'CHAVE DE RODAS', pergunta: 'Ferramenta usada para soltar ou apertar parafusos das rodas.', level: 'Médio' },

        { palavra: 'VIDRO TRASEIRO', pergunta: 'Vidro localizado na parte de trás do veículo, também chamado de luneta.', level: 'Médio' },
        { palavra: 'TECNOLOGIA ADAS', pergunta: 'Sistema de assistência avançada ao motorista com câmeras e sensores.', level: 'Médio' },
        { palavra: 'CINTOS DE SEGURANÇA', pergunta: 'Equipamento obrigatório que prende ocupantes ao assento em caso de impacto.', level: 'Médio' },
        { palavra: 'SERVIÇO DE CALIBRAGEM DE SENSORES', pergunta: 'Procedimento pós-substituição de vidro para ajustar sensores automotivos.', level: 'Médio' },
        { palavra: 'CARTÃO DE ASSISTÊNCIA 24H', pergunta: 'Serviço de emergência rodoviária para segurado ou frota contratado via Maxpar.', level: 'Médio' },

        { palavra: 'FRANQUIA DEVIDA', pergunta: 'Valor que o segurado deverá pagar antes da seguradora assumir a cobertura.', level: 'Difícil' },
        { palavra: 'VIDRO LAMINADO NIVEL ORO', pergunta: 'Vidro premium usado pela Autoglass com maior proteção acústica e de fragmentação.', level: 'Difícil' },
        { palavra: 'GESTÃO DE REPAROS DE FROTA', pergunta: 'Serviço corporativo da Maxpar que gerencia desde sinistro até reparo e aprovação.', level: 'Difícil' },
        { palavra: 'COBERTURA DE ALAGAMENTO', pergunta: 'Cláusula de seguro que cobre danos ao veículo por enchente ou inundação.', level: 'Difícil' },
        { palavra: 'SISTEMA DE IMOBILIZAÇÃO ELETRÔNICA', pergunta: 'Mecanismo que impede a partida do veículo em caso de furto não autorizado.', level: 'Difícil' },

        { palavra: 'RESPONSABILIDADE CIVIL FACULTATIVA', pergunta: 'Cobertura de seguro que protege contra danos causados a terceiros pelo veículo segurado.', level: 'Muito Difícil' },
        { palavra: 'BONIFICAÇÃO SEM SINISTRO', pergunta: 'Desconto aplicado ao segurado que não registra sinistro em determinado período.', level: 'Muito Difícil' },
        { palavra: 'REPARO ESTRUTURAL CERTIFICADO', pergunta: 'Tipo de reparo exigido por seguradora para que veículo volte à circulação após sinistro grave.', level: 'Muito Difícil' },
        { palavra: 'SINISTRO RECORRENTE DE VIDRO', pergunta: 'Situação em que o veículo tem múltiplas quebras de vidro e pode impactar apólice.', level: 'Muito Difícil' },
        { palavra: 'CERTIFICAÇÃO INMETRO AUTOMOTIVA', pergunta: 'Homologação obrigatória de componentes automotivos para venda no Brasil.', level: 'Muito Difícil' },

        { palavra: 'CALIBRAGEM DE CÂMERAS ADAS', pergunta: 'Procedimento técnico exigido após substituição de para-brisa em veículos com sistemas de segurança ativos.', level: 'Especialista' },
        { palavra: 'VIDRO MULTICAMADA COM PVB', pergunta: 'Vidro automotivo que usa polímero interno para retenção de fragmentos e melhor isolamento acústico.', level: 'Especialista' },
        { palavra: 'ANÁLISE FORENSE DE SINISTRO AUTOMOTIVO', pergunta: 'Investigação especializada para determinar causa, responsabilidade e sequência de evento de sinistro.', level: 'Especialista' },
        { palavra: 'GESTÃO DE RISCO DE FROTA CORPORATIVA', pergunta: 'Serviço completo da Maxpar que monitora, analisa e previne eventos em frotas empresariais.', level: 'Especialista' },
        { palavra: 'REPARO DE VIDROS AUTOMOTIVOS POR LASER', pergunta: 'Técnica avançada de reparo de micro-trincas no vidro sem troca completa.', level: 'Especialista' },

        { palavra: 'RADIADOR', pergunta: 'Componente que ajuda a refrigerar o motor do veículo.', level: 'Fácil' },
        { palavra: 'ESCAPAMENTO', pergunta: 'Tubulação que conduz os gases de combustão para fora do veículo.', level: 'Fácil' },
        { palavra: 'VELA', pergunta: 'Peça que provoca a ignição da mistura combustível-ar no motor.', level: 'Fácil' },
        { palavra: 'BICO', pergunta: 'Componente que injeta combustível diretamente no cilindro ou porta.', level: 'Fácil' },
        { palavra: 'CORREIA', pergunta: 'Cinta que transmite movimento entre polias no motor ou acessórios.', level: 'Fácil' },

        { palavra: 'IMOBILIZADOR', pergunta: 'Sistema eletrônico que impede o funcionamento do motor sem chave autorizada.', level: 'Médio' },
        { palavra: 'AIRBAG', pergunta: 'Bolsa de ar que infla para proteger ocupantes em colisão.', level: 'Médio' },
        { palavra: 'VIDRO TRIPLEX', pergunta: 'Vidro automotivo composto por camadas para maior segurança.', level: 'Médio' },
        { palavra: 'APÓLICE RESIDENCIAL', pergunta: 'Contrato de seguro que protege bens de moradia contra diversos riscos.', level: 'Médio' },
        { palavra: 'SERVIÇO DE REBOQUE', pergunta: 'Atendimento que transporta veículo avariado até oficina ou destino definido.', level: 'Médio' },

        { palavra: 'CLAUSULA DE FRANQUIA', pergunta: 'Termo de seguro que define quanto o segurado pagará em sinistro.', level: 'Difícil' },
        { palavra: 'VIDRO COMPÓSITO', pergunta: 'Vidro que combina camadas de diferentes materiais para resistência extra.', level: 'Difícil' },
        { palavra: 'GESTÃO DE SINISTROS', pergunta: 'Processo de atendimento, avaliação e liquidação de sinistro para seguradora.', level: 'Difícil' },
        { palavra: 'COBERTURA PLENA', pergunta: 'Seguro que protege quase todos os riscos especificados para o veículo.', level: 'Difícil' },
        { palavra: 'ALINHAMENTO DE SENSORES', pergunta: 'Procedimento que ajusta sensores após impacto ou substituição de componente.', level: 'Difícil' },

        { palavra: 'QSA (QUANTIDADE SUBSTÂNCIA AMINA)', pergunta: 'Termo técnico de seguro que regula exposição ambiental em frota.', level: 'Muito Difícil' },
        { palavra: 'SISTEMA DE GOVERNANÇA ERROS', pergunta: 'Processo de controle interno da seguradora que evita fraudes em frota.', level: 'Muito Difícil' },
        { palavra: 'REPARO ESTRUTURAL AVANÇADO', pergunta: 'Tipo de reparo que exige soldagem, alinhamento e certificação pós-acidente.', level: 'Muito Difícil' },
        { palavra: 'AVALIAÇÃO PERICIAL DE VIDROS', pergunta: 'Inspeção técnica que verifica integridade e substituição correta de vidros automotivos.', level: 'Muito Difícil' },
        { palavra: 'SERVIÇO DE FLUXO DE FROTAS CORPORATIVAS', pergunta: 'Modelo de gestão que integra manutenção, seguro e operações para frota de clientes altos.', level: 'Muito Difícil' },

        { palavra: 'MODELO DE RISCO ACTUARIAL FROTA', pergunta: 'Sistema estatístico complexo que calcula prêmio de seguro para frota com base em dados telemáticos.', level: 'Especialista' },
        { palavra: 'VIDRO INTELIGENTE COM SENSORADASADAS', pergunta: 'Vidro que integra sensores ADAS, HUD e comunicações veiculares em único módulo.', level: 'Especialista' },
        { palavra: 'INTEGRAÇÃO API INSURETECH', pergunta: 'Conexão técnica entre seguradora, corretora e telemetria para automação de sinistros.', level: 'Especialista' },
        { palavra: 'ARQUITETURA DE CYBER-RISCO AUTOMOTIVO', pergunta: 'Estrutura de defesa cibernética que protege veículos conectados contra ataques.', level: 'Especialista' },
        { palavra: 'CERTIFICAÇÃO ISO 9001 REPARO AUTOMOTIVO', pergunta: 'Avaliação formal de qualidade que oficinas e serviços de reparo necessitam para garantia premium.', level: 'Especialista' },

        { palavra: 'LÂMPADA', pergunta: 'Fonte de luz utilizada nos faróis ou em sinais do veículo.', level: 'Fácil' },
        { palavra: 'BORRACHA', pergunta: 'Material flexível usado em juntas ou selagens de veículos.', level: 'Fácil' },
        { palavra: 'FUSÍVEL', pergunta: 'Componente elétrico que “queima” para proteger o circuito do veículo.', level: 'Fácil' },
        { palavra: 'CATALISADOR', pergunta: 'Componente do sistema de escapamento que reduz emissões de poluentes.', level: 'Fácil' },
        { palavra: 'RETROVISOR EXTERNO', pergunta: 'Espelho localizado na lateral externa do veículo para melhor visibilidade.', level: 'Médio' },

        { palavra: 'DIAGNÓSTICO AUTOMOTIVO', pergunta: 'Procedimento que identifica falhas eletrônicas ou mecânicas no veículo.', level: 'Médio' },
        { palavra: 'LUBRIFICANTE PREMIUM', pergunta: 'Óleo de motor de alta performance usado em veículos modernos.', level: 'Médio' },
        { palavra: 'VIDRO TRIPLEX ULTRA', pergunta: 'Vidro de segurança automotivo com múltiplas camadas especiais.', level: 'Médio' },
        { palavra: 'SERVIÇO DE ESTETICISTA AUTOMOTIVO', pergunta: 'Recurso da Autoglass que trata imperfeições estéticas em veículos de luxo.', level: 'Médio' },
        { palavra: 'CARTÃO ROUBO E FURTO', pergunta: 'Serviço de bloqueio + rastreamento em caso de roubo do veículo segurado.', level: 'Médio' },

        { palavra: 'MARCAÇÃO DE CHASSI', pergunta: 'Processo de gravação do número de identificação no veículo para rastreabilidade.', level: 'Difícil' },
        { palavra: 'VIDRO CERÂMICO AUTOMOTIVO', pergunta: 'Vidro com tecnologia cerâmica para isolamento térmico e acústico.', level: 'Difícil' },
        { palavra: 'GESTÃO DE SINISTRO DE FROTA', pergunta: 'Sistema corporativo que monitora, abre e gere sinistros de veículos em frota.', level: 'Difícil' },
        { palavra: 'COBERTURA DE DANOS CONTRA TERCEIROS', pergunta: 'Cláusula de seguro que cobre danos materiais ou pessoais que você cause a outros.', level: 'Difícil' },
        { palavra: 'SENSOR DE CHOQUE AUTOMOTIVO', pergunta: 'Dispositivo que detecta impacto e ativa airbags ou bloqueios.', level: 'Difícil' },

        { palavra: 'INDENIZAÇÃO PROPORCIONAL', pergunta: 'Forma de pagamento de sinistro que leva em conta depreciação do bem.', level: 'Muito Difícil' },
        { palavra: 'COBERTURA DE DANOS MORAIS AUTOMOTIVOS', pergunta: 'Proteção em apólice que cobre danos à reputação ou moral de terceiros após colisão.', level: 'Muito Difícil' },
        { palavra: 'REPARO ESTRUTURAL CERTIFICADO IATF', pergunta: 'Reparo que segue padrões internacionais de qualidade após sinistro grave.', level: 'Muito Difícil' },
        { palavra: 'SINISTRO CATASTRÓFICO DE FROTA', pergunta: 'Evento que afeta mais de 50% de uma frota e envolve seguro especial.', level: 'Muito Difícil' },
        { palavra: 'FLUXO DE AUTOMAÇÃO DE TELEMÁTICA', pergunta: 'Sistema que integra dados de veículos para cálculo de prêmio e prevenção de sinistro.', level: 'Muito Difícil' },

        { palavra: 'ALGORITMO DE RISCO TELEMATICS', pergunta: 'Cálculo matemático que avalia comportamento de condução para seguros de frota.', level: 'Especialista' },
        { palavra: 'VIDRO COM CAMADA DE PLÁSTICO E METALISADO', pergunta: 'Vidro automotivo avançado que inclui camada refletiva para calor e som.', level: 'Especialista' },
        { palavra: 'MECANISMO DE FUSÃO DE DADOS INSURETECH', pergunta: 'Integração de dados de segurados, veículos e comportamentos para modelagem de risco.', level: 'Especialista' },
        { palavra: 'GESTÃO DE RENTABILIDADE DE FROTAS', pergunta: 'Processo avançado que maximiza lucro e reduz custos em operações de frota segurada.', level: 'Especialista' },
        { palavra: 'HOMOLOGAÇÃO DE REPAROS DIGITAIS', pergunta: 'Certificação técnica para reparos documentados digitalmente em oficinas parceiras.', level: 'Especialista' },
        { palavra: 'COMPONENTE ADAS INTEGRADO AO VIDRO', pergunta: 'Módulo que combina câmera, sensor e HUD embutido no para-brisa.', level: 'Especialista' },
        { palavra: 'SISTEMA DE RECONHECIMENTO DE PLACA PARA FROTA', pergunta: 'Tecnologia usada para rastrear e monitorar veículos de frota em tempo real.', level: 'Especialista' },
        { palavra: 'PLANO DE CONTINUIDADE DE NEGÓCIOS FROTA', pergunta: 'Estratégia corporativa para garantir operação contínua de frota em eventos adversos.', level: 'Especialista' },
        { palavra: 'APLICAÇÃO DE FILME ANTI-GRAVIDADE EM VIDROS', pergunta: 'Revestimento especial que impede trincas em para-brisas de veículos premium.', level: 'Especialista' },
        { palavra: 'CERTIFICAÇÃO ISO 27001 PARA DADOS DE FROTA', pergunta: 'Padrão internacional para segurança da informação em gestão de frotas conectadas.', level: 'Especialista' },
    ];

    getAll(): PerguntaAcerteOuErre[] {
        return [...this.palavras];
    }
}
