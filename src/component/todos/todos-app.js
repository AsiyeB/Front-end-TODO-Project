import './../../assets/scss/style.scss';
// import { computedFrom } from 'aurelia-framework';
// import { inject } from 'aurelia-dependency-injection';
import {
  ValidationControllerFactory, ValidationRules, validationMessages
} from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../bootstrap-form-renderer';
import { ToDo } from './../../model/todo';

import { observable } from 'aurelia-framework';

import { bindable } from 'aurelia-framework';
import { Task } from './../../model/task';
import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Prompt } from './../my-modal/my-modal';
@inject(ValidationControllerFactory, HttpClient, DialogService)
export class TodosApp {
  //allDone;
  @observable('todo')
  @bindable todo;
  @bindable deleteTodos;
  newTask = '';
  error = false;
  controller = null;
  tasks = [];
  newT;
  // picture = 'http://maz.todo.partdp.ir/images/img5.png';
  constructor(controllerFactory, httpClient, dialogService) {
    this.httpClient = httpClient;
    validationMessages.customMessage1 = '\${$displayName} should be more than 2 characteres';
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.dialogService = dialogService;
  }
  attached() {
    // console.log('Todos tasks');
    this.getTasks(this.todo.todoid);
    //////////////////
    this.newtodoName = this.todo.header;
    /////////////////
    console.log('todo.tasks[] is ' + this.todo.tasks);
  }
  checkDone() {
    this.allDone = false;
    this.httpClient.get('todo/check/' + this.todo.todoid).then(data => {
      if (Number(JSON.parse(data.response).rows[0].count) === this.todo.tasks.length) {
        this.allDone = true;
      } else {
        this.allDone = false;
      }
    });
  }

  getTasks(todoid) {
    // console.log('first');
    console.log('todoid of todo is ' + todoid);
    console.log('todoname of todo is ' + this.todo.header);
    this.httpClient.get('task?todoId=' + todoid)
      .then(data => {
        // console.log('second');
        this.todo.tasks = JSON.parse(data.response).rows;
        for (let i = 0; i < this.todo.tasks.length; i++) {
          // console.log(this.todo.tasks[i]);
          // this.getImage();
          // this.tasks[i] = new Task(this.todo.tasks[i].description, this.todo.tasks[i].checked, this.todo.tasks[i].memberid, this.todo.tasks[i].todoid, this.todo.tasks[i].taskid);
          this.getImage(this.todo.tasks[i].taskid);
          this.tasks[i] = new Task(this.todo.tasks[i].description, this.todo.tasks[i].checked, this.todo.tasks[i].memberid, this.todo.tasks[i].todoid, this.todo.tasks[i].taskid, this.todo.tasks[i].image);
        }
        // console.log(this.todo.tasks[0]);
        // this.tasks = this.todo.tasks;
      });
  }
  addTasks() {
    this.newT = {
      'todoId': this.todo.todoid,
      'checked': false,
      'description': this.newTask,
      'memberId': 12
    };
    this.httpClient.post('task',
      JSON.stringify(this.newT)
    )
      .then(data => {
        console.log(data.response);
        let result = JSON.parse(data.response);
        this.todo.tasks = result.rows;
        console.log(this.todo.tasks);
        this.getTasks(this.todo.todoid);
        console.log(data);
      });
  }
  addTask() {
    if (this.newTask === '' || /^\s*$/.test(this.newTask)) {
      this.error = true;
      console.log(this.error);
      this.controller.validate();
    } else {
      // this.todo.addTask(new Task(this.newTask));
      this.addTasks();
      // this.checkDone();
      this.newTask = '';
      this.checkDone();
      this.error = false;
    }
  }
  updateTask(taskid) {
    // debugger;
    for (let i = 0; i < this.todo.tasks.length; i++) {
      if (this.todo.tasks[i].taskid === taskid) {
        // debugger;
        console.log('memberid!!!!!!!!!!!!!!!');

        this.newT = {
          'todoId': this.todo.todoid,
          'checked': this.todo.tasks[i].checked,
          'description': this.todo.tasks[i].description
        };
      }
    }
    this.httpClient.put(`task/${taskid}`,
      JSON.stringify(this.newT)
    )
      .then(data => {
        console.log(data.response);
        let result = JSON.parse(data.response);
        this.todo.tasks = result.rows;
        this.getTasks(this.todo.todoid);
        console.log(data);
        console.log('getImage function commented');
        this.getImage(taskid);
      });
  }
  deleteTask(taskid) {
    this.dialogService.open({ viewModel: Prompt, model: 'Task will be deleted. Continue?', lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('ok');
        for (let i = 0; i < this.todo.tasks.length; i++) {
          if (this.todo.tasks[i].taskid === taskid) {
            console.log('length is: ' + this.todo.tasks.length);
            // this.todo.tasks[i].taskid;
            this.todo.tasks.splice(i, 1);
            console.log('new length is: ' + this.todo.tasks.length);
            // break;
          }
        }
        let x = document.getElementById('id' + taskid);
        x.parentNode.removeChild(x);
        console.log('deleted');
        this.httpClient.delete(`task/${taskid}`)
          .then(data => {
            console.log(JSON.parse(data.response).rows);
            // this.deleteTask(taskid);
          });
      } else {
        console.log('cancel');
      }
      console.log(response.output);
    });
  }
  deleteTasks(taskid) {
    this.deleteTask(taskid);
    // this.httpClient.delete(`task/${taskid}`)
    //   .then(data => {
    //     console.log(JSON.parse(data.response).rows);
    //     // this.deleteTask(taskid);
    //   });
  }
  getImage(taskid) {
    console.log('getimage');

    this.httpClient.get('task/image/' + taskid)
      .then(data => {
        const image = JSON.parse(data.response).rows[0].image;
        // this.picture = `http://maz.todo.partdp.ir/images/${image}`;
        // console.log('image is ' + image);

        for (let i = 0; i < this.todo.tasks.length; i++) {
          if (this.todo.tasks[i].taskid === taskid) {
            // this.todo.tasks[i].image = `http://localhost:5000/images/${image}`;
            this.todo.tasks[i].image = `http://maz.todo.partdp.ir/images/${image}`;
          }
        }
      });
  }
  update() {
    this.updateClick = 1;
  }
  updateTodos(todoid) {
    // this.newtodoName = this.todo.header;
    this.currTodo = {
      'header': this.newtodoName,
      'boardid': this.todo.boardid
    };
    this.todo.header = this.currTodo.header;
    this.httpClient.put((`todo/${todoid}`),
      JSON.stringify(this.currTodo)
    )
      .then(data => {
        console.log(data.response);
        // let result = JSON.parse(data.response);
        // console.log(this.boards , this.selected_board ,this.boards[this.selected_board.boardid]);
        // this.selected_board.todos = result.rows;
        // this.getTodos(this.selected_board.boardid);
      });
    this.updateClick = 0;
  }
}
ValidationRules.ensure(a => a.newTask).required().withMessage('').on(TodosApp);
