import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import {
  ConsultasService,
  EquipoDto, JugadorDto, MarcadorDto, PartidoDto, PartidoUpsert
} from '../../services/consultas.service';
import moment from 'moment';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.scss'],   // 👈 plural
  providers: [ConfirmationService]
})
export class PartidosComponent implements OnInit {   // 👈 implement OnInit

  @ViewChild('dt') dt!: Table;
currentPartido: PartidoDto | null = null;

  // tabla
  partidos: PartidoDto[] = [];   // 👈 existe y está inicializado
  loading = false;

  // catálogos
  equipos: EquipoDto[] = [];

  // filtros
  formFiltros!: FormGroup;

  // crear/editar
  form!: FormGroup;
  submitted = false;
  dialogVisible = false;
  isEdit = false;
  currentId: number | null = null;

  // marcador
  formScore!: FormGroup;
  scoreVisible = false;

  // roster
  rosterVisible = false;
  rosterForLocal = true; // true = local, false = visitante
  rosterOptions: SelectItem<number>[] = [];  // 👈 usa SelectItem
  selectedRosterIds: number[] = [];          // 👈 inicializado

  constructor(
    private fb: FormBuilder,
    private partidosSvc: ConsultasService,
    private equiposSvc: ConsultasService,
    private jugadoresSvc: ConsultasService,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {
    this.formulario();
    this.formularioFiltros();
    this.formularioScore();
  }

  ngOnInit(): void {
    this.cargarEquipos();
    this.load();
  }

  // ===== Formularios =====
  formulario() {
    this.form = this.fb.group({
      fechaHora:         [null, [Validators.required]],
      equipoLocalId:     [null, [Validators.required]],
      equipoVisitanteId: [null, [Validators.required]],
    });
  }

  formularioFiltros() {
    this.formFiltros = this.fb.group({
      startDate: [null],
      endDate:   [null],
      search:    ['']
    });
  }

  formularioScore() {
    this.formScore = this.fb.group({
      marcadorLocal:     [0, [Validators.required, Validators.min(0)]],
      marcadorVisitante: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // ===== Catálogos =====
  cargarEquipos() {
    this.equiposSvc.list().subscribe({
      next: (data) => this.equipos = data ?? [],
      error: () => this.msg.add({severity:'error', summary:'Error', detail:'No se pudieron cargar equipos'})
    });
  }

  // ===== Data =====
  load() {
    this.loading = true;

    const { startDate, endDate } = this.formFiltros.value;
    const startIso = startDate ? new Date(startDate).toISOString() : undefined;
    const endIso   = endDate   ? new Date(endDate).toISOString()   : undefined;

    this.partidosSvc.listP(startIso, endIso).subscribe({
      next: (data) => this.partidos = data ?? [],
      error: (err) => this.msg.add({severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudieron cargar partidos'}),
      complete: () => this.loading = false
    });
  }

  resetFilters() {
    this.formFiltros.reset({ startDate: null, endDate: null, search: '' });
    if (this.dt) this.dt.clear();
    this.load();
  }

  // ===== CRUD =====
  openNew() {
    this.isEdit = false;
    this.currentId = null;
    this.submitted = false;
    this.form.reset({
      fechaHora: null,
      equipoLocalId: null,
      equipoVisitanteId: null,
    });
    this.dialogVisible = true;
  }

  openEdit(row: PartidoDto) {
    this.isEdit = true;
    this.currentId = row.id!;
    this.submitted = false;
    this.form.reset({
      fechaHora: new Date(row.fechaHora),
      equipoLocalId: row.equipoLocal?.id ?? null,
      equipoVisitanteId: row.equipoVisitante?.id ?? null,
    });
    this.dialogVisible = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg.add({severity:'warn', summary:'Valida los campos', detail:'Revisa los datos requeridos.'});
      return;
    }

    const v = this.form.value;
    const payload: PartidoUpsert = {
      fechaHora: moment(v.fechaHora).format('YYYY-MM-DDTHH:mm:ss'),
      equipoLocalId: v.equipoLocalId,
      equipoVisitanteId: v.equipoVisitanteId
    };

    if (this.isEdit && this.currentId != null) {
      this.partidosSvc.updateP(this.currentId, payload).subscribe({
        next: (txt) => {
          this.msg.add({severity:'success', summary:'Actualizado', detail:  'Partido actualizado'});
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => this.msg.add({severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo actualizar'})
      });
    } else {
      this.partidosSvc.createP(payload).subscribe({
        next: (txt) => {
          this.msg.add({severity:'success', summary:'Creado', detail:  'Partido creado'});
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => this.msg.add({severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo crear'})
      });
    }
  }

  askDelete(row: PartidoDto) {
    this.confirm.confirm({
      message: `¿Eliminar el partido ${this.labelPartido(row)}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.doDelete(row.id!)
    });
  }

  private doDelete(id: number) {
    this.partidosSvc.deleteP(id).subscribe({
      next: (txt) => {
        this.msg.add({severity:'success', summary:'Eliminado', detail: 'Partido eliminado'});
        this.load();
      },
      error: (err) => this.msg.add({severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo eliminar'})
    });
  }

  // ===== Marcador =====
  openScore(row: PartidoDto) {
    this.currentId = row.id!;
    this.formScore.reset({
      marcadorLocal: row.marcadorLocal ?? 0,
      marcadorVisitante: row.marcadorVisitante ?? 0
    });
    this.scoreVisible = true;
  }

  saveScore() {
    if (this.currentId == null) return;
    if (this.formScore.invalid) {
      this.msg.add({severity:'warn', summary:'Valida marcador', detail:'Los valores deben ser numéricos >= 0'});
      return;
    }
    this.partidosSvc.updateScore(this.currentId, this.formScore.value as MarcadorDto).subscribe({
      next: (txt) => {
        this.msg.add({severity:'success', summary:'Marcador', detail:  'Marcador actualizado'});
        this.scoreVisible = false;
        this.load();
      },
      error: (err) => this.msg.add({severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo actualizar el marcador'})
    });
  }

  // ===== Roster =====
  openRoster(row: PartidoDto, forLocal: boolean) {
  this.currentId = row.id!;
  this.rosterForLocal = forLocal;

  // 1) Traemos el partido desde el backend para asegurar datos actualizados
  this.partidosSvc.getP(this.currentId).subscribe({
    next: (p) => {
      this.currentPartido = p;

      // 2) Definimos el equipoId según sea local o visitante
      const equipoId = forLocal ? (p.equipoLocal?.id ?? null) : (p.equipoVisitante?.id ?? null);
      if (!equipoId) {
        this.msg.add({ severity: 'warn', summary: 'Roster', detail: 'Equipo no encontrado.' });
        return;
      }

      // 3) Preseleccionamos ids desde el roster actual traído por el endpoint del partido
      const ya = forLocal ? (p.rosterLocal ?? []) : (p.rosterVisitante ?? []);
      this.selectedRosterIds = ya.map(x => x.id!);

      // 4) Cargamos las opciones (todos los jugadores del equipo) para el multiselect
      //    OJO: usa el método correcto que lista jugadores por equipo
      this.jugadoresSvc.listByEquipo(equipoId).subscribe({
        next: (jug) => {
          this.rosterOptions = (jug ?? []).map(j => ({
            label: `#${j.numero} - ${j.nombreCompleto}`,
            value: j.id!
          }));
          this.rosterVisible = true;
        },
        error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar jugadores del equipo' })
      });
    },
    error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el partido' })
  });
}

// ==> ajusta saveRoster para NO recibir row y usar currentPartido/currentId
saveRoster() {
  if (this.currentId == null || !this.currentPartido) return;

  const equipoId = this.rosterForLocal
    ? (this.currentPartido.equipoLocal?.id ?? null)
    : (this.currentPartido.equipoVisitante?.id ?? null);

  if (!equipoId) return;

  this.partidosSvc.setRoster(this.currentId, equipoId, this.selectedRosterIds).subscribe({
    next: (txt) => {
      this.msg.add({ severity: 'success', summary: 'Roster', detail: 'Roster actualizado' });
      this.rosterVisible = false;
      this.currentPartido = null; // limpia cache
      this.load();                // refresca tabla
    },
    error: (err) =>
      this.msg.add({ severity: 'error', summary: 'Error', detail: err?.error?.detail ?? 'No se pudo actualizar el roster' })
  });
}

  // ===== Helpers =====
  labelPartido(p: PartidoDto) {
    const f = new Date(p.fechaHora);
    return `${p.equipoLocal?.nombre} vs ${p.equipoVisitante?.nombre} — ${f.toLocaleString()}`;
  }

  onGlobalFilterInput(ev: Event, table: Table) {
    const val = (ev.target as HTMLInputElement).value;
    table.filterGlobal(val, 'contains');
  }
}
