const btn_addTask = document.getElementById("add-task");
const taskList = document.querySelector(".task-list");
let maxTasks = 25;
let keysDown = {shift: false, enter: false};
let editing = null;

const log = document.getElementById("log");

if (Notification.permission !== "granted") {
    Notification.requestPermission();
    notify("Thanks for enabling the notification feature for reminders!  This is how a notification will look, in future.");
}


function clearStorage() {
    data = [];
    localStorage.clear();
}

let data = JSON.parse(localStorage.getItem("tasks"));
//clearStorage();

if (data !== null) {
    loadTasks();
} else {
    data = [];
}

function reloadTasks() {
    const allTaskContainers = document.querySelectorAll(".task-container");

    allTaskContainers.forEach(element => {
        taskList.removeChild(element);
    });
    loadTasks();
}

function loadTasks() {
    for (let i = 0; i < data.length; i++) {
        loadTask(i);
    }
    console.clear();
}

function loadTask(index) {
    let complete = data[index].complete;
        let text = data[index].text;
        addTask(text);
        const allTaskContainers = document.querySelectorAll(".task-container");
        setTaskStatus(allTaskContainers[index].querySelector(".task-status"), complete);
}

let dragIndex = {initial: null, new: null};
function addTask(text) {
    if (checkTaskLimit()) {
        return;
    }
        
    //Task Container
    const newTaskContainer = document.createElement("div");
    newTaskContainer.className = "task-container";
    newTaskContainer.style.width = 80 + "%";
    newTaskContainer.style.height = 50 + "px";
    newTaskContainer.setAttribute("draggable", true);
     
    newTaskContainer.addEventListener("dragstart", function(event) {
        dragIndex.initial = findTaskIndex(newTaskContainer);
    });

    newTaskContainer.addEventListener("dragover", function(event) {
        event.preventDefault();
        
    });

    newTaskContainer.addEventListener("drop", function(event) {
        //event.preventDefault();
        console.log(data);
        dragIndex.new = findTaskIndex(newTaskContainer);
        const removedElement = data.splice(dragIndex.initial, 1)[0];
        data.splice(dragIndex.new, 0, removedElement);
        
        //Update DOM
        reloadTasks();

        updateLocalStorage();
        dragIndex = {initial: null, new: null};
    });


    //Task Status
    const grabHandle = document.createElement("div");
    grabHandle.classList.add("grab-handle");
    grabHandle.style.width = 30 + "px";
    grabHandle.style.height = 50 + "px";
    grabHandle.innerText = "\u{22EE}";


    //Task Status
    const newTaskStatus = document.createElement("div");
    newTaskStatus.classList.add("btn");
    newTaskStatus.classList.add("task-status");
    newTaskStatus.style.width = 50 + "px";
    newTaskStatus.style.height = 50 + "px";

    //Task Info
    const newTask = document.createElement("div");
    newTask.innerText = text;
    newTask.className = "task";
    newTask.style.width = "calc(100% - 100px)";
    newTask.style.height = 50 + "px";

    //Delete Button
    const deleteButton = document.createElement("div");
    deleteButton.innerText = "X";
    deleteButton.classList.add("btn");
    deleteButton.classList.add("task-delete");
    deleteButton.style.width = 50 + "px";
    deleteButton.style.height = 50 + "px";

    //Display
    taskList.appendChild(newTaskContainer);
    newTaskContainer.appendChild(grabHandle)
    newTaskContainer.appendChild(newTaskStatus)
    newTaskContainer.appendChild(newTask);
    newTaskContainer.appendChild(deleteButton);
}

const taskStatus = document.querySelectorAll(".task-status");
const taskElements = document.querySelectorAll(".task");

//Task List Listener
document.addEventListener("click", handleInput);

function handleInput(event) {
    const target = event.target;

    if (target.id === "btn-del-all") {
        deleteAllTasks();
    }
    if (target.id === "btn-complete-all") {
        statusOfAll(true);
    }
    if (target.id === "btn-incomplete-all") {
        statusOfAll(false);
    }
    if (target.id === "btn-del-all-complete") {
        delAllComplete();
    }

    if (target.id === "add-task") {
        request_addTask();
    }
    if (target.classList.contains("task-status")) {
        if (data[findTaskIndex(target.parentElement)].complete) {
            setTaskStatus(target, false);
        } else {
            setTaskStatus(target, true);
        }
    }
    if (target.classList.contains("task-delete")) {
        deleteTask(target.parentElement);

        const editContainer = document.querySelector(".edit-container");
        if (editContainer) {
            editContainer.remove();
        }
    }

    if (!target.classList.contains("input-edit") && !target.classList.contains("submit-edit") && !target.classList.contains("task")) {
        closeEditing();
    }
    if (target.classList.contains("task")) {
        editTask(target);
    }

    updateLocalStorage();
}

function deleteAllTasks() {
    if (!keysDown.shift) {
        if (!confirm("Are you sure you want to delete all tasks? ('Shift + Button click' will delete all tasks without confirmation.)")) {
            return;
        }
    }

    const allTaskContainers = document.querySelectorAll(".task-container");

    allTaskContainers.forEach((taskContainer) => {
        keysDown.shift = true;
        deleteTask(taskContainer);
        keysDown.shift = false;
    });
}

function statusOfAll(status) {
    let statusText;
    if (status) {
        statusText = "complete";
    } else {
        statusText = "incomplete";
    }
    if (!keysDown.shift && !confirm(`Are you sure you want to mark all tasks ${statusText}? ('Shift + Button click' will do this without confirmation.)`)) {
        return;
    }

    const allStatusElements = document.querySelectorAll(".task-status");

    allStatusElements.forEach((statusElements) => {
        setTaskStatus(statusElements, status);
    });
}

function closeEditing() {
    const editContainer = document.querySelector(".edit-container");
    if (editContainer) {
        if (!confirm("You have not saved the task. Are you sure you want to finish editing?")) {
            return;
        }
        editContainer.remove();
    }
}

//function set for inputs
function request_addTask() {
    let newTaskText = document.getElementById("new-task-text").value;
    if (checkTaskLimit()) {
        return;
    }
    data.push({complete: false, text: newTaskText});
    addTask(newTaskText);
    updateLocalStorage();

    //Clear Input
    document.getElementById("new-task-text").value = "";
}

function setTaskStatus(element, completion) {
    
    if (completion) {
        element.innerText = "✔";
        data[findTaskIndex(element.parentElement)].complete = true;
    } else {
        element.innerText = "";
        data[findTaskIndex(element.parentElement)].complete = false;
    }

    updateLocalStorage();
}

function delAllComplete() {
    if (!keysDown.shift && !confirm(`Are you sure you want to mark all tasks ? ('Shift + Button click' will do this without confirmation.)`)) {
        return;
    }

    const allTskStatus = document.querySelectorAll(".task-status");

    allTskStatus.forEach((task) => {
        if (task.innerText === "✔") {
            keysDown.shift = true;
            deleteTask(task.parentElement);
            keysDown.shift = false;
        }
        
    });
}

function deleteTask(element) {
        if (keysDown.shift === false) {
            if (!confirm("Are you sure you want to delete this task? ('Shift + Button click' will delete the task without confirmation.)")) {
                return;
            }
        }

    console.log(element);
    data.splice(findTaskIndex(element), 1);
    taskList.removeChild(element);
    updateLocalStorage();
    console.log(data);
}

function editTask(task) {
    if (document.querySelector(".edit-container")) {
        closeEditing();
        if (document.querySelector(".edit-container")) {
            return;
        }
    }

    const taskContainer = task.parentElement;
    editing = task;

    let editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");

    let inputEdit = document.createElement("input");
    inputEdit.classList.add("input-edit");
    inputEdit.maxLength = 50;

    let submitEdit = document.createElement("button");
    submitEdit.classList.add("btn");
    submitEdit.classList.add("submit-edit");

    editContainer.appendChild(inputEdit);
    editContainer.appendChild(submitEdit);
    
    //Insert Edit Area
    let index = findTaskIndex(taskContainer);
    if (taskContainer.nextSibling) {
        taskContainer.parentElement.insertBefore(editContainer, taskContainer.nextSibling);
    } else {
        // If taskContainer doesn't have a next sibling, append editContainer to the parent
        taskContainer.parentElement.appendChild(editContainer);
    }

    inputEdit.value = task.innerText;
    submitEdit.innerText = "Submit";

    submitEdit.addEventListener("click", function() {
        submitTaskEdit(task, inputEdit, index, editContainer);

        updateLocalStorage();
    });
}

function submitTaskEdit(task, inputEdit, index, editContainer) {
    task.innerText = inputEdit.value;
    data[index].text = task.innerText;

    editContainer.remove();
    updateLocalStorage();
    editing = null;
    document.removeEventListener('click', editTask);
}

function findTaskIndex(element) {
    const allTaskContainers = document.querySelectorAll(".task-container");
    let elementIndex;
    for (let i = 0; i < allTaskContainers.length; i++) {
        if (allTaskContainers[i] === element) {
            elementIndex = i;
            break;
        }
    }
    return elementIndex;
}

function updateLocalStorage() {
    //console.log(data)
    let data_serialized = JSON.stringify(data);
    localStorage.setItem("tasks", data_serialized);
    //console.log(localStorage);
    data = JSON.parse(localStorage.getItem("tasks"));
    //console.log(data);
}

function checkTaskLimit() {
    const allTaskContainers = document.querySelectorAll(".task-container");
    if (allTaskContainers.length >= maxTasks) {
        alert(`Careful! Maximum Tasks reached - ${maxTasks}`)
        return true;
    }
}

function notify(text) {
   new Notification(text); 
}

// Event listener for key press
document.addEventListener("keydown", function(event) {
    const key = event.key;
    switch (key) {
        case "Shift":
            keysDown.shift = true;
        break;

        case "Enter":
            keysDown.enter = true;
            if (txtCursorPos === "new-task-text") {
                request_addTask();
            }
            if (txtCursorPos === "input-edit") {
                const task = editing;
                const inputEdit = document.querySelector(".input-edit");
                const index = findTaskIndex(task.parentElement);
                const editContainer = document.querySelector(".edit-container");
                submitTaskEdit(task, inputEdit, index, editContainer);
            }
            
        break;
    }
});

document.addEventListener("keyup", function(event) {
    const key = event.key;
    switch (key) {
        case "Shift":
            keysDown.shift = false;
        break;

        case "Enter":
            keysDown.enter = false;
        break;
    }
});

//Track text cursor
let txtCursorPos = null;

document.getElementById("new-task-text").addEventListener('blur', () => {
    if (txtCursorPos === "new-task-text") {
        txtCursorPos = null;
    }
});

document.addEventListener('focusin', (event) => {
    let target = event.target;
    if (target.id === "new-task-text") {
        txtCursorPos = "new-task-text";
    }
    if (target.classList.contains("input-edit")) {
        txtCursorPos = "input-edit";
    }
});

