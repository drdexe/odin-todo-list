import Project from "./project.js";
import Storage from "./storage.js";

export default (function createProjectManager() {
  const projects = Storage.retrieveFromLocal();

  function getProjects() {
    return projects;
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

  return { getProjects, addProject, deleteProject };
})();