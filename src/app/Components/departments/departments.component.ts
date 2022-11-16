import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/Models/Employee/employee';
import { DepartmentService } from 'src/app/Services/department.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { Department } from '../../Models/Department/department';
import { RefreshTokenService } from 'src/app/Services/refresh-token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  departments: Department[] = [];
  employees: Employee[] = [];
  departmentContainsEmployees: boolean = false;

  constructor(private departmentService: DepartmentService, private refreshTokenService: RefreshTokenService, 
    private jwtHelper: JwtHelperService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllDepartments();
  }

  getAllDepartments(){
     this.departmentService.getDepartments()
                          .subscribe((result: Department[]) => (this.departments = result));
  }

  async getAllEmployees(){
    return await lastValueFrom (this.httpClient
    .get(
      `${environment.baseApiUrl}/employee`
      ))
  }

  updateDepartment(department: Department) {
    if(localStorage.getItem("jwt") != null){
      department.updateClicked = true;
    }
    else{
      alert("You are not authorized to update a department.")
    }
  }

  async saveDepartment(department: Department) {
    if(this.jwtHelper.isTokenExpired(localStorage.getItem("jwt")!)){
      //If token expired, refresh tokens
      await this.refreshTokenService.tryRefreshingTokens(localStorage.getItem("jwt")!)
      this.departmentService.updateDepartments(department).subscribe({
        next: () => {
          this.getAllDepartments()
          department.updateClicked = false;
        },
        error: response => {
          console.error(response)
          alert("You are not authorized to update a department.")
          department.updateClicked = false;
        }});
    }
    else{
      this.departmentService.updateDepartments(department).subscribe(({
        next: () => {
          this.getAllDepartments()
          department.updateClicked = false;
        },
        error: response => {
            console.error(response)
            alert("You are not authorized to update a department.")
            department.updateClicked = false;
        }
        }))
    }
  }

  async deleteDepartment(department: Department){
    this.getAllEmployees
    ().then((data:any) => {
      this.employees = data
      //Check if department that is being deleted has employees
      this.employees.forEach(element => {
        if(element.departmentNo == department.departmentNo)
        this.departmentContainsEmployees = true;
      })
      }).finally(async () => {
        if(this.departmentContainsEmployees == true){
          alert("Cannot delete this department because it contains employees");
          this.departmentContainsEmployees = false;
        }
        else if(this.jwtHelper.isTokenExpired(localStorage.getItem("jwt")!)){
          //If token is expired, refresh tokens
          await this.refreshTokenService.tryRefreshingTokens(localStorage.getItem("jwt")!)
          this.departmentService.deleteDepartment(department).subscribe({
            next: () => {
              this.getAllDepartments()
            },
            error: response => {
              console.error(response)
              alert("You are not authorized to delete a department.")
            }});
        }
        else{
          this.departmentService.deleteDepartment(department).subscribe({
            next: () => {
              this.getAllDepartments()
            },
            error: response => {
              console.error(response)
              alert("You are not authorized to delete a department or it contains employees.")
            }});
        }
        this.departmentContainsEmployees = false;
    });
  }

  async createDepartment(department: Department){
    if(localStorage.getItem("jwt") == null){
      alert("You are not authorized to create a department.")
    }
    else if(department.departmentName == "" || department.departmentLocation == ""){
      alert("You have to fill out departmentName and departmentLocation")
    }
    else{
      //If token is expired, refresh tokens
      if(this.jwtHelper.isTokenExpired(localStorage.getItem("jwt")!)){
        await this.refreshTokenService.tryRefreshingTokens(localStorage.getItem("jwt")!)
        this.departmentService.createDepartment(department).subscribe({
          next: () => {
            this.getAllDepartments()
          },
          error: response => {
            console.error(response)
            alert("You are not authorized to delete a department.")
          }});
      }
      else{
        this.departmentService.createDepartment(department).subscribe({
          next: () => {
            this.getAllDepartments()
          },
          error: response => {
            console.error(response)
            alert("You are not authorized to delete a department.")
          }});
      }
    }
  }

  getJson(){
    let myJson = JSON.stringify(this.departments, null, 2)
    let x = window.open();
    x?.document.open();
    x?.document.write('<html><body><pre>' + myJson + '</pre></body></html>');
    x?.document.close();
  }
}
