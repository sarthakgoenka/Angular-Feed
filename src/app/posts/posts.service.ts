import {Post} from "./post.model";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
@Injectable({
  providedIn:'root'
})
export class PostsService {
  constructor(private http: HttpClient, private router:Router) {
  }
  private posts : Post[] = [];
  private postUpdate = new Subject<{posts:Post[], postCount:number}>();

  getPosts(postPerPage:number, currentPage:number){
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{message:string, posts: any,  maxPosts:number}>('http://localhost:3000/api/posts'+queryParams)
      .pipe(map(postData=>{
        return{
          posts:postData.posts.map(post=>{
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }
        }),
        maxPosts:postData.maxPosts};
      }))
      .subscribe(updatedPostData=>{
        // console.log(updatedPostData);
        this.posts = updatedPostData.posts;
        console.log(updatedPostData);
        this.postUpdate.next({posts: [...this.posts], postCount:updatedPostData.maxPosts });
      })
  }

  getPost(id:string){
    // return {...this.posts.find(p=>p.id === id)};
    return this.http.get<{_id:string, title:string, content:string, imagePath:string, creator: string}>
    ('http://localhost:3000/api/posts/'+ id);
  }

  getUpdatePostListener(){
    return this.postUpdate.asObservable();
    }
  addPost(title:string, content:string, image:File){
    // const post:Post = {id:null, title: title, content:content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message:string, post:Post}>('http://localhost:3000/api/posts', postData)
      .subscribe(resData=>{
      //   const post:Post = {id:resData.post.id, title:title, content:content, imagePath:resData.post.imagePath};
      // this.posts.push(post);
      // this.postUpdate.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId:string){
    return this.http.delete('http://localhost:3000/api/posts/'+ postId);
  }

  updatePost(id:string, title:string, content:string, image: File|string){
    // const post:Post = {id:id, title:title, content:content, imagePath:null};
    let postData:Post | FormData;
    if(typeof(image) ===  'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }else{
    postData = {id:id, title:title, content:content, imagePath:image, creator:null}
    }

    this.http.put('http://localhost:3000/api/posts/'+ id, postData)
      .subscribe(response=>{
        // console.log(response)
        // const updatedPost = [...this.posts];
        // const oldPostIndex = updatedPost.findIndex(p=>p.id === id);
        // const post:Post = {id:id, title:title, content:content, imagePath: ""};
        // updatedPost[oldPostIndex] = post;
        // this.posts =  updatedPost
        // this.postUpdate.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

}
