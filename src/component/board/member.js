//import './../../assets/scss/style.scss';
import {
  HttpClient
} from 'aurelia-http-client';
import { Members } from './../../model/member';
import { inject } from 'aurelia-framework';
import { validationMessages } from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../bootstrap-form-renderer';
import { bindable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Prompt } from './../my-modal/my-modal';
import {
  ValidationControllerFactory,
  ValidationRules
} from 'aurelia-validation';
@inject(ValidationControllerFactory, HttpClient, DialogService)
export class Member {
  @bindable member;
  controller = null;
  constructor(controllerFactory, httpClient, dialogService) {
    this.httpClient = httpClient;
    this.dialogService = dialogService;
    validationMessages.customMessage1 = '\${$displayName} should be more than 3 characteres';
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
  }
  members = [];
  firstName = '';
  lastName = '';
  userName = '';
  memberUser;
  newMember;
  // memberId;
  boardid;
  addMemToBoard;
  addMember() {
    if (/^\s*$/.test(this.userName)) {
      this.controller.validate();
    } else {
      if (this.getMemberid()) {
        this.userName = '';
      }
    }
  }
  getMemberid() {
    // console.log(1);
    this.httpClient.get('member/' + this.userName)
      .then(data => {
        let resultMember = JSON.parse(data.response).rows[0];
        // console.log(resultMember);
        if (resultMember) {
          this.result = this.members.find((item) => item.userName === this.userName);
          if (this.result) {
            this.my_message = 'A user is avaiable in board with this username';
          } else {
            this.tempMem = new Members(this.member.boardid, resultMember.memberid, this.userName);
            this.members.push(this.tempMem);
            this.addMemberToBoard();
            this.my_message = null;
            return true;
          }
        } else {
          this.my_message = 'There is no user with this username!';
          return false;
        }
        return false;
      });
  }
  addMemberToBoard() {
    this.addMemToBoard = {
      'boardid': this.tempMem.boardid,
      'memberid': this.tempMem.memberid
    };
    this.httpClient.post('addMemberToBoard',
      JSON.stringify(this.addMemToBoard)
    )
      .then(data => {
        console.log(data);
      });
  }
  attached() {
    this.boards = this.getMembers();
  }
  getMembers() {
    console.log(this.member);
    this.httpClient.get('members/' + this.member.boardid)
      .then(data => {
        for (let i = 0; i < JSON.parse(data.response).rows.length; i++) {
          // this.memberUser = JSON.parse(data.response).rows[i].username;
          this.httpClient.get('member/' + JSON.parse(data.response).rows[i].username)
            .then(dataResponse => {
              let memberId = JSON.parse(dataResponse.response).rows[0].memberid;
              console.log(memberId);
              this.createMember(this.member.boardid, memberId, JSON.parse(data.response).rows[i].username);
              // this.tempMem.memberid = resultMember.memberid;
              // this.tempMem.boardid = this.member.boardid;
              // console.log(this.memberId);
            });

          // console.log(this.tempMem);
        }
      });
    // console.log(this.members);
  }
  createMember(boardid, memberid, user) {
    let tempMem = new Members(boardid, memberid, user);
    this.members.push(tempMem);
  }
  deleteMember(member) {
    console.log(member);
    // this.userName = UserName;
    this.dialogService.open({ viewModel: Prompt, model: 'Member will be deleted. Continue?', lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('ok');
        for (let i = 0; i < this.members.length; i++) {
          if (this.members[i].userName === member.userName) {
            // this.boardid = this.members[i].memberid;
            console.log('delete');
            this.members.splice(i, 1);
            // console.log('members?boardid=' + member.boardid + '&memberid=' + member.memberid);
            this.httpClient.delete('member?boardid=' + member.boardid + '&memberid=' + member.memberid)
              .then(data => {
                console.log(JSON.parse(data.response));
              });
          } else {
            console.log('cancel  in else');
          }
        }
      }
      // break;
    });
  }
  // let x = document.getElementById('member' + UserName);
  // x.parentNode.removeChild(x);
  // console.log('todo deleted');
  // this.deleteAllTasks(todoid);
  // this.getMemberid();
}
ValidationRules
  .ensure(a => a.userName).required()
  // .ensure(a => a.firstName).required()
  .on(Member);
