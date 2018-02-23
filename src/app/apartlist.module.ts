import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartlistRoutingModule } from './apartlist-routing.module';
import { ApartlistComponent } from './apartlist/apartlist.component';
import {AppModule} from './app.module';
import { NamePipe } from './name.pipe';

@NgModule({
  imports: [
    CommonModule,
    ApartlistRoutingModule,
    AppModule
  ],
  declarations: [ApartlistComponent]
})
export class ApartlistModule { }
