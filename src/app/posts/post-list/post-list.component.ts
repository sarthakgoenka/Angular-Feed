import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../posts.service";
import {Post} from "../post.model";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
posts:Post[]  = [];
userId:string;
isLoading = false;
totalPosts = 0;
postsPerPage = 4 ;
currentPage = 1;
pageSizeOptions = [1,2,5,10];
private postsSub:Subscription;
private authStatusub:Subscription;
userIsAuthenticated = false;
  constructor(private postService:PostsService, private authService:AuthService ) { }

  ngOnInit(): void {
    this.isLoading = true
    this.userId = this.authService.getUserId();
   this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postService.getUpdatePostListener()
      .subscribe((postData:{posts:Post[], postCount:number})=>{
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }
  onDeletePost(id:string){
    this.isLoading = true;
      this.postService.deletePost(id).subscribe(()=>{
        this.postService.getPosts(this.postsPerPage,this.currentPage);
      }, (err)=>{
        this.isLoading = false;
      });
  }

  onChangedPage(pageData:PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    // console.log(event);
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusub.unsubscribe();
  }
}
