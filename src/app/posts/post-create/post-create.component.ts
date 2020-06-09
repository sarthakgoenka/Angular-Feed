import { Component, OnInit } from '@angular/core';
import {PostsService} from "../posts.service";
import {Post} from "../post.model";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap} from "@angular/router";
import validate = WebAssembly.validate;
import {mimeType} from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredValue = '';
  newPost = 'NO CONTENT';
  private postId: string;
  post:Post;
  private mode = 'create';
  isLoading = false;
  form:FormGroup;
  imagePreview: string;

  constructor(private  postService:PostsService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null,
        {validators :[Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators:[Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})

    })

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).
        subscribe(post=>{
          this.isLoading = false;
          this.post = {id:post._id,
            content:post.content,
            title:post.title,
            imagePath:post.imagePath,
            creator:post.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            imagePath: this.post.imagePath});
        });
      }
    });
  }

onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    // console.log(form.value.title, form.value.content);
    if(this.mode=== 'create'){
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else{
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
  }
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
