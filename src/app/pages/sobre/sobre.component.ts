import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginService } from '../../pages/services/login.service';

type MetricKeys = 'colaboradores' | 'questoes' | 'horasPorMes';

interface Metric {
  label: string;
  value: number;
  target: number;
}

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss']
})
export class SobreComponent implements OnInit, AfterViewInit, OnDestroy {
  user: any = null;
  readonly Object = Object;

  metrics: Record<MetricKeys, Metric> = {
    colaboradores: { label: 'Colaboradores engajados', value: 0, target: 1200 },
    questoes: { label: 'Perguntas disponíveis', value: 0, target: 450 },
    horasPorMes: { label: 'Horas/gamificação por mês (estim.)', value: 0, target: 3200 }
  };

  getMetric(key: MetricKeys): Metric {
    return this.metrics[key];
  }


  get metricKeys(): MetricKeys[] {
    return Object.keys(this.metrics) as MetricKeys[];
  }

  features = [
    {
      title: 'Aprendizado orientado por trabalho',
      text: `Conteúdos e perguntas criadas para alinhar diretamente com os papéis da Autoglass: atendimento, operação de oficinas, vendas e gestão de frotas.`,
      icon: 'shield'
    },
    {
      title: 'Segurança e retenção interna',
      text: `Ao substituir jogos de terceiros (ex.: sites de Flash) por uma plataforma corporativa, reduzimos risco de segurança, fuga de navegação e exposição a conteúdos não controlados.`,
      icon: 'lock'
    },
    {
      title: 'Mecânicas que geram hábito',
      text: `Níveis, streaks, ranking interno e micro-recompensas — projetados para aumentar engajamento diário e melhorar KPIs de atendimento com micro-learning contínuo.`,
      icon: 'spark'
    },
    {
      title: 'Medição e integração',
      text: `Métricas acionáveis prontas para exportar via API para dashboards e programas de desenvolvimento de pessoas.`,
      icon: 'chart'
    },
    {
      title: 'Escalável e modular',
      text: `Arquitetura pensada para facilmente receber conteúdo via CMS/API e integrar novos módulos.`,
      icon: 'plug'
    },
    {
      title: 'Local-first, cloud-ready',
      text: `Os jogos rodam localmente na intranet (latência mínima) e sincronizam pontuações com backend — ótima experiência mesmo com baixa conectividade.`,
      icon: 'cloud'
    }
  ];

  private rafs: number[] = [];

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    try {
      this.user = this.loginService.getUser() ?? null;
    } catch {
      this.user = null;
    }
  }

  ngAfterViewInit(): void {
    this.startCounters();
  }

  ngOnDestroy(): void {
    this.rafs.forEach(id => cancelAnimationFrame(id));
  }

  goTo(path: string) {
    this.router.navigateByUrl(path);
  }

  private startCounters() {
    (Object.keys(this.metrics) as MetricKeys[]).forEach(key => {
      const metric = this.metrics[key];
      const duration = 1400 + Math.random() * 800;
      const start = performance.now();
      const from = 0;
      const to = metric.target;

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        metric.value = Math.round(from + (to - from) * ease);
        if (t < 1) this.rafs.push(requestAnimationFrame(step));
      };

      this.rafs.push(requestAnimationFrame(step));
    });
  }

  getIconSvg(name: string) {
    const icons: Record<string, string> = {
      shield: `<svg viewBox="0 0 24 24"><path d="M12 2l7 3v5c0 5-3.5 9.7-7 12-3.5-2.3-7-7-7-12V5l7-3z"/></svg>`,
      lock: `<svg viewBox="0 0 24 24"><path d="M6 10v10h12V10H6zm6-6a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3z"/></svg>`,
      spark: `<svg viewBox="0 0 24 24"><path d="M12 2l1.8 4.6L18.8 8 14 11l1.8 4.6L12 14l-3.8 1.6L10 11 5.2 8 10.2 6.6 12 2z"/></svg>`,
      chart: `<svg viewBox="0 0 24 24"><path d="M3 3v18h18v-2H5V3H3zm8 6h2v9h-2V9zm4-4h2v13h-2V5zM7 11h2v7H7v-7z"/></svg>`,
      plug: `<svg viewBox="0 0 24 24"><path d="M7 2v6h10V2h2v6a4 4 0 0 1-8 0H9a4 4 0 0 1-8 0V2h6zM3 14v6h18v-6H3z"/></svg>`,
      cloud: `<svg viewBox="0 0 24 24"><path d="M19 18H6a4 4 0 1 1 .3-7.99A6 6 0 1 1 19 18z"/></svg>`
    };
    return icons[name] ?? `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;
  }
}
