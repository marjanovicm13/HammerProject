import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Department } from '../Models/Department/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  public getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${environment.baseDepartmentApiUrl}`);
  }

  public updateDepartments(department: Department): Observable<Department[]>{
    return this.http.put<Department[]>(`${environment.baseDepartmentApiUrl}`, department);
  }

  public createDepartment(department: Department): Observable<Department[]>{
    return this.http.post<Department[]>(`${environment.baseDepartmentApiUrl}`, department);
  }

  public deleteDepartment(department: Department): Observable<Department[]> {
    return this.http.delete<Department[]>(`	https://hbv5yzzfr0.execute-api.eu-central-1.amazonaws.com/api/department/${department.departmentNo}`);
  }
}
