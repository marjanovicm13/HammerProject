import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Department } from '../Models/Department/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  
  private url = "department";

  constructor(private http: HttpClient) { }

  public getDepartments(): Observable<Department[]> {

    return this.http.get<Department[]>(`${environment.baseApiUrl}/${this.url}`);

  }

  public updateDepartments(department: Department): Observable<Department[]>{

    return this.http.put<Department[]>(`${environment.baseApiUrl}/${this.url}`, department);

  }

  public createDepartment(department: Department): Observable<Department[]>{

    return this.http.post<Department[]>(`${environment.baseApiUrl}/${this.url}`, department);

  }

  public deleteDepartment(department: Department): Observable<Department[]> {

    return this.http.delete<Department[]>(`${environment.baseApiUrl}/${this.url}/${department.departmentNo}`);

  }
}
