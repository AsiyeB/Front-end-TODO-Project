
export class ToDo {
  tasks = [];
  boardId = '';
  header = '';
  todoid;
  constructor(header) {
    this.header = header;
  }
  // addTask(newTask) {
  //   if (newTask.description) {
  //     this.tasks.push(newTask);
  //   }
  // }
  addTask(newTask) {
    if (newTask.description) {
      this.tasks.push(newTask);
    }
  }
}
