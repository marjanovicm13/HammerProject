import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../Models/Employee/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  public getEmployees(): Observable<Employee[]> {

    return this.http.get<Employee[]>(`${environment.baseEmployeeApiUrl}`);

  }

  public updateEmployee(employee: Employee): Observable<Employee[]>{
    return this.http.put<Employee[]>(`${environment.baseEmployeeApiUrl}`, employee);
    //return this.http.put<Employee[]>("https://mbt72nmlz2.execute-api.eu-central-1.amazonaws.com/PutGetPost", employee);  
  }

  public createEmployee(employee: Employee): Observable<Employee[]>{
    return this.http.post<Employee[]>(`${environment.baseEmployeeApiUrl}`, employee);
    //return this.http.post<Employee[]>("https://mbt72nmlz2.execute-api.eu-central-1.amazonaws.com/PutGetPost/", employee);
  }

  public deleteEmployee(employee: Employee): Observable<Employee[]>{
   // return this.http.delete<Employee[]>(`${environment.baseApiUrl}/${this.url}/${employee.employeeNo}`);
   return this.http.delete<Employee[]>(`https://lrw95c4ca3.execute-api.eu-central-1.amazonaws.com/api/employee/${employee.employeeNo}`);
  }
}
