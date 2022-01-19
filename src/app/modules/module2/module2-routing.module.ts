import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';

const routes: Routes = [
  {
    path: '',
    component: Page3Component
  },
  {
    path: 'page3',
    component: Page3Component,
  },
  {
    path: 'page4',
    component: Page4Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module2RoutingModule { }
