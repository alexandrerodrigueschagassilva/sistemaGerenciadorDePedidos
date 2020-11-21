import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../services/autenticacao.service';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUser = new FormControl('',[Validators.required, Validators.minLength(4)]);
  password = new FormControl('',[Validators.required, Validators.minLength(4)]);

  constructor
  (
    private auth: AutenticacaoService,
    public toastr: ToastrService,
    private router: Router
  ) 
  {
    //console.log('logado? ', this.auth.getCurrentUser());
    //this.auth.logOut();

    this.auth.getCurrentUser().subscribe(user => {
      if(user != null) {
        this.router.navigateByUrl('/gerenciar');
        this.toastr.success('Login realizado!');
      }
    });
    
  }

  ngOnInit(): void {
    
  }

  login() {
    let login = this.auth.login(this.loginUser.value, this.password.value);
    login.then((info) => {
      if(info.user.uid) {
        this.router.navigateByUrl('/gerenciar')
      }
    }).catch((error) => {
      this.toastr.error(error.message);
    });
  }

  showSuccess(mensagem) {
    this.toastr.success(mensagem);
  }

  showError(mensagem) {
    this.toastr.error(mensagem);
  }

}
