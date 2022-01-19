import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Module1RoutingModule } from './module1-routing.module';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [Page1Component, Page2Component],
  imports: [
    CommonModule,
    Module1RoutingModule,
    SharedModule,
  ]
})
export class Module1Module { }
