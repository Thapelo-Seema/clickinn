import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

   constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<StatusComponent>){}

  close(){
    this.dialogRef.close()
  }

  ngOnInit() {
  }

}
