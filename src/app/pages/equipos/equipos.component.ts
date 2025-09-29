import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EquipoDto, ConsultasService } from '../../services/consultas.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.scss',
  providers: [ConfirmationService]

})
export class EquiposComponent {

  equipos: EquipoDto[] = [];
  loading = false;

  formFiltros!: FormGroup;

  form!: FormGroup;
  submitted = false;
  dialogVisible = false;
  isEdit = false;
  currentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: ConsultasService,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {
    this.formulario();        
    this.formularioFiltros(); 
  }

  ngOnInit(): void {
    this.load();
  }

  formulario() {
    this.form = this.fb.group({
      nombre:  ['', [Validators.required, Validators.maxLength(80)]],
      ciudad:  ['', [Validators.required, Validators.maxLength(80)]],
      logoUrl: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  formularioFiltros() {
    this.formFiltros = this.fb.group({
      searchTerm: [''],
      cityFilter: ['']
    });
  }

  load() {
    this.loading = true;
    const { searchTerm, cityFilter } = this.formFiltros.value;

    this.svc.list(
      (searchTerm || '').trim() || undefined,
      (cityFilter || '').trim() || undefined
    ).subscribe({
      next: (data) => this.equipos = data,
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudieron cargar los equipos' }),
      complete: () => this.loading = false
    });
  }

  resetFilters() {
    this.formFiltros.reset();
    this.load();
  }

  openNew() {
    this.isEdit = false;
    this.currentId = null;
    this.submitted = false;
    this.form.reset();
    this.dialogVisible = true;
  }

  openEdit(row: EquipoDto) {
    this.isEdit = true;
    this.currentId = row.id!;
    this.submitted = false;
    this.form.reset({
      nombre:  row.nombre,
      ciudad:  row.ciudad,
      logoUrl: row.logoUrl
    });
    this.dialogVisible = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg.add({ severity:'warn', summary:'Valida los campos', detail:'Revisa los datos requeridos.' });
      return;
    }

    const payload = this.form.value as Omit<EquipoDto, 'id'>;

    if (this.isEdit && this.currentId != null) {
      console.log(this.currentId, payload);
      this.svc.update(this.currentId, payload).subscribe({
        next: () => {
          this.msg.add({ severity:'success', summary:'Actualizado', detail:'Equipo actualizado correctamente' });
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo actualizar' })
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => {
          this.msg.add({ severity:'success', summary:'Creado', detail:'Equipo creado correctamente' });
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo crear' })
      });
    }
  }

  askDelete(row: EquipoDto) {
    this.confirm.confirm({
      message: `¿Eliminar el equipo <b>${row.nombre}</b>?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.doDelete(row.id!)
    });
  }

  private doDelete(id: number) {
    this.svc.delete(id).subscribe({
      next: () => {
        this.msg.add({ severity:'success', summary:'Eliminado', detail:'Equipo eliminado' });
        this.load();
      },
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo eliminar' })
    });
  }

  get logoPreview(): string {
    return this.form.get('logoUrl')?.value || '';
  }
}
