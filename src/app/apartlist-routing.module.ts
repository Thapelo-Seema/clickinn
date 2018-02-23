import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApartlistComponent } from './apartlist/apartlist.component';
//import { HomeComponent } from './home/home.component'


const routes: Routes = [
	{path: '', component: ApartlistComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartlistRoutingModule { }
