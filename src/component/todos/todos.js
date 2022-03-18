import './../../assets/scss/style.scss';
import {
  ValidationControllerFactory, ValidationRules, validationMessages
} from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../bootstrap-form-renderer';
import { ToDo } from './../../model/todo';
import { Board } from './../../model/board';
import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Prompt } from './../my-modal/my-modal';

@inject(ValidationControllerFactory, HttpClient, DialogService)

export class Todos {
  todos = [];
  tempBoard;
  boards = [];
  counter = 0;
  click = 0;
  todoName = '';
  controller = null;
  error;
  tt = [];
  totalTodos = 0;
  tempTodo;
  newTodo;
  constructor(controllerFactory, httpClient, dialogService) {
    this.httpClient = httpClient
      .configure(x => {
        x.withHeader('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
      });
    validationMessages.customMessage1 = '\${$displayName} should be more than 2 characteres';
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.dialogService = dialogService;
  }
  activate(a, b, c) {
    this.initBoardId = +a.boardId;
  }
  attached() {
    console.log('first');
    this.getBoards();
  }
  information(boardid) {
    this.getTodos(this.selected_board.boardid);
  }
  addTodo() {
    this.counter++;
    if (this.counter % 2 === 1) {
      this.click = 1;
    } else {
      this.click = 0;
    }
  }
  submit() {
    if (this.todoName === '' || /^\s*$/.test(this.todoName)) {
      this.error = true;
      this.controller.validate();
    } else {
      // this.tempTodo = new ToDo(this.todoName);
      // this.tempTodo.tasks = [];

      // console.log(this.todos);
      for (let i = 0; i < this.boards.length; i++) {
        if (this.boards[i].boardid === this.selected_board.boardid) {
          this.addTodos();
          // this.boards[i].todos = [];
          // this.getTodos();
        }
      }
      // this.boards.todos = [];
      // this.addTodos();
      // this.getTodos();
      // this.getBoards();

      this.click = 0;
      this.todoName = '';
      this.counter--;
      this.error = false;
    }
  }
  addTodos() {
    this.newTodo = {
      'header': this.todoName,
      'boardid': this.selected_board.boardid
    };
    this.httpClient.post('todo',
      JSON.stringify(this.newTodo)
    )
      .then(data => {
        console.log(data.response);
        let result = JSON.parse(data.response);
        // console.log(this.boards , this.selected_board ,this.boards[this.selected_board.boardid]);
        this.selected_board.todos = result.rows;
        this.getTodos(this.selected_board.boardid);
      });
  }
  getBoards() {
    // this.information(this.selected_board.boardid);
    this.httpClient.get('boards')
      .then(data => {
        for (let i = 0; i < JSON.parse(data.response).length; i++) {
          this.boards.push(new Board(JSON.parse(data.response)[i].nameboard, JSON.parse(data.response)[i].ownerid));
          this.boards[i].boardid = JSON.parse(data.response)[i].boardid;
        }
        if (!this.initBoardId) {
          this.selected_board = this.boards[0];
          this.information(this.selected_board.boardid);
        } else {
          this.selected_board = this.boards.find((item) => item.boardid === this.initBoardId);
          console.log(this.selected_board, this.boards, this.initBoardId);
          this.information(this.selected_board.boardid);
        }
      });
  }
  getTodos(boardid) {
    // this.boards[boardid].todos = [];
    this.httpClient.get('todo?boardid=' + boardid)
      .then(data => {
        for (let i = 0; i < this.boards.length; i++) {
          if (this.boards[i].boardid === boardid) {
            for (let j = 0; j < JSON.parse(data.response).length; j++) {
              this.boards[i].todos[j] = (JSON.parse(data.response)[j]);
            }
            this.todos = this.boards[i].todos;
            // console.log(this.todos);
          }
        }
      });
  }
  deleteTodos(todoid) {
    this.deleteTodo(todoid);
  }
  deleteTodo(todoid) {
    this.dialogService.open({ viewModel: Prompt, model: 'Todo will be deleted. Continue?', lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('ok');
        for (let i = 0; i < this.todos.length; i++) {
          if (this.todos[i].todoid === todoid) {
            console.log('length is: ' + this.todos.length);
            this.todos.splice(i, 1);
            console.log('new length is: ' + this.todos.length);
            // break;
          }
        }
        let x = document.getElementById('todo' + todoid);
        x.parentNode.removeChild(x);
        console.log('todo deleted');
        this.deleteAllTasks(todoid);
        this.httpClient.delete(`todo/${todoid}`)
          .then(data => {
            console.log(JSON.parse(data.response).rows);
            //  this.deleteTodo(todoid);
          });
      } else {
        console.log('cancel');
      }
      console.log(response.output);
    });
  }
  deleteAllTasks(todoid) {
    this.httpClient.delete(`todo/tasks/${todoid}`)
      .then(data => {
        console.log(JSON.parse(data.response).rows);
      });
  }
  // updateTodos(todoid) {

  // this.newtodoName
  //   this.currTodo = {
  //     'header': this.newtodoName,
  //     'boardid': this.selected_board.boardid
  //   };
  //   this.httpClient.put('todo',
  //     JSON.stringify(this.currTodo)
  //   )
  //     .then(data => {
  //       console.log(data.response);
  //       let result = JSON.parse(data.response);
  //       // console.log(this.boards , this.selected_board ,this.boards[this.selected_board.boardid]);
  //       this.selected_board.todos = result.rows;
  //       this.getTodos(this.selected_board.boardid);
  //     });
  // }
}
ValidationRules.ensure(a => a.todoName).required().on(Todos);
