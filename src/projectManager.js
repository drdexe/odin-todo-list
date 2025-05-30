import Project from "./project";

export const projects = [new Project("main")];

export function addProject(name) {
  projects.push(new Project(name));
}

export function deleteProject(id) {
  projects = projects.filter(project => project.id !== id);
}