import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:3030';


  constructor(private http: HttpClient) { }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get`);
  }

  updateBlog(id: number, updatedBlog: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, updatedBlog);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  signup(name : string  ,email: string, password: string ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, {name, email, password });
  }

  createBlog( body : object){
    return this.http.post<any>(`${this.apiUrl}/create`, body);
  }
}
