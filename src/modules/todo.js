export default class Todo {
  constructor(title, description, dueDate, priority) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = false;
  }

  edit({ title, description, dueDate, priority }) {
    if (title !== undefined) this.title = title;
    if (description!== undefined) this.description = description;
    if (dueDate !== undefined) this.dueDate = dueDate;
    if (priority !== undefined) this.priority = priority;
  }

  toggleComplete() {
    this.complete = !this.complete;
  }

  static fromJSON(obj) {
    const todo = new Todo(obj.title, obj.description, obj.dueDate, obj.priority);
    todo.id = obj.id;
    todo.complete = obj.complete;
    return todo;
  }
}