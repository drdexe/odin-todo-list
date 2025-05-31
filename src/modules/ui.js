import Todo from "./todo.js";
import Project from "./project.js";
import Storage from "./storage.js";
import projectManager from "./projectManager.js";

import projectIcon from "./../assets/icons/list-box-outline.svg";
import deleteIcon from "./../assets/icons/trash-can-outline.svg";

export default (function () {
  function loadProjects() {
    projectManager.getProjects().forEach(project => {
      createProjectTab(project);
    });
    initNewProjectButton();
    initNewProjectForm()
  }

  function createProjectTab(project) {
    const projectsList = document.querySelector(".projects-list");

    const li = document.createElement("li");
    li.dataset.projectId = project.id;

    const button = document.createElement("button");
    button.classList.add("project-button");

    const projectImage = document.createElement("img");
    projectImage.src = projectIcon;
    projectImage.alt = "";
    projectImage.width = 25;
    projectImage.height = 25;

    const span = document.createElement("span");
    span.textContent = project.name;

    const deleteImage = document.createElement("img");
    deleteImage.src = deleteIcon;
    deleteImage.alt = "";
    deleteImage.classList.add("delete-icon");
    deleteImage.width = 25;
    deleteImage.height = 25;

    button.appendChild(projectImage);
    button.appendChild(span);
    button.appendChild(deleteImage);
    li.appendChild(button);
    projectsList.appendChild(li);

    initProjectButtons();
  }

  function initProjectButtons() {
    const projectButtons = document.querySelectorAll(".project-button");
    const deleteIcons = document.querySelectorAll(".delete-icon");

    projectButtons.forEach(button => {
      button.addEventListener("click", handleActiveProject);
    });

    deleteIcons.forEach(icon => {
      icon.addEventListener("click", handleDeleteProject);
    });
  }

  function handleActiveProject(e) {
    const projectButtons = document.querySelectorAll(".project-button");

    projectButtons.forEach(button => {
      button.classList.remove("active");
    });

    e.target.classList.add("active");
  }

  function handleDeleteProject(e) {
    const li = e.target.closest("li");
    const projectId = li.dataset.projectId;
    projectManager.deleteProject(projectId);
    deleteProjectTab(projectId);
  }

  function deleteProjectTab(projectId) {
    const projectsList = document.querySelector(".projects-list");
    const li = document.querySelector(`[data-project-id="${projectId}"]`)
    projectsList.removeChild(li);
  }

  function initNewProjectButton() {
    const newProjectButton = document.querySelector(".new-project-button");
    newProjectButton.addEventListener("click", openNewProjectForm);
  }

  function openNewProjectForm() {
    const newProjectButton = document.querySelector(".new-project-button");
    const newProjectForm = document.querySelector(".new-project-form");

    newProjectButton.classList.add("active");
    newProjectForm.classList.add("active");
  }

  function initNewProjectForm() {
    const addButton = document.querySelector(".new-project-form > .add");
    const cancelButton = document.querySelector(".new-project-form > .cancel");

    addButton.addEventListener("click", handleNewProjectForm);
    cancelButton.addEventListener("click", closeNewProjectForm);
  }

  function handleNewProjectForm(e) {
    const newProjectForm = document.querySelector(".new-project-form");
    const nameInput = document.querySelector(".new-project-form > input");
    e.preventDefault();
    if (newProjectForm.reportValidity()) {
      const newProjectName = nameInput.value;
      const newProject = projectManager.addProject(newProjectName);
      createProjectTab(newProject);
      newProjectForm.reset();
      closeNewProjectForm();
    }
  }

  function closeNewProjectForm() {
    const newProjectButton = document.querySelector(".new-project-button");
    const newProjectForm = document.querySelector(".new-project-form");

    newProjectButton.classList.remove("active");
    newProjectForm.classList.remove("active");
    newProjectForm.reset();
  }

  return { loadProjects };
})();