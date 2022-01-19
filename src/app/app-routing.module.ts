import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'module1',
    loadChildren: () => import('src/app/modules/module1/module1.module').then(m => m.Module1Module),
  },
  {
    path: 'module2',
    loadChildren: () => import('src/app/modules/module2/module2.module').then(m => m.Module2Module),
  },
  {
    path: '',
    redirectTo: 'module1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
