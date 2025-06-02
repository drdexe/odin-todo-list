import { format } from "date-fns";
import projectManager from "./projectManager.js";

import projectIcon from "./../assets/icons/list-box-outline.svg";
import deleteIcon from "./../assets/icons/trash-can-outline.svg";
import circleIcon from "./../assets/icons/circle-outline.svg";
import checkIcon from "./../assets/icons/check-circle.svg";
import editIcon from "./../assets/icons/square-edit-outline.svg";
import plusIcon from "./../assets/icons/plus.svg";

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
    deleteImage.alt = "delete";
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
      button.addEventListener("click", createProjectPage);
      button.addEventListener("click", handleActiveProject);
    });

    deleteIcons.forEach(icon => {
      icon.addEventListener("click", handleDeleteProject);
    });
  }

  function createProjectPage(e) {
    const li = e.target.closest("li");
    const projectId = li.dataset.projectId;
    const project = projectManager.getProject(projectId);

    const projectPage = document.querySelector(".project-todos");
    projectPage.textContent = "";

    createProjectHeader(project);
    createTodoList(project);
    createNewTodoButton();
  }

  function getTodoForm(todo = null) {
    const todoForm = document.createElement("form");
    todoForm.classList.add("todo-form");

    let submitButtonClass, submitButtonText;
    let title = "", description = "", dueDate = "", priority = "";
    if (!todo) {
      submitButtonClass = "add";
      submitButtonText = "Add";
    } else {
      todoForm.dataset.todoId = todo.id;
      submitButtonClass = "save";
      submitButtonText = "Save";
      title = todo.title;
      description = todo.description || "";
      dueDate = todo.dueDate || "";
      priority = todo.priority || "";
    }

    todoForm.innerHTML = `
      <input type="text" placeholder="Title" required value="${title}">
      <textarea placeholder="Description">${description}</textarea>
      <button type="submit" class="${submitButtonClass}">${submitButtonText}</button>
      <input type="date" value="${dueDate}">
      <select name="priority" id="priority">
        <option value="" ${!priority ? "selected" : ""} disabled hidden>Priority</option>
        <option value="low" ${priority === "low" ? "selected" : ""}>Low</option>
        <option value="medium" ${priority === "medium" ? "selected" : ""}>Medium</option>
        <option value="high" ${priority === "high" ? "selected" : ""}>High</option>
      </select>
      <button type="button" class="cancel">Cancel</button>
    `
    return todoForm;
  }

  function createProjectHeader(project) {
    const projectPage = document.querySelector(".project-todos");

    const h1 = document.createElement("h1");
    h1.textContent = project.name;

    projectPage.appendChild(h1);
  }

  function createTodoList(project) {
    const projectPage = document.querySelector(".project-todos");

    const ul = document.createElement("ul");
    ul.classList.add("todo-list");
    ul.dataset.projectId = project.id;

    project.todos.forEach(todo => {
      const li = getTodoItem(todo);
      ul.appendChild(li);
    });

    projectPage.appendChild(ul);
  }

  function createNewTodoButton() {
    const projectPage = document.querySelector(".project-todos");

    const newTodoButton = document.createElement("button");
    newTodoButton.classList.add("new-todo-button");

    const plusImage = document.createElement("img");
    plusImage.src = plusIcon;
    plusImage.alt = "";
    plusImage.width = 30;
    plusImage.height = 30;

    const span = document.createElement("span");
    span.textContent = "New Todo";

    newTodoButton.appendChild(plusImage);
    newTodoButton.appendChild(span);
    projectPage.appendChild(newTodoButton);

    newTodoButton.addEventListener("click", openNewTodoForm);
  }

  function openNewTodoForm() {
    const projectPage = document.querySelector(".project-todos");
    const newTodoButton = document.querySelector(".new-todo-button");
    const newTodoForm = getTodoForm();

    projectPage.removeChild(newTodoButton);
    projectPage.appendChild(newTodoForm);

    initTodoForm();
    toggleEditButtons();
  }

  function initTodoForm() {
    const addButton = document.querySelector(".todo-form > .add");
    const saveButton = document.querySelector(".todo-form > .save");
    const cancelButton = document.querySelector(".todo-form > .cancel");

    if (addButton) {
      addButton.addEventListener("click", handleNewTodo);
    }
    if (saveButton) {
      saveButton.addEventListener("click", handleEditTodo);
    }
    cancelButton.addEventListener("click", closeTodoForm);
  }

  function handleNewTodo(e) {
    e.preventDefault();

    const newTodoForm = document.querySelector(".todo-form");
    const titleInput = document.querySelector('.todo-form > input[type="text"]');
    const descriptionInput = document.querySelector(".todo-form > textarea");
    const dueDateInput = document.querySelector('.todo-form > input[type="date"]');
    const priorityInput = document.querySelector("#priority");

    const ul = newTodoForm.previousElementSibling;
    const projectId = ul.dataset.projectId;

    if (newTodoForm.reportValidity()) {
      const newTodo = projectManager.addTodo(projectId, {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value
      });
      const li = getTodoItem(newTodo);
      ul.appendChild(li);
      closeTodoForm();
    }
  }

  function handleEditTodo(e) {
    e.preventDefault();

    const editTodoForm = document.querySelector(".todo-form");
    const titleInput = document.querySelector('.todo-form > input[type="text"]');
    const descriptionInput = document.querySelector(".todo-form > textarea");
    const dueDateInput = document.querySelector('.todo-form > input[type="date"]');
    const priorityInput = document.querySelector("#priority");

    const ul = editTodoForm.previousElementSibling;
    const projectId = ul.dataset.projectId;
    const todoId = editTodoForm.dataset.todoId;

    if (editTodoForm.reportValidity()) {
      projectManager.editTodo(projectId, todoId, {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value
      });
      const oldLi = document.querySelector(`[data-todo-id="${todoId}"]`);
      const newLi = getTodoItem(projectManager.getTodo(projectId, todoId));
      ul.replaceChild(newLi, oldLi);
      closeTodoForm();
    }
  }

  function closeTodoForm() {
    const projectPage = document.querySelector(".project-todos");
    const todoForm = document.querySelector(".todo-form");

    projectPage.removeChild(todoForm);
    createNewTodoButton();
    toggleEditButtons();
  }

  function getTodoItem(todo) {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.dataset.todoId = todo.id;
    if (todo.priority) {
      li.classList.add(todo.priority);
    }

    createTodoLeft(li, todo);
    createTodoRight(li, todo);
    createTodoBottom(li, todo);

    initTodoButtons(li);
    return li;
  }

  function initTodoButtons(li) {
    li.addEventListener("click", handleTodoDescription);

    const editButton = li.querySelector(".right button:nth-child(2)");
    editButton.addEventListener("click", openEditTodoForm);

    const deleteButton = li.querySelector(".right button:last-child");
    deleteButton.addEventListener("click", handleDeleteTodo);
  }

  function handleTodoDescription(e) {
    const li = e.target.closest("li");
    if (li.classList.contains("expanded")) {
      li.classList.remove("expanded");
    } else {
      li.classList.add("expanded");
    }
  }

  function createTodoLeft(li, todo) {
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("left");

    const completeButton = getTodoCompleteButton(todo);

    const span = document.createElement("span");
    span.textContent = todo.title;
    if (todo.complete) {
      span.classList.add("complete");
    }

    leftDiv.appendChild(completeButton);
    leftDiv.appendChild(span);
    li.appendChild(leftDiv);
  }

  function getTodoCompleteButton(todo) {
    const completeButton = document.createElement("button");
    const circleImage = document.createElement("img");

    if (todo.complete) {
      circleImage.src = checkIcon;
    } else {
      circleImage.src = circleIcon;
    }
    circleImage.alt = "check";
    circleImage.width = 25;
    circleImage.height = 25;

    completeButton.appendChild(circleImage);
    completeButton.addEventListener("click", toggleTodoComplete);
    return completeButton;
  }

  function toggleTodoComplete(e) {
    e.stopPropagation();

    const ul = e.target.closest("ul");
    const projectId = ul.dataset.projectId;
    const li = e.target.closest("li");
    const todoId = li.dataset.todoId;

    const todo = projectManager.getTodo(projectId, todoId);
    projectManager.toggleTodoComplete(projectId, todoId);

    const leftDiv = li.querySelector(".left");
    leftDiv.replaceChild(getTodoCompleteButton(todo), leftDiv.firstChild);

    const span = leftDiv.querySelector("span");
    if (todo.complete) {
      span.classList.add("complete");
    } else {
      span.classList.remove("complete");
    }
  }

  function createTodoRight(li, todo) {
    const rightDiv = document.createElement("div");
    rightDiv.classList.add("right");

    const span = document.createElement("span");
    span.textContent = format(new Date(todo.dueDate), "eee, do MMM");

    const editButton = document.createElement("button");
    const editImage = document.createElement("img");
    editImage.src = editIcon;
    editImage.alt = "edit";
    editImage.width = 25;
    editImage.height = 25;
    editButton.appendChild(editImage);

    const deleteButton = document.createElement("button");
    const deleteImage = document.createElement("img");
    deleteImage.src = deleteIcon;
    deleteImage.alt = "delete";
    deleteImage.width = 25;
    deleteImage.height = 25;
    deleteButton.appendChild(deleteImage);

    rightDiv.appendChild(span);
    rightDiv.appendChild(editButton);
    rightDiv.appendChild(deleteButton);
    li.appendChild(rightDiv);
  }

  function openEditTodoForm(e) {
    const projectPage = document.querySelector(".project-todos");
    const newTodoButton = document.querySelector(".new-todo-button");

    const ul = e.target.closest("ul");
    const projectId = ul.dataset.projectId;
    const li = e.target.closest("li");
    const todoId = li.dataset.todoId;
    const todo = projectManager.getTodo(projectId, todoId);
    const newTodoForm = getTodoForm(todo);

    projectPage.removeChild(newTodoButton);
    projectPage.appendChild(newTodoForm);

    initTodoForm();
    toggleEditButtons();
  }

  function toggleEditButtons() {
    const editButtons = document.querySelectorAll(".right > button:nth-child(2)");
    editButtons.forEach(button => {
      button.disabled = !button.disabled;
    });
  }

  function handleDeleteTodo(e) {
    e.stopPropagation();

    const ul = e.target.closest("ul");
    const projectId = ul.dataset.projectId;
    const li = e.target.closest("li");
    const todoId = li.dataset.todoId;

    projectManager.deleteTodo(projectId, todoId);
    deleteTodoItem(todoId);
  }

  function deleteTodoItem(todoId) {
    const todoList = document.querySelector(".todo-list");
    const li = document.querySelector(`[data-todo-id="${todoId}"]`);
    todoList.removeChild(li);
  }

  function createTodoBottom(li, todo) {
    if (!todo.description) return;
    const bottomDiv = document.createElement("div");
    bottomDiv.classList.add("bottom");
    bottomDiv.textContent = todo.description;

    li.appendChild(bottomDiv);
  }

  function handleActiveProject(e) {
    const projectButtons = document.querySelectorAll(".project-button");

    projectButtons.forEach(button => {
      button.classList.remove("active");
    });

    e.target.classList.add("active");
  }

  function handleDeleteProject(e) {
    e.stopPropagation();

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

    addButton.addEventListener("click", handleNewProject);
    cancelButton.addEventListener("click", closeNewProjectForm);
  }

  function handleNewProject(e) {
    e.preventDefault()

    const newProjectForm = document.querySelector(".new-project-form");
    const nameInput = document.querySelector(".new-project-form > input");

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