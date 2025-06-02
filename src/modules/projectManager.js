import Todo from "./todo.js";
import Project from "./project.js";
import Storage from "./storage.js";

export default (function createProjectManager() {
  const projects = Storage.retrieveFromLocal();

  function getProjects() {
    return projects;
  }

  function getProject(id) {
    return getProjects().find(project => project.id === id);
  }

  function addProject(name) {
    const project = new Project(name);
    projects.push(project);
    Storage.saveToLocal(projects);
    return project;
  }

  function deleteProject(id) {
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) projects.splice(index, 1);
    Storage.saveToLocal(projects);
  }

  function getTodo(projectId, todoId) {
    const project = getProject(projectId);
    if (!project) return null;
    return project.getTodo(todoId);
  }

  function addTodo(projectId, { title, description, dueDate, priority }) {
    const project = getProject(projectId);
    if (project) {
      const todo = new Todo(title, description, dueDate, priority);
      project.addTodo(todo);
      Storage.saveToLocal(projects);
      return todo;
    }
    return null;
  }

  function deleteTodo(projectId, todoId) {
    const project = getProject(projectId)
    if (project) {
      project.deleteTodo(todoId);
      Storage.saveToLocal(projects);
    }
  }

  function editTodo(projectId, todoId, updatedFields) {
    const todo = getTodo(projectId, todoId);
    if (todo) {
      todo.edit(updatedFields);
      Storage.saveToLocal(projects)
    }
  }

  function toggleTodoComplete(projectId, todoId) {
    const todo = getTodo(projectId, todoId);
    if (todo) {
      todo.toggleComplete();
      Storage.saveToLocal(projects);
    }
  }

  return {
    getProjects,
    getProject,
    addProject,
    deleteProject,
    getTodo,
    addTodo,
    deleteTodo,
    editTodo,
    toggleTodoComplete
  };
})();