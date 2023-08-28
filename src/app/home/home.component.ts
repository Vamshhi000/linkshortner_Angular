import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private fb : FormBuilder,private httpClient : HttpClient,private service:AuthServiceService,private _snackBar: MatSnackBar,private activatedRoute:ActivatedRoute) {
    
  }
 ngOnInit(): void {
   this.urlForm= this.fb.group({
     originalLink : ['',[Validators.required]],
   })
   this.activatedRoute.queryParams.subscribe(params => {
     console.log(params);
     console.log(params.url)
     
     if(params.url!="" && params.url!=undefined){
      this.service.getUrl(params.url).subscribe(
        (res)=>{
          if(res.flag){
            const date = this.getCurrentDateTime();
            this.millisec=this.subtractDates(date,res.dateTime);
            if(this.millisec>20102772){
              this.service.deleteUrl(params.url).subscribe((res)=>{
                this.openSnackBar(res.msg,"CANCEL");
              });
            }else{
              window.location.href=res.originalLink;
            }
          }else{
            this.openSnackBar(res.msg,"CANCEL");
          }
        }
      )
     }
   });
 }

 urlForm : FormGroup;
 originalLink:string
 shortlink:string
 exptime:Date;
 isGenerated:boolean;
 millisec:number

 generate(){
   this.service.generateUrl(this.urlForm.value).subscribe(
     (result:any)=>{
       console.log(result);
       this.originalLink=result.originalLink;
       this.shortlink=result.shortLink;
       this.exptime=result.dateTime;
       this.isGenerated=result.flag;
       if(!this.isGenerated){
         this.openSnackBar(result.msg,"CANCEL");
       }else{
         this.openSnackBar(result.msg,"OK");
       }
     }
   ,(error)=>{
     this.openSnackBar("Internel Server Error","CANCEL");
   })
 }
 
 openSnackBar(message: string, action: string) {
   this._snackBar.open(message, action);
 }

 validateLink(){
   const date = this.getCurrentDateTime();
   this.millisec=this.subtractDates(date,this.exptime);
   if(this.millisec>20102772){
     document.getElementById("linkElement").removeAttribute("href");
     this.service.deleteUrl(this.shortlink).subscribe((res)=>{
       this.openSnackBar(res.msg,"CANCEL");
     });
   }

 }

  subtractDates(date1Str: any, date2Str: any): any {
   const date1 = new Date(date1Str);
   const date2 = new Date(date2Str);
   const differenceInMilliseconds = date1.getTime() - date2.getTime();
   return differenceInMilliseconds;
 }

  getCurrentDateTime() {
   const now = new Date();
   const year = now.getFullYear();
   const month = String(now.getMonth() + 1).padStart(2, '0');
   const day = String(now.getDate()).padStart(2, '0');
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   const seconds = String(now.getSeconds()).padStart(2, '0');
   const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
 }

}
