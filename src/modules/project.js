import Todo from "./todo.js";

export default class Project {
  constructor(name, todos = []) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.todos = todos;
  }

  getTodo(id) {
    return this.todos.find(todo => todo.id === id);
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  static fromJSON(obj) {
    const project = new Project(obj.name);
    project.id = obj.id;
    project.todos = obj.todos.map(todoObj => Todo.fromJSON(todoObj));
    return project;
  }
}