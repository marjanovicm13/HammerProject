import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Employee } from 'src/app/Models/Employee/employee';
import { DepartmentService } from 'src/app/Services/department.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { Department } from '../../Models/Department/department';
import { RefreshTokenService } from 'src/app/Services/refresh-token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  departments: Department[] = [];
  employees: Employee[] = [];
  employeeContainsDepartment: boolean = false;;

  constructor(private departmentService: DepartmentService, private employeeService: EmployeeService, private refreshTokenService: RefreshTokenService,
    private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    this.getAllDepartments();
    this.employeeService.getEmployees()
                          .subscribe((result: Employee[]) => (this.employees = result));
  }

  getAllDepartments(){
    this.departmentService.getDepartments()
                          .subscribe((result: Department[]) => (this.departments = result));
  }

  updateDepartment(department: Department) {
    this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(sessionStorage.getItem("jwt")!))
    let token = sessionStorage.getItem("jwt")
    if(token != null){
      department.updateClicked = true;
    }
    else{
      alert("You are not authorized to update a department.")
    }
  }

  saveDepartment(department: Department) {
    this.departmentService.updateDepartments(department).subscribe(({
      next: () => {
        this.getAllDepartments()
        department.updateClicked = false;
      },
      error: response => {
          console.error(response)
          alert("You are not authorized to create an employee.")
          department.updateClicked = false;
      }
      }))
  }

  deleteDepartment(department: Department){
    this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(sessionStorage.getItem("jwt")!))
    //Check if there is an employee working in the department that is trying to be deleted
    this.employees.forEach(element => {
      if(element.departmentNo == department.departmentNo){
        this.employeeContainsDepartment = true;
      }
    });
    console.log(this.employeeContainsDepartment)
    
    if(this.employeeContainsDepartment == true){
      alert("Cannot delete this department because it contains employees");
      this.employeeContainsDepartment = false;
    }
    else{
      this.departmentService.deleteDepartment(department).subscribe({
        next: () => {
          this.getAllDepartments()
        },
        error: response => {
          console.error(response)
          alert("You are not authorized to delete a department.")
        }
        });
    } 
  }

  createDepartment(department: Department){
    this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(sessionStorage.getItem("jwt")!))
    
    if(department.departmentName != "" && department.departmentLocation != ""){
      this.departmentService.createDepartment(department).subscribe({
        next: () => {
          this.getAllDepartments()
        },
        error: response => {
            console.error(response)
            alert("You are not authorized to create a department.")
        }
        });
    }
    else{
      alert("departmentName and departmentLocation must be filled.")
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
