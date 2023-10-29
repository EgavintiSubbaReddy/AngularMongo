import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";    //import
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularExpress';
  userList : any =[];
  data : any;
  expresponse : string="";
  constructor(private http : HttpClient){
  }

  getAllUsers(){
    this.http.get('http://localhost:8000/allUsers').subscribe((response)=>{
      this.userList = response;
      console.log(this.userList);
    });
  }

  addUser(udata : any){
    this.http.post('http://localhost:8000/addUsers',udata.value).subscribe((response)=>{
    this.expresponse=response.toString();  
    });
  }
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:8000/delete`, { body: { uid: userId } }).subscribe((response) => {
        console.log(response);
        this.getAllUsers();
      });
    }
  }

  updateUser(user: any) {
    const updatedUserData = {
      userId: user.userId, // Use "userId"
      password: user.password, // Include the updated data
      emailId: user.emailId,
    };
  
    this.http.put('http://localhost:8000/update', updatedUserData).subscribe((response) => {
      this.expresponse = response.toString();
      this.getAllUsers(); // Optionally, you can update the user list after updating
    });
  }  
    
 
}