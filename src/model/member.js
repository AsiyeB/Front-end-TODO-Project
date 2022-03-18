// export class Members {
//   firstName;
//   lastName;
//   memberid = '';
//   constructor(firstName, lastName) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//   }
// }
export class Members {
  userName = '';
  memberid = '';
  boardid = '';
  image = '';
  constructor( boardid, memberid, userName) {
    this.userName = userName;
    this.boardid = boardid;
    this.memberid = memberid;
    // this.lastName = lastName;
  }
}
