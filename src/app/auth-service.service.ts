import { Injectable } from '@angular/core';
import { Link } from './models/link';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http:HttpClient) { }
  baseUrl="http://urlshortnerserver.us-west-2.elasticbeanstalk.com/linkshotner"
    generateUrl(link:Link):Observable<Link> {
      return this.http.post<Link>(`${this.baseUrl}`,link);
     }
  
     deleteUrl(link:String):Observable<any>{
   
      return this.http.delete<any>(`${this.baseUrl}/${link}`)
  
     }

     getUrl(url:String):Observable<any>{
      return this.http.get<any>(`${this.baseUrl}?url=${url}`)
     }
}
