import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultasService, RoleDto } from '../../services/consultas.service';


export interface UserDto {
  id?: number;
  username: string;
  roleId: number;
  roleName?: string;
}
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  providers: [ConfirmationService]
})
export class UsuariosComponent {
users: UserDto[] = [];
  roles: RoleDto[] = [];
  loading = false;

  formFiltros!: FormGroup;

  form!: FormGroup;
  submitted = false;
  dialogVisible = false;
  isEdit = false;
  currentId: number | null = null;

  // Cambio de contraseña
  pwdForm!: FormGroup;
  pwdSubmitted = false;
  pwdDialogVisible = false;

  constructor(
    private fb: FormBuilder,
    private svc: ConsultasService,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {
    this.formulario();
    this.formularioFiltros();
    this.formularioPwd();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  formulario() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      roleId:   [null, [Validators.required]],
      password: [''] // requerido solo al crear
    });
  }

  formularioPwd() {
    this.pwdForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  formularioFiltros() {
    this.formFiltros = this.fb.group({
      searchTerm: [''],
      roleFilter: [null]
    });
  }

roleNameById = new Map<number, string>();

loadRoles() {
  this.svc.getRoles().subscribe({
    next: (data) => {
      this.roles = data || [];
      // Precalcular mapa id -> nombre
      this.roleNameById.clear();
      for (const r of this.roles) this.roleNameById.set(r.id, r.name);
    },
    error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudieron cargar los roles' })
  });
}

  loadUsers() {
    this.loading = true;
    this.svc.getUsers().subscribe({
      next: (data) => {
        const term = (this.formFiltros.value.searchTerm || '').toLowerCase().trim();
        const roleId = this.formFiltros.value.roleFilter;
        this.users = (data || []).filter(u =>
          (!term || u.username.toLowerCase().includes(term) || (u.roleName ?? '').toLowerCase().includes(term)) &&
          (!roleId || u.roleId === roleId)
        );
      },
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudieron cargar los usuarios' }),
      complete: () => this.loading = false
    });
  }

  applyFilters() { this.loadUsers(); }
  resetFilters() { this.formFiltros.reset(); this.loadUsers(); }

  openNew() {
    this.isEdit = false;
    this.currentId = null;
    this.submitted = false;
    this.form.reset();
    // password requerido al crear
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.dialogVisible = true;
  }

  openEdit(row: UserDto) {
    this.isEdit = true;
    this.currentId = row.id!;
    this.submitted = false;
    this.form.reset({
      username: row.username,
      roleId: row.roleId,
      password: '' // no requerido al editar
    });
    // quitar validators de password en edición
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.dialogVisible = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg.add({ severity:'warn', summary:'Valida los campos', detail:'Revisa los datos requeridos.' });
      return;
    }

    const v = this.form.value;

    if (this.isEdit && this.currentId != null) {
      const payload = { username: (v.username as string).trim(), roleId: +v.roleId };
      this.svc.updateUser(this.currentId, payload).subscribe({
        next: () => {
          this.msg.add({ severity:'success', summary:'Actualizado', detail:'Usuario actualizado correctamente' });
          this.dialogVisible = false;
          this.loadUsers();
        },
        error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo actualizar' })
      });
    } else {
      const payload = { username: (v.username as string).trim(), password: v.password, roleId: +v.roleId };
      this.svc.register(payload).subscribe({
        next: () => {
          this.msg.add({ severity:'success', summary:'Creado', detail:'Usuario creado correctamente' });
          this.dialogVisible = false;
          this.loadUsers();
        },
        error: (err) => {
          const detail = err?.status === 409 ? 'El usuario ya existe' : (err?.error?.detail ?? 'No se pudo crear');
          this.msg.add({ severity:'error', summary:'Error', detail });
        }
      });
    }
  }

  askDelete(row: UserDto) {
    this.confirm.confirm({
      message: `¿Eliminar el usuario <b>${row.username}</b>?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.doDelete(row.id!)
    });
  }

  private doDelete(id: number) {
    this.svc.deleteUser(id).subscribe({
      next: () => {
        this.msg.add({ severity:'success', summary:'Eliminado', detail:'Usuario eliminado' });
        this.loadUsers();
      },
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo eliminar' })
    });
  }

  openChangePwd(row: UserDto) {
    this.currentId = row.id!;
    this.pwdSubmitted = false;
    this.pwdForm.reset();
    this.pwdDialogVisible = true;
  }

  changePassword() {
    this.pwdSubmitted = true;
    if (this.pwdForm.invalid || this.currentId == null) {
      this.msg.add({ severity:'warn', summary:'Valida los campos', detail:'Revisa los datos requeridos.' });
      return;
    }
    const payload = { newPassword: this.pwdForm.value.newPassword };
    this.svc.changePassword(this.currentId, payload).subscribe({
      next: () => {
        this.msg.add({ severity:'success', summary:'Actualizado', detail:'Contraseña actualizada' });
        this.pwdDialogVisible = false;
      },
      error: (err) => this.msg.add({ severity:'error', summary:'Error', detail: err?.error?.detail ?? 'No se pudo cambiar la contraseña' })
    });
  }

}
