import { Component, OnInit, ElementRef } from '@angular/core';
import { Employee } from 'src/app/Models/Employee/employee';
import { EmployeeService } from 'src/app/Services/employee.service';
import { RefreshTokenService } from 'src/app/Services/refresh-token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];
  textToSave: BlobPart = "";

  constructor(private employeeService: EmployeeService, private refreshTokenService: RefreshTokenService, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees(){
    this.employeeService.getEmployees()
                        .subscribe((result: Employee[]) => (this.employees = result));
  }

  deleteEmployee(employee: Employee){
    this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(sessionStorage.getItem("jwt")!))

      this.employeeService.deleteEmployee(employee).subscribe({
        next: () => {
          this.getAllEmployees()
        },
        error: response => {
          console.error(response)
          alert("You are not authorized to delete an employee.")
        }
        });

  }

  createEmployee(employee: Employee){
    this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(sessionStorage.getItem("jwt")!))

    if(employee.employeeName != ""){
      this.employeeService.createEmployee(employee).subscribe({
        next: () => {
          this.getAllEmployees()
        },
        error: response => {
            console.error(response)
            alert("You are not authorized to create an employee.")
        }
        });
    }
    else{
      alert("employeeName, salary and departmentNo must be filled.")
    }
  }

  updateEmployee(employee: Employee){
    this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(sessionStorage.getItem("jwt")!))
    let token = sessionStorage.getItem("jwt")
    if(token != null){
      employee.updateClicked = true;
    }
    else{
      alert("You are not authorized to update an employee.")
    }
  }

  saveEmployee(employee: Employee){
    //this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(sessionStorage.getItem("jwt")!))
    this.employeeService.updateEmployee(employee).subscribe(({
      next: () => {
        this.getAllEmployees()
        employee.updateClicked = false;
      },
      error: response => {
          console.error(response)
          alert("You are not authorized to create an employee.")
          employee.updateClicked = false;
      }
      }))
    
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
      this.textToSave += "|" + element.employeeNo + "         |" + element.employeeName +  " ".repeat((18 - element.employeeName.length)) +   "|"  + element.salary  + " ".repeat((8 - element.departmentNo.toString.length)) + "|" + element.departmentNo + " ".repeat((13 - element.departmentNo.toString.length)) +  "|\n";
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
