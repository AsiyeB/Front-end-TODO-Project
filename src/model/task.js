export class Task {
  checked;
  image = './../image/img1.png';
  memberid;
  description;
  todoid;
  taskid;
  constructor(description, checked, memberid, todoid, taskid) {
    this.description = description;
    this.image = './../image/img1.png';
    this.memberid = memberid;
    this.checked = checked;
    this.todoid = todoid;
    this.taskid = taskid;
  }
}
