import './../../assets/scss/style.scss';
import { bindable } from 'aurelia-framework';
import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
@inject(HttpClient)
export class Board {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  attached() {
    this.newboardName = this.board.name;
  }
  @bindable board;
  @bindable deleteBoards;
  update() {
    this.updateClick = 1;
  }
  updateBoard(boardid) {
    this.boardJosn = {
      'name': this.newboardName
    };
    this.board.name = this.newboardName;
    this.httpClient.put((`board/${this.board.boardid}`),
      JSON.stringify(this.boardJosn)
    )
      .then(data => {
        console.log(data);
      });
    this.updateClick = 0;
  }
}

