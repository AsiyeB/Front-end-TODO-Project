import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { validationMessages } from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../bootstrap-form-renderer';
import {
  ValidationControllerFactory,
  ValidationRules
} from 'aurelia-validation';
import { Board } from './../../model/board';
// @inject(HttpClient)
import { DialogService } from 'aurelia-dialog';
import { Prompt } from './../my-modal/my-modal';
@inject(ValidationControllerFactory, HttpClient, DialogService)
export class TotalBoard {
  controller = null;
  constructor(controllerFactory, httpClient, dialogService) {
    this.httpClient = httpClient
      .configure(x => {
        x.withHeader('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
      });
    validationMessages.customMessage1 = '\${$displayName} should be more than 3 characteres';
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.dialogService = dialogService;
  }
  count = 0;
  send = 0;
  boardList = [];
  clickAdd;
  boardName;
  // owner = '';
  ownerFname;
  ownerLname;
  newBoard;
  newOwner;
  ownerid;
  boardJosn;
  boardid;
  username;
  form() {
    this.clickAdd = 1;
  }
  addBoard() {
    let board = new Board(this.boardName, this.username);
    board.boardid = this.boardid;
    this.boardList.push(board);
  }
  submit() {
    if (this.boardName === '') this.controller.validate();
    else if (/^\s*$/.test(this.boardName) || /^\s*$/.test(this.owner)) {
      this.controller.validate();
    } else {
      console.log(11);
      // this.addOwnerTodb();
      this.addBoardToDb();
      // console.log(22);
      // this.addBoard();
    }
  }
  attached() {
    this.boards = this.getBoards();
  }
  getBoards() {
    console.log('get boards in board page');
    this.httpClient.get('boards')
      .then(data => {
        const board = JSON.parse(data.response);
        console.log(JSON.parse(data.response));
        //console.log(board);
        for (let i = 0; i < JSON.parse(data.response).length; i++) {
          console.log(board[i]);
          this.boardName = board[i].nameboard;
          this.username = board[i].username;
          this.boardid = board[i].boardid;
          this.ownerid = board[i].ownerid;
          // this.getUsername();
          // this.getNameOwnerByid(ownerid);
          //this.getMembersBoard(boardid);
          //console.log(2);
          this.addBoard();
          this.boardName = '';
          this.username = '';
          //this.ownerLname = '';
          this.boardid = '';
        }
      });
  }
  // addOwnerTodb() {
  //   this.newMember = {
  //     'firstname': this.ownerFname,
  //     'lastname': this.ownerLname
  //   };
  //   this.httpClient.post('member',
  //     JSON.stringify(this.newMember)
  //   )
  //     .then(data => {
  //       // this.todos.push(this.todoName);
  //       // this.boards[this.selected_board.boardid].todos = [];
  //       // this.getTodos(this.selected_board.boardid);
  //       this.getOwnerid();
  //     });
  //   // this.firstName = '';
  //   // this.lastName = '';
  //   console.log(33);
  // }


  getUsername() {
    this.httpClient.get('username/' + this.ownerid)
      .then(data => {
        console.log(JSON.parse(data.response).rows[0]);
        this.username = JSON.parse(data.response).rows[0].username;
        this.addBoard();
        //this.addBoardToDb();
        // this.firstName = JSON.parse(data.response).rows[i].firstname;
      });
  }
  addBoardToDb() {
    this.boardJosn = {
      'name': this.boardName
    };
    this.httpClient.post('board',
      JSON.stringify(this.boardJosn)
    )
      .then(data => {
        console.log(data);
        this.getBoards();
        // this.getBoardid();
      });
  }
  // getBoardid() {
  //   console.log(66);
  //   this.httpClient.get('lastBoard')
  //     .then(data => {
  //       console.log(JSON.parse(data.response));
  //       this.boardid = JSON.parse(data.response).rows[0].boardid;
  //       //this.getBoards();
  //       //this.matchBoardIdWithOwner();
  //       this.addBoard();
  //       // this.firstName = JSON.parse(data.response).rows[i].firstname;
  //     });
  // }

  deleteBoards(boardid) {
    this.deleteBoard(boardid);
  }
  deleteBoard(boardid) {
    this.dialogService.open({ viewModel: Prompt, model: 'Board will be deleted. Continue?', lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('ok');
        let temp;
        for (let i = 0; i < this.boardList.length; i++) {
          if (this.boardList[i].boardid === boardid) {
            temp = i;
            // break;
          }
        }
        // let x = document.getElementById('board' + boardid);
        // x.parentNode.removeChild(x);
        console.log('board deleted');
        this.httpClient.delete(`board/${boardid}`)
          .then(data => {
            //console.log(JSON.parse(data.response).rows);
            console.log('delete');
            console.log('length is: ' + this.boardList.length);
            this.boardList.splice(temp, 1);
            console.log('new length is: ' + this.boardList.length);
            //  this.deleteTodo(todoid);
          });
      } else {
        console.log('cancel');
      }
      console.log(response.output);
    });
  }
}

ValidationRules
  .ensure(a => a.boardName).required()
  .ensure(a => a.ownerFname).required()
  .ensure(a => a.ownerLname).required()
  .on(TotalBoard);
