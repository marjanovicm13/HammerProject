import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {

  constructor(private http: HttpClient) { }

  url = "query"

  public getAvgSalary(): Observable<string> {
    return this.http.get<string>(`${environment.baseApiUrl}/${this.url}/avgSalary`);
  }

  public getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseApiUrl}/${this.url}/locations`);
  }

  public getDevelopmentLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseApiUrl}/${this.url}/developmentLocations`);
  }

  public getSecondHighestSalary(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseApiUrl}/${this.url}/secondHighestSalary`);
  }

  public getDepartmentView(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseApiUrl}/${this.url}/departmentView`);
  }

  public increaseSalary(employeeNo: number, increasePercentage: number): Observable<string[]> {
    return this.http.post<string[]>(`${environment.baseApiUrl}/${this.url}/increaseSalary`, {employeeNo, increasePercentage});
  }

  public decreaseSalary(employeeNo: number, increasePercentage: number): Observable<string[]> {
    return this.http.post<string[]>(`${environment.baseApiUrl}/${this.url}/decreaseSalary`, {employeeNo, increasePercentage});
  }
}
