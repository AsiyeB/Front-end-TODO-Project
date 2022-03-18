import { observable } from 'aurelia-framework';
import { Task } from './../../model/task';
import { bindable } from 'aurelia-framework';
//import './../../assets/scss/style.scss';
import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
@inject(HttpClient)
export class TaskApp {
  @bindable task;
  @observable('picture')
  @bindable picture;
  imageTask = 'http://maz.todo.partdp.ir/images/img5.png';
  constructor(httpClient) {
    // this.imageTask = this.picture;
    this.httpClient = httpClient;
  }
  @bindable getImage;
  @bindable checkDone;
  @bindable updateTask;
  @bindable deleteTasks;
  attached() {
    this.checkDone();
    this.newtaskName = this.task.description;
  }
  checkChanged() {
    this.updateTask(this.task.taskid);
    this.checkDone();
    this.imageChange();
  }
  get() {
    this.imageChange();
  }

  imageChange() {
    console.log('hi');
    this.imageTask = this.picture;
  }
  update() {
    this.updateClick = 1;
  }
  updateDescription(taskid) {
    this.newT = {
      'todoId': this.task.todoid,
      'checked': this.task.checked,
      'description': this.newtaskName
    };
    this.task.description = this.newT.description;
    console.log('this.task.taskid: ', this.task.taskid);
    console.log(this.newT);

    this.httpClient.put((`task/${this.task.taskid}`),
      JSON.stringify(this.newT)
    )
      .then(data => {
        console.log(data.response);
      });
    this.updateClick = 0;
  }
}
