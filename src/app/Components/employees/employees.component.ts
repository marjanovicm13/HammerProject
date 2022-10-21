import { Component, OnInit, ElementRef } from '@angular/core';
import { Employee } from 'src/app/Models/Employee/employee';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];
  textToSave: BlobPart = "";

  constructor(private employeeService: EmployeeService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees(){
    this.employeeService.getEmployees()
                        .subscribe((result: Employee[]) => (this.employees = result));
  }

  deleteEmployee(employee: Employee){
    this.employeeService.deleteEmployee(employee).subscribe(() => this.getAllEmployees());
  }

  createEmployee(employee: Employee){
    this.employeeService.createEmployee(employee).subscribe(() => this.getAllEmployees());
  }

  updateEmployee(employee: Employee){
    employee.updateClicked = true;
  }

  saveEmployee(employee: Employee){
    this.employeeService.updateEmployee(employee).subscribe(() => this.getAllEmployees());
    employee.updateClicked = false;
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
