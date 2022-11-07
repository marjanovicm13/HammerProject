import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/Services/employee.service';
import { QueriesService } from 'src/app/Services/queries.service';
import { Employee } from 'src/app/Models/Employee/employee';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})
export class QueriesComponent implements OnInit {

  constructor(private queriesService: QueriesService, private employeeService: EmployeeService) { }

  showAvgSalary: boolean = false;
  showLocations: boolean = false;
  showDevelopmentLocations: boolean = false;
  showSecondHighestSalary: boolean = false;
  showDepartmentView: boolean = false;
  showIncreaseSalary: boolean = false;
  showDecreaseSalary: boolean = false;
  avgSalaryIs: any
  locations: any 
  developmentLocations: any
  secondHighestSalary: any
  departmentView: any
  employeeNo!: number
  increasePercentage!: number
  employees: Employee[] = []
  checkEmployeeNo: boolean = false
  employeeArray: number[] = []
  decreasePercentage!: number

  ngOnInit(): void {
    this.getEmployees()
  }

  async getEmployees(){
    (await this.employeeService.getEmployees())
    .subscribe((result: Employee[]) => {
      this.employees = result
      this.employees.forEach(employee => {
        this.employeeArray.push(employee.employeeNo)
      });
    });
  }

  avgSalary(){
    if(this.showAvgSalary != true){
      this.showAvgSalary = true;
      this.queriesService.getAvgSalary().subscribe((response) => {
        this.avgSalaryIs = JSON.parse(JSON.stringify(response))
      })
    }
    else{
      this.showAvgSalary = false;
    }
  }

  getLocations(){
    if(this.showLocations != true){
      this.showLocations = true;
      this.queriesService.getLocations().subscribe((response) => {
        this.locations = JSON.parse(JSON.stringify(response))
      })
    }
    else{
      this.showLocations = false;
    }
  }

  getDevelopmentLocations(){
    if(this.showDevelopmentLocations != true){
      this.showDevelopmentLocations = true;
      this.queriesService.getDevelopmentLocations().subscribe((response) => {
        this.developmentLocations = JSON.parse(JSON.stringify(response))
      })
    }
    else{
      this.showDevelopmentLocations = false;
    }
  }

  getSecondHighestSalary(){
    if(this.showSecondHighestSalary != true){
      this.showSecondHighestSalary = true;
      this.queriesService.getSecondHighestSalary().subscribe((response) => {
        this.secondHighestSalary = JSON.parse(JSON.stringify(response))
      })
    }
    else{
      this.showSecondHighestSalary = false;
    }
  }

  getDepartmentView(){
    if(this.showDepartmentView != true){
      this.showDepartmentView = true;
      this.queriesService.getDepartmentView().subscribe((response) => {
        this.departmentView = JSON.parse(JSON.stringify(response))
      })
    }
    else{
      this.showDepartmentView = false;
    }
  }

  increaseSalary(){
    if(this.showIncreaseSalary != true){
      this.showIncreaseSalary = true;
    }
    else{
      this.showIncreaseSalary = false;  
    }
  }

  submitSalary(employeeNo: number, increasePercentage: number){
    if(increasePercentage == null){
      alert("Increase percentage is empty.")
    } 
    else if(this.employeeArray.includes(employeeNo)){
      this.queriesService.increaseSalary(employeeNo, increasePercentage).subscribe((response)=>{
        alert("Salary increased.")
      })
    }
    else{
      alert("Employee number is empty or it doesn't exist.")
    }
  }

  decreaseSalary(){
    if(this.showDecreaseSalary != true){
      this.showDecreaseSalary = true;
    }
    else{
      this.showDecreaseSalary = false;  
    }
  }

  submitDecreaseSalary(employeeNo: number, decreasePercentage: number){
    if(decreasePercentage == null){
      alert("Decrease percentage is empty.")
    } 
    else if(this.employeeArray.includes(employeeNo)){
      this.queriesService.decreaseSalary(employeeNo, decreasePercentage).subscribe((response)=>{
        alert("Salary decreased.")
      })
    }
    else{
      alert("Employee number is empty or it doesn't exist.")
    }
  }
}
