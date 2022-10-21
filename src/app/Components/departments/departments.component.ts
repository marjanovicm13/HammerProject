import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Employee } from 'src/app/Models/Employee/employee';
import { DepartmentService } from 'src/app/Services/department.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { Department } from '../../Models/Department/department';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  departments: Department[] = [];
  employees: Employee[] = [];
  employeeContainsDepartment: boolean = false;
  textToSave: BlobPart = "";

  constructor(private departmentService: DepartmentService, private employeeService: EmployeeService,
    private elementRef: ElementRef) { }

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
    department.updateClicked = true;
  }

  saveDepartment(department: Department) {
    this.departmentService.updateDepartments(department).subscribe(() => this.getAllDepartments());
    department.updateClicked = false;
  }

  deleteDepartment(department: Department){
    //Check if there is an employee working in the department that is trying to be deleted
    this.employees.forEach(element => {
      if(element.departmentNo == department.departmentNo){
        this.employeeContainsDepartment = true;
      }
    });
    
    if(this.employeeContainsDepartment == true){
      alert("Cannot delete this department because it contains employees");
      this.employeeContainsDepartment = false;
    }
    else{
      this.departmentService.deleteDepartment(department).subscribe(() => this.getAllDepartments());
    }
  }

  createDepartment(department: Department){
    this.departmentService.createDepartment(department).subscribe(() => this.getAllDepartments());
  }

  getJson(){
    let myJson = JSON.stringify(this.departments, null, 2)
    let x = window.open();
    x?.document.open();
    x?.document.write('<html><body><pre>' + myJson + '</pre></body></html>');
    x?.document.close();
  }

}
