import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../Models/Employee/employee';
import { updateEmployee } from '../Models/Employee/updateemployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url = "employee"

  constructor(private http: HttpClient) { }

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.baseApiUrl}/${this.url}`);
  }

  public getUpdateEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.baseApiUrl}/${this.url}/updateEmployees`);
  }

  public updateEmployee(employee: updateEmployee): Observable<Employee[]>{
    return this.http.put<Employee[]>(`${environment.baseApiUrl}/${this.url}`, employee);
  }

  public createEmployee(employee: Employee): Observable<Employee[]>{
    return this.http.post<Employee[]>(`${environment.baseApiUrl}/${this.url}`, employee);
  }

  public deleteEmployee(employee: Employee): Observable<Employee[]>{
   return this.http.delete<Employee[]>(`${environment.baseApiUrl}/${this.url}/${employee.employeeNo}`);
  }
}
