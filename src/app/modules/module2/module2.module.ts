import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Module2RoutingModule } from './module2-routing.module';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [Page3Component, Page4Component],
  imports: [
    CommonModule,
    Module2RoutingModule,
    SharedModule,
  ]
})
export class Module2Module { }
