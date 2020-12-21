import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GerenciarComponent } from './pedidos/gerenciar/gerenciar.component';
import { ProntosComponent } from './pedidos/prontos/prontos.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'gerenciar', component: GerenciarComponent }//,
  //{ path: 'prontos', component: ProntosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
