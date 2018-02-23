import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartUploadComponent } from './apart-upload/apart-upload.component'

import { ApartUploadRoutingModule } from './apart-upload-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ApartUploadRoutingModule
  ],
  declarations: [ApartUploadComponent]
})
export class ApartUploadModule { }
