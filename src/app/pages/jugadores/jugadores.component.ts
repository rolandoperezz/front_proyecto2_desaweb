import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultasService, EquipoDto, JugadorDto } from '../../services/consultas.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrl: './jugadores.component.scss',
    providers: [ConfirmationService]

})
export class JugadoresComponent {
    @ViewChild('dt') dt!: Table;

 jugadores: JugadorDto[] = [];
  loading = false;

  equipos: EquipoDto[] = [];
  posiciones = [
    { label: 'Base', value: 'Base' },
    { label: 'Escolta', value: 'Escolta' },
    { label: 'Alero', value: 'Alero' },
    { label: 'Ala-Pívot', value: 'Ala-Pívot' },
    { label: 'Pívot', value: 'Pívot' }
  ];

  formFiltros!: FormGroup;

  form!: FormGroup;
  submitted = false;
  dialogVisible = false;
  isEdit = false;
  currentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private Svc: ConsultasService,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {
    this.formulario();        
    this.formularioFiltros(); 
  }

  ngOnInit(): void {
    this.cargarEquipos();
  }

  formulario() {
    this.form = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(120)]],
      numero:         [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      posicion:       [null, [Validators.required]],
      estaturaCm:     [null, [Validators.required, Validators.min(120), Validators.max(260)]],
      edad:           [null, [Validators.required, Validators.min(10), Validators.max(60)]],
      nacionalidad:   ['', [Validators.required, Validators.maxLength(60)]],
      equipoId:       [null, [Validators.required]]
    });
  }

  formularioFiltros() {
    this.formFiltros = this.fb.group({
      equipoId:      [null], 
      searchTerm:    [''],
      positionFilter:['']
    });
  }

  cargarEquipos() {
    this.Svc.list().subscribe({
      next: (data) => this.equipos = data,
      error: () => this.msg.add({ severity:'error', summary:'Error', detail:'No se pudieron cargar equipos' })
    });
  }

  load() {
    const { equipoId, searchTerm, positionFilter } = this.formFiltros.value;
    if (!equipoId) {
      this.jugadores = [];
      return;
    }

    this.loading = true;
    this.Svc.listByEquipo(
      equipoId,
      (searchTerm || '').trim() || undefined,
      (positionFilter || '').trim() || undefined
    ).subscribe({
      next: (data) => this.jugadores = data,
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudieron cargar jugadores' }),
      complete: () => this.loading = false
    });
  }

  resetFilters() {
    const equipo = this.formFiltros.get('equipoId')?.value;
    this.formFiltros.reset({ equipoId: equipo, searchTerm: '', positionFilter: '' });
    if (this.dt) this.dt.clear();
    this.load();
  }

  openNew() {
    this.isEdit = false;
    this.currentId = null;
    this.submitted = false;

    // si hay equipo filtrado, prefijarlo en el formulario
    const equipoId = this.formFiltros.get('equipoId')?.value || null;
    this.form.reset({
      nombreCompleto: '',
      numero: null,
      posicion: null,
      estaturaCm: null,
      edad: null,
      nacionalidad: '',
      equipoId: equipoId
    });
    this.dialogVisible = true;
  }

  openEdit(row: JugadorDto) {
    this.isEdit = true;
    this.currentId = row.id!;
    this.submitted = false;

    this.form.reset({
      nombreCompleto: row.nombreCompleto,
      numero: row.numero,
      posicion: row.posicion,
      estaturaCm: row.estaturaCm,
      edad: row.edad,
      nacionalidad: row.nacionalidad,
      equipoId: row.equipo?.id ?? row.equipoId
    });
    this.dialogVisible = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg.add({ severity:'warn', summary:'Valida los campos', detail:'Revisa los datos requeridos.' });
      return;
    }

    const payload = this.form.value;

    if (this.isEdit && this.currentId != null) {
      this.Svc.updateJ(this.currentId, payload).subscribe({
        next: (txt) => {
          this.msg.add({ severity:'success', summary:'Actualizado', detail: 'Jugador actualizado' });
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo actualizar' })
      });
    } else {
      this.Svc.createJ(payload).subscribe({
        next: (txt) => {
          this.msg.add({ severity:'success', summary:'Creado', detail: 'Jugador creado' });
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo crear' })
      });
    }
  }

  askDelete(row: JugadorDto) {
    this.confirm.confirm({
      message: `¿Eliminar a <b>${row.nombreCompleto}</b> (#${row.numero})?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.doDelete(row.id!)
    });
  }

  private doDelete(id: number) {
    this.Svc.deleteJ(id).subscribe({
      next: (txt) => {
        this.msg.add({ severity:'success', summary:'Eliminado', detail:  'Jugador eliminado' });
        this.load();
      },
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo eliminar' })
    });
  }
}
