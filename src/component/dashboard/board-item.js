import { bindable } from 'aurelia-framework';
// import { Board } from './../../model/board';
import './../../assets/scss/style.scss';
import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
@inject(HttpClient)
export class BoardItem {
  @bindable board;
  imageURL;
  constructor(httpClient) {
    this.httpClient = httpClient
      .configure(x => {
        x.withHeader('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
      });
  }
  attached() {
    // console.log(this.board);
    this.getNumberOfTodos(this.board.boardid);
    this.getNumTaskOfBoard(this.board.boardid);
    this.getNumRemainTaskOfBoard(this.board.boardid);
    this.getMemebers(this.board.boardid);
  }
  getNumberOfTodos(boardid) {
    this.httpClient.get('todoNumber/' + boardid)
      .then(data => {
        this.board.totalTodos = JSON.parse(data.response);
      });
  }
  getNumRemainTaskOfBoard(boardId) {
    this.httpClient.get('remainTaskNumber/' + boardId)
      .then(data => {
        this.board.remainTask = Number(JSON.parse(data.response));
        if (Number(JSON.parse(data.response)) === 0) {
          // console.log('all task done');
          this.board.done = 'Done_visible';
        }
      });
  }
  getNumTaskOfBoard(boardid) {
    this.httpClient.get('taskNumber/' + boardid)
      .then(response => response)
      .then(data => {
        this.board.totalTasks = Number(JSON.parse(data.response));
      });
  }
  getMemebers(boardid) {
    console.log('getMmebers');
    this.httpClient.get('members/' + boardid)
      .then(response => response)
      .then(data => {
        let images = JSON.parse(data.response).rows;
        for (let i = 0; i < images.length; i++) {
          console.log(images[i]);
          this.imageURL = 'http://maz.todo.partdp.ir/images/' + images[i].image;
          this.board.memberList.push(this.imageURL);
          console.log(this.imageURL);
        }
      });
  }
}

