import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { Http,Headers,RequestOptions} from '@angular/http';

const uri ='http://localhost:8080/authentication/profileImage';
const token =localStorage.getItem('token');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //imageUrl: string = "/assets/img/tigar.jpg";
  firstName;
  lastName;
  username;
  email;
  selectedFile: File;
  fileToUpload: File = null;

  filesToUpload: Array<File>;

  uploader:FileUploader = new FileUploader({
      url:uri,
      authToken: token

});
  attachmentList:any = [];

 // uploader:FileUploader;
 // response:string;
    options;
    authToken;
  //filePath;

 // url = 'http://localhost:8080/authentication/profileImage';


  constructor(
    private authService:AuthorizationService,
  //  private formBuilder:FormBuilder,
  //  private http:Http
  ) { 
    //this.uploadAll();
  //  this.filesToUpload = [];
  this.uploader.onCompleteItem = (item:any, response:any , status:any, headers:any) => {
    this.attachmentList.push(JSON.parse(response));
    console.log(response);
  }
}


loadToken(){
  const token=localStorage.getItem('token');
  this.authToken=token;
}

/*
  upload() {
    this.makeFileRequest("http://localhost:8080/authentication/profileImage", [], this.filesToUpload).then((result) => {
        console.log(result);
    }, (error) => {
        console.error(error);
    });
}

fileChangeEvent(fileInput: any){
  this.filesToUpload = <Array<File>> fileInput.target.files;
}
makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
  return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for(var i = 0; i < files.length; i++) {
          formData.append("uploads[]", files[i], files[i].name);
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                  resolve(JSON.parse(xhr.response));
              } else {
                  reject(xhr.response);
              }
          }
      }
      
      xhr.open("POST", url ,true);
      xhr.setRequestHeader('authorization',localStorage.getItem('token'));
      xhr.send(formData);
  });
}

*/
/*
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  OnSubmit(Caption,Image){
    this.authService.postFile(this.fileToUpload).subscribe(
      data =>{
        console.log('done');
        Image.value = null;
        this.imageUrl = "/assets/img/tigar.jpg";
      }
    );
  }
*/

/*

  uploadAll(){
    this.uploader = new FileUploader({
      authToken:localStorage.getItem('token'),
      url: this.url,
      disableMultipart: true, 
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.response = '';
    console.log(this.uploader);
    this.uploader.response.subscribe( res => this.response = res );
    console.log(this.response);
  }
*/

/*
  onFileChanged(event) {
    const file = event.target.files[0];
    this.filePath=file.filePath;
    console.log(this.filePath);

  }

  onUpload(){
    this.authService.onUpload(this.selectedFile);
  }
  */
/*
onFileChange(event) {
  let reader = new FileReader();
  if(event.target.files && event.target.files.length > 0) {
    let file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.get('avatar').setValue({
        filename: file.name,
        filetype: file.type,
        value: reader.result.split(',')[1]
      })
    };
  }
}
*/
/*
onSubmit() {
  const formModel = this.form.value;
  this.loading = true;
  // In a real-world app you'd have a http request / service call here like
  // this.http.post('apiUrl', formModel)
  setTimeout(() => {
    console.log(formModel);
    alert('done!');
    this.loading = false;
  }, 1000);
}

clearFile() {
  this.form.get('avatar').setValue(null);
  this.fileInput.nativeElement.value = '';
}

*/
 
  

  ngOnInit() {
    this.loadToken();
    this.authService.getProfile().subscribe(profile => {
      this.firstName=profile.user.firstName;
      this.lastName=profile.user.lastName;
      this.username = profile.user.username;
      this.email = profile.user.email; 
    
    });
  }
}
