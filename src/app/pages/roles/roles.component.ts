import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultasService, RoleDto } from '../../services/consultas.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
   providers: [ConfirmationService]
})
export class RolesComponent {
roles: RoleDto[] = [];
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
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  formularioFiltros() {
    this.formFiltros = this.fb.group({
      searchTerm: ['']
    });
  }

  load() {
    this.loading = true;
    this.svc.getRoles().subscribe({
      next: (data) => {
        const term = (this.formFiltros.value.searchTerm || '').toLowerCase().trim();
        this.roles = (data || []).filter(r => !term || r.name.toLowerCase().includes(term));
        console.log(this.roles);
      },
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudieron cargar los roles' }),
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

  openEdit(row: RoleDto) {
    this.isEdit = true;
    this.currentId =  Number(row.id);
    this.submitted = false;
    this.form.reset({
      name: row.name
    });
    this.dialogVisible = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg.add({ severity:'warn', summary:'Valida los campos', detail:'Revisa los datos requeridos.' });
      return;
    }

    const payload = this.form.value as Omit<RoleDto, 'id'>;

    if (this.isEdit && this.currentId != null) {
      this.svc.updateRole(this.currentId, payload).subscribe({
        next: () => {
          this.msg.add({ severity:'success', summary:'Actualizado', detail:'Rol actualizado correctamente' });
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => {
          this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo actualizar' });
        }
      });
    } else {
      this.svc.createRole(payload).subscribe({
        next: () => {
          this.msg.add({ severity:'success', summary:'Creado', detail:'Rol creado correctamente' });
          this.dialogVisible = false;
          this.load();
        },
        error: (err) => {
          const detail = err?.status === 409 ? 'El rol ya existe' : (err?.error?.detail ?? 'No se pudo crear');
          this.msg.add({ severity:'error', summary:'Error', detail });
        }
      });
    }
  }

  askDelete(row: RoleDto) {
    this.confirm.confirm({
      message: `¿Eliminar el rol <b>${row.name}</b>?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.doDelete(row.id)
    });
  }

  private doDelete(id: number) {
    this.svc.deleteRole(id).subscribe({
      next: () => {
        this.msg.add({ severity:'success', summary:'Eliminado', detail:'Rol eliminado' });
        this.load();
      },
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo eliminar' })
    });
  }
}
