import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import { ConsultasService, PartidoDto, MarcadorDto } from '../../services/consultas.service';
type ViewMode = 'list' | 'detail';
import { ConfirmationService } from 'primeng/api'; 

@Component({
  selector: 'app-verpartidos',
  templateUrl: './verpartidos.component.html',
  styleUrls: ['./verpartidos.component.scss'],
  providers: [ConfirmationService]
})
export class VerpartidosComponent implements OnInit {
 
  @ViewChild('dt') dt!: Table;

  viewMode: ViewMode = 'list';

  totalQuarters = 4;     
  overtime = true;       

  partidos: PartidoDto[] = [];
  loading = false;

  formFiltros!: FormGroup;

  selected?: PartidoDto | null;
  marcadorLocal = 0;
  marcadorVisitante = 0;

  quarter = 1;           
  quarterMinutes = 10;  
  timeLeftSec = this.quarterMinutes * 60;
  running = false;
  private intervalId: any = null;

  constructor(
    private fb: FormBuilder,
    private svc: ConsultasService,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {
    this.formulario();
  }

  ngOnInit(): void {
    this.load();
  }

  formulario() {
    this.formFiltros = this.fb.group({
      startDate: [null],   
      endDate:   [null],   
      search:    ['']      
    });
  }

  load() {
    this.loading = true;

    const { startDate, endDate } = this.formFiltros.value;
    const startIso = startDate ? moment(startDate).toISOString() : undefined;
    const endIso   = endDate   ? moment(endDate).toISOString()   : undefined;

    this.svc.listPublicPartidos(startIso, endIso).subscribe({
      next: (data) => this.partidos = data ?? [],
      error: () => this.msg.add({severity:'error', summary:'Error', detail:'No se pudieron cargar los partidos'}),
      complete: () => this.loading = false
    });
  }

  resetFilters() {
    this.formFiltros.reset({ startDate: null, endDate: null, search: '' });
    if (this.dt) this.dt.clear();
    this.load();
  }

  goToList() {
    this.stopTimer();
    this.viewMode = 'list';
    this.selected = null;
  }

  openDetail(p: PartidoDto) {
    this.loading = true;
    this.svc.getPublicPartido(p.id).subscribe({
      next: (full) => {
        this.selected = full;
        this.marcadorLocal = full.marcadorLocal ?? 0;
        this.marcadorVisitante = full.marcadorVisitante ?? 0;

        this.quarter = 1;
        this.quarterMinutes = 10;
        this.timeLeftSec = this.quarterMinutes * 60;
        this.stopTimer();

        this.viewMode = 'detail';
      },
      error: () => this.msg.add({severity:'error', summary:'Error', detail:'No se pudo obtener el partido'}),
      complete: () => this.loading = false
    });
  }

  addPoints(team: 'L' | 'V', pts: number) {
    if (!this.selected) return;
    if (team === 'L') this.marcadorLocal = Math.max(0, this.marcadorLocal + pts);
    else this.marcadorVisitante = Math.max(0, this.marcadorVisitante + pts);
  }

startTimer() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => {
      if (this.timeLeftSec > 0) {
        this.timeLeftSec--;
      } else {
        this.onQuarterTimeUp(); 
      }
    }, 1000);
  }

  private onQuarterTimeUp() {
    this.stopTimer();

    if (this.quarter < this.totalQuarters) {
      this.confirm.confirm({
        header: 'Fin de cuarto',
        message: `Se terminó el ${this.quarter}º cuarto. ¿Pasar al ${this.quarter + 1}º cuarto?`,
        icon: 'pi pi-clock',
        acceptLabel: 'Siguiente cuarto',
        rejectLabel: 'Mantenerme aquí',
        accept: () => this.goNextQuarter(),
      });
    } else {
      this.msg.add({ severity: 'info', summary: 'Partido', detail: 'Se terminó el 4º cuarto. Guardando marcador…' });
      this.finalizeMatch(); // 👈 guarda y regresa/actualiza
    }
  }

  // ===== Navegación de cuartos =====
  requestNextQuarter() {
    if (this.quarter < this.totalQuarters) {
      this.confirm.confirm({
        header: 'Cambiar de cuarto',
        message: `¿Terminar el ${this.quarter}º cuarto y pasar al ${this.quarter + 1}º?`,
        icon: 'pi pi-step-forward',
        acceptLabel: 'Sí, continuar',
        rejectLabel: 'Cancelar',
        accept: () => this.goNextQuarter()
      });
    } else {
      this.confirm.confirm({
        header: 'Finalizar partido',
        message: 'Estás en el último cuarto. ¿Finalizar el partido y guardar el marcador?',
        icon: 'pi pi-flag',
        acceptLabel: 'Finalizar y guardar',
        rejectLabel: 'Cancelar',
        accept: () => this.finalizeMatch()
      });
    }
  }

  private goNextQuarter() {
    this.quarter++;
    this.resetTimer(); 
    this.msg.add({ severity: 'success', summary: 'Siguiente cuarto', detail: `Inicia ${this.quarter}º cuarto.` });
  }

  finalizeMatch() {
    if (!this.selected) return;

    const payload: MarcadorDto = {
      marcadorLocal: this.marcadorLocal,
      marcadorVisitante: this.marcadorVisitante
    };

    this.svc.updatePublicScore(this.selected.id, payload).subscribe({
      next: (txt) => {
        this.msg.add({ severity: 'success', summary: 'Partido finalizado', detail:  'Marcador guardado' });

        const idx = this.partidos.findIndex(x => x.id === this.selected!.id);
        if (idx >= 0) {
          this.partidos[idx] = {
            ...this.partidos[idx],
            marcadorLocal: this.marcadorLocal,
            marcadorVisitante: this.marcadorVisitante
          };
        }

        this.goToList();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el marcador final' })
    });
  }


  setQuarter(q: number) {
    if (q === this.quarter) return;
    const dir = q > this.quarter ? 'adelantar' : 'cambiar';
    this.confirm.confirm({
      header: 'Cambiar cuarto',
      message: `¿Deseas ${dir} al ${q}º cuarto?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => { this.quarter = q; this.resetTimer(); }
    });
  }

  pauseTimer() {
    this.stopTimer();
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeftSec = this.quarterMinutes * 60;
  }

  private stopTimer() {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setMinutesPerQuarter(min: number) {
    this.quarterMinutes = min;
    this.resetTimer();
  }

  saveScore() {
    if (!this.selected) return;

    const payload: MarcadorDto = {
      marcadorLocal: this.marcadorLocal,
      marcadorVisitante: this.marcadorVisitante
    };

    this.svc.updatePublicScore(this.selected.id, payload).subscribe({
      next: (txt) => {
        this.msg.add({severity:'success', summary:'Marcador', detail: 'Marcador actualizado'});
        const idx = this.partidos.findIndex(x => x.id === this.selected!.id);
        if (idx >= 0) {
          this.partidos[idx] = {
            ...this.partidos[idx],
            marcadorLocal: this.marcadorLocal,
            marcadorVisitante: this.marcadorVisitante
          };
        }
      },
      error: () => this.msg.add({severity:'error', summary:'Error', detail:'No se pudo actualizar el marcador'})
    });
  }

  fmtDate(s: string) {
    return moment(s).format('DD/MM/YYYY HH:mm');
  }
  onGlobalFilter(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.dt.filterGlobal(v, 'contains');
  }
  timeMMSS() {
    const m = Math.floor(this.timeLeftSec / 60);
    const s = Math.floor(this.timeLeftSec % 60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }
}
