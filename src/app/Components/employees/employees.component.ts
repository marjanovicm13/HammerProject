import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/Models/Employee/employee';
import { updateEmployee } from 'src/app/Models/Employee/updateemployee';
import { EmployeeService } from 'src/app/Services/employee.service';
import { RefreshTokenService } from 'src/app/Services/refresh-token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DepartmentService } from 'src/app/Services/department.service';
import { Department } from '../../Models/Department/department';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];
  updateEmployees: updateEmployee[] = [];
  departments: Department[] = [];
  departmentExists: boolean = false
  textToSave: BlobPart = "";
  refresh: boolean =false

  constructor(private employeeService: EmployeeService, private refreshTokenService: RefreshTokenService,
     private jwtHelper: JwtHelperService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees(){
    this.employeeService.getEmployees()
                        .subscribe((result: Employee[]) => (this.employees = result));
    this.employeeService.getUpdateEmployees()
                        .subscribe((result: updateEmployee[]) => (this.updateEmployees = result));
  }

  async getAllDepartments(){
    return await lastValueFrom (this.httpClient
    .get(
      `${environment.baseApiUrl}/department`
      ))
  }

   async deleteEmployee(employee: Employee){
        if(this.jwtHelper.isTokenExpired(localStorage.getItem("jwt")!)){
          //If token is expired, refresh tokens
          await this.refreshTokenService.tryRefreshingTokens(localStorage.getItem("jwt")!)
          this.employeeService.deleteEmployee(employee).subscribe({
            next: () => {
              this.getAllEmployees()
            },
            error: response => {
              console.error(response)
              alert("You are not authorized to delete an employee.")
            }});
        }
        else{
          this.employeeService.deleteEmployee(employee).subscribe({
            next: () => {
              this.getAllEmployees()
            },
            error: response => {
              console.error(response)
              alert("You are not authorized to delete an employee.")
            }});
        }
  }

  async createEmployee(employee: Employee){
    this.getAllDepartments().then((data:any) => {
          this.departments = data
          //Check if departmentNo of the new employee exists
          this.departments.forEach(element => {
            if(element.departmentNo == employee.departmentNo)
            this.departmentExists = true
          })
    }).finally(async () => {
      if(localStorage.getItem("jwt") == null){
        alert("You are not authorized to create an employee.")
      }
      else if(!employee.departmentNo || employee.employeeName == "" || !employee.salary){
        alert("You have to fill out employeeName, salary and departmentNo")
      }
      else if(this.departmentExists == false){
        alert("departmentNo doesn't exist.")
      }
      else{
        if(this.jwtHelper.isTokenExpired(localStorage.getItem("jwt")!)){
          //If token is expired, refresh tokens
          await this.refreshTokenService.tryRefreshingTokens(localStorage.getItem("jwt")!)
          this.employeeService.createEmployee(employee).subscribe({
            next: () => {
              this.getAllEmployees()
            },
            error: response => {
              console.error(response)
              alert("You are not authorized to create an employee.")
            }});
        }
        else{
          this.employeeService.createEmployee(employee).subscribe({
            next: () => {
              this.getAllEmployees()
            },
            error: response => {
              console.error(response)
              alert("You are not authorized to create an employee.")
            }});
        }
      }
      this.departmentExists = false;
    })
  }

  updateEmployee(employee: Employee){
    if(localStorage.getItem("jwt") != null){
      employee.updateClicked = true;
    }
    else{
      alert("You are not authorized to update an employee.")
    }
  }

  async saveEmployee(employee: updateEmployee){
    this.getAllDepartments().then((data:any) => {
      this.departments = data
      //Check if departmentNo of the updated employee exists
      this.departments.forEach(element => {
        if(element.departmentNo == employee.departmentNo)
        this.departmentExists = true
      })
}).finally(async () => {
  if(this.departmentExists == false){
    alert("departmentNo doesn't exist.")
  }
  else if(this.jwtHelper.isTokenExpired(localStorage.getItem("jwt")!)){
    //If token is expired, refresh tokens
    await this.refreshTokenService.tryRefreshingTokens(localStorage.getItem("jwt")!)
    this.employeeService.updateEmployee(employee).subscribe({
      next: () => {
        this.getAllEmployees()
        employee.updateClicked = false;
      },
      error: response => {
        console.error(response)
        alert("You are not authorized to update an employee.")
        employee.updateClicked = false;
    }});
  }
  else{
    this.employeeService.updateEmployee(employee).subscribe(({
      next: () => {
        this.getAllEmployees()
        employee.updateClicked = false;
      },
      error: response => {
          console.error(response)
          alert("You are not authorized to update an employee.")
          employee.updateClicked = false;
      }
    }))
  }
  })
  this.departmentExists = false;
  }

  getJson(){
    let myJson = JSON.stringify(this.employees, null, 2)
    let x = window.open();
    x?.document.open();
    x?.document.write('<html><body><pre>' + myJson + '</pre></body></html>');
    x?.document.close();
  }

  saveAsTxt(){
    this.textToSave += "+----------+------------------+------------+-------------+\n"
    this.textToSave += "|employeeNo|employeeName      |Salary      |departmentNo |\n"
    this.textToSave += "+----------+------------------+------------+-------------+\n"
    this.employees.forEach(element => {
      this.textToSave += "|" + element.employeeNo + " ".repeat((10 - element.employeeNo.toString().length)) + "|" + element.employeeName +  " ".repeat((18 - element.employeeName.length)) +   "|"  + element.salary  + " ".repeat((12 - element.salary.toString().length)) + "|" + element.departmentNo + " ".repeat((13 - element.departmentNo.toString().length)) +  "|\n";
      this.textToSave += "+----------+------------------+------------+-------------+\n"
    });
    var textToSaveAsBlob = new Blob([this.textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = "employeeTable.txt";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    
    downloadLink.click();
  }
}
