import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  blogs: any[] = [];
  visible: boolean = false;


  constructor(private blogService: ServiceService ,private router: Router) { }

  ngOnInit(): void {
    this.fetchBlogs();
  }



  showDialog() {
      this.visible = true;
  }


  fetchBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (response: any) => {
        // Assuming the response contains an array under a key like 'blogs'
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


  deleteBlog(blogId: string): void {
 
      // this.blogService.deleteBlog(blogId).subscribe(
      //   () => {
      //     console.log('Blog deleted successfully');
      //     this.fetchBlogs();
      //   },
      //   (error) => {
      //     console.error('Error deleting blog:', error);
      //   }
      // );
  
  }
  
}  