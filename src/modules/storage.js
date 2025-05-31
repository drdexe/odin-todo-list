import Project from "./project";

export default class Storage {
  static saveToLocal(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static retrieveFromLocal() {
    const storedProjectsData = localStorage.getItem("projects");
    if (storedProjectsData) {
      const plainProjects = JSON.parse(storedProjectsData);
      return plainProjects.map(projectObj => Project.fromJSON(projectObj));
    }
    const projects = [new Project("Main")];
    Storage.saveToLocal(projects);
    return projects;
  }
}