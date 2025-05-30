import "./styles.css";
import Todo from "./todo";
import { projects, addProject, deleteProject } from "./projectManager";

projects[0].addTodo(new Todo("test", "test", "test", "test"));
console.log(projects);