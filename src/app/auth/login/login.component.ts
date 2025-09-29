import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultasService } from '../../services/consultas.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

 loading = false;
  submitted = false;
  form! : FormGroup
 

  constructor(
    private fb: FormBuilder,
    private auth: ConsultasService,
    private router: Router,
    private msg: MessageService
  ) {
    this.formulario();
  }



 formulario(){
    this.form = this.fb.group({
    username: ['', [Validators.required, ]],
    password: ['', [Validators.required,]],
  });
 }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg.add({severity:'warn', summary:'Campos incompletos', detail:'Revisa usuario y contraseña.'});
      return;
    }

    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.msg.add({severity:'success', summary:'Bienvenido', detail:`Hola `});
        this.router.navigateByUrl('/pages/inicio'); 
      },
      error: (err) => {
        this.msg.add({severity:'error', summary:'Error de acceso', detail: err?.error?.message ?? 'Credenciales inválidas'});
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
