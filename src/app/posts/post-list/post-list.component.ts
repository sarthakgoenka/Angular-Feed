import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../posts.service";
import {Post} from "../post.model";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
posts:Post[]  = [];
isLoading = false;
totalPosts = 0;
postsPerPage = 2;
currentPage = 1;
pageSizeOptions = [1,2,5,10];
private postsSub:Subscription;
  constructor(private postService:PostsService) { }

  ngOnInit(): void {
    this.isLoading = true
   this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postService.getUpdatePostListener()
      .subscribe((postData:{posts:Post[], postCount:number})=>{
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }
  onDeletePost(id:string){
    this.isLoading = true;
      this.postService.deletePost(id).subscribe(()=>{
        this.postService.getPosts(this.postsPerPage,this.currentPage);
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
  }
}
