export default class Project {
  constructor(name, todos = []) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.todos = todos;
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}