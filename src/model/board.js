//import { Members } from './member';
export class Board {
  name;
  username;
  todos = [];
  memberList = [];
  boardid = '';
  constructor(name, username) {
    this.name = name;
    this.username = username;
    //this.ownerLname = ownerLname;
  }
  // addMember(newMember) {
  //   if (newMember) {
  //     this.members.push(new Members(newMember));
  //   }
  // }
}
