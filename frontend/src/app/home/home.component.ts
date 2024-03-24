import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  blogs: any[] = [];
  visible: boolean = false;
  selectedBlog: any;
  errorMessage: string | null = null;
  updateForm!: FormGroup;
  updateDialogVisible: boolean = false;
  updatedBlog: any;
  
  constructor(private blogService: ServiceService ,private router: Router ,private formBuilder: FormBuilder) {
    this.fetchBlogs();
   }


  ngOnInit(): void {



    this.updateForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      tags: [[], [Validators.required]],
      category: ['', Validators.required]
    });
  }



  showDialog(blog: any) {
    this.selectedBlog = blog;
      this.visible = true;
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  fetchBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (response: any) => {
        if (response) {
          console.log(response);
          
          this.blogs = response.data;
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }

  createNewBlog(){
    this.router.navigate(['/create']); 
  }


  deleteSelectedBlog(): void {
    console.log(this.selectedBlog._id);
    
    if (this.selectedBlog) {
      this.blogService.deleteBlog(this.selectedBlog._id).subscribe(
        () => {
          console.log('Blog deleted successfully');
          this.fetchBlogs();
          this.visible = false; 
        },
        (error) => {
  if (error.status === 403) {
    this.showError('User is not allowed to perform this action');

       
          } else {
            console.error('Error deleting blog:', error);
          }
        }
      );
    }
  }

  showupdateDialog(blog: any) {
    this.selectedBlog = blog;
    this.updatedBlog = { ...blog };
    this.updateForm.patchValue({
      title: this.updatedBlog.title,
      body: this.updatedBlog.body,
      tags: this.updatedBlog.tags,
      category: this.updatedBlog.category
    });
    this.updateDialogVisible = true;
  }

  closeUpdateDialog() {
    this.updateDialogVisible = false;
  }


  updateBlog() {
    console.log(this.selectedBlog);
    
    if (this.updateForm.valid && this.selectedBlog) {
      

      this.blogService.updateBlog(this.selectedBlog._id, this.updateForm.value).subscribe(
        (response) => {
          console.log('Blog updated successfully:', response);
          this.updateForm.reset();
          this.updateDialogVisible = false;
        },
        (error) => {
          console.error('Error updating blog:', error);
          if (error.status === 403) {
            this.showError('User is not allowed to perform this action');
          }
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }
  
  }
