const btn_addTask = document.getElementById("add-task");
const taskList = document.querySelector(".task-list");
let maxTasks = 25;
let maxLists = 5;
let keysDown = {shift: false, enter: false};
let editing = null;

const listSelector = document.querySelector(".list-selector");
let selectedListIndex = null;

const log = document.getElementById("log");

if (Notification.permission !== "granted") {
    //Notification.requestPermission();
    //notify("Thanks for enabling the notification feature for reminders!  This is how a notification will look, in future.");
}


//LOAD DATA

function clearStorage() {
    data = [];
    localStorage.clear();
}

let data = JSON.parse(localStorage.getItem("data"));
if (data == null) {
    data = [];
}

let list;
if (data.length > 0) {
    loadList(0);
}

function loadList(index) {
    selectedListIndex = index;
    list = data[index];
    if (list == null) {
        loadListNavigator();
        reloadTasks();
        return;
    }
    reloadTasks();
    loadListNavigator();
    updateLocalStorage();
}


//Load Lists
function loadListNavigator() {
    const html_listSelector = document.querySelector('.list-selector');
    const allListLinks = html_listSelector.querySelectorAll(".list-link");
    allListLinks.forEach(function(link) {
        link.remove();
    });

    if (!list) {
        return;
    }

    data.forEach(function(list) {
        createListLink(list.name);
    });

    function createListLink(name) {
        
        const listLink = document.createElement("div");
        listLink.classList.add("list-link");
        listLink.style.cursor = "pointer";
        listLink.innerText = name;
        
        html_listSelector.appendChild(listLink);
    }

    if (data.length > 0) {
        const html_allListLinks = document.querySelectorAll('.list-link');
        html_allListLinks.forEach(function(link) {
            link.style.fontWeight = "normal";
        });
        html_allListLinks[selectedListIndex].style.fontWeight = "bold";
    }
    
}

function deleteList(index) {
    if (keysDown.shift === false) {
        if (!confirm("Are you sure you want to delete this list? ('Shift + Button click' will delete the list without confirmation.)")) {
            return;
        }
    }

    if (data.length <= 0) {
        return;
    }
    data.splice(index, 1);
    if (selectedListIndex >= data.length) {
        selectedListIndex--;
    }
    loadList(selectedListIndex);
}


//Program

function newList() {
    let newListName = document.getElementById("new-list-name").value;
    if (data.length >= maxLists) {
        return;
    }
    if (/^[\s\uFEFF\xA0]+$/.test(newListName)) {
        newListName = "[name]";
    }
    
    //Find Taken names
    let takenNames = [];
    if (list) {
        data.forEach(function(list) {
            takenNames.push(list.name);
        });
    }
    
    if (newListName) {
        takenNames.forEach(function(name) {
            checkNameValidity(name);
        });
    } else {
        newListName = "List " + JSON.stringify(data.length + 1);
        takenNames.forEach(function(name) {
            checkNameValidity(name);
        });
    }


    function checkNameValidity(name) {
        if (newListName === name) {
            newListName += "(d)";
        }
    }
    let newList = {
        name: `${newListName ? newListName: "List " + JSON.stringify(data.length + 1)}`,
        tasks: []
    }

    data.push(newList);
    selectedListIndex = data.length - 1;

    document.getElementById("new-list-name").value = ""; // Reset infput field
    loadList(selectedListIndex);

}

function reloadTasks() {
    const allTaskContainers = document.querySelectorAll(".task-container");

    allTaskContainers.forEach(element => {
        taskList.removeChild(element);
    });
    loadTasks();
}

function loadTasks() {
    if (!list || list.tasks.length === 0) {
        return;
    }
    for (let i = 0; i < list.tasks.length; i++) {
        loadTask(i);
    }
}

function loadTask(index) {
    let complete = list.tasks[index].complete;
        let text = list.tasks[index].text;
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
    newTaskContainer.style.width = 90 + "%";
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
        dragIndex.new = findTaskIndex(newTaskContainer);
        
        const removedElement = list.tasks.splice(dragIndex.initial, 1)[0];
        list.tasks.splice(dragIndex.new, 0, removedElement);
        
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
    newTaskContainer.appendChild(grabHandle);
    newTaskContainer.appendChild(newTaskStatus)
    newTaskContainer.appendChild(newTask);
    newTaskContainer.appendChild(deleteButton);
}

const taskStatus = document.querySelectorAll(".task-status");
const taskElements = document.querySelectorAll(".task");

//Click Listener
document.addEventListener("click", handleInput);

function handleInput(event) {
    const target = event.target;
    if (document.querySelector(".ctx-menu")) {
        closeCtxMenu();
    }
    if (
        document.querySelector(".list-edit-menu") &&
        !target.classList.contains("list-edit-menu") &&
        !target.classList.contains("ctx-menu-btn") &&
        (
            !parentClassContains(target, "list-edit-menu") &&
            !parentClassContains(target, "list-edit-container") &&
            !parentClassContains(target, "list-edit-head")
            )
    ) {
        closeListEditing();
    }
    
    if (target.id === "btn-new-list") {
        newList();
    }

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
        if (list.tasks[findTaskIndex(target.parentElement)].complete) {
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

    if (!target.classList.contains("input") && !target.classList.contains("submit-edit") && !target.classList.contains("task")) {
        closeEditing();
    }
    if (target.classList.contains("task")) {
        editTask(target);
    }

    if (target.classList.contains("list-link")) {
        const allListLinks = document.querySelectorAll(".list-link");
        let index = Array.from(allListLinks).indexOf(target);
        loadList(index);
    }


    updateLocalStorage();
}

function parentClassContains(element, selectedClass) {
    const parent = element.parentElement;
    if (parent && parent.classList) {
        if (parent.classList.contains(selectedClass)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

document.addEventListener('contextmenu', handleCtxMenu);
function handleCtxMenu(event) {
    const target = event.target;
    event.preventDefault();

    if (
        target.classList.contains("ctx-menu") ||
        target.classList.contains("ctx-menu-btn") ||
        target.classList.contains("list-edit-menu") ||
        (
            target.parentElement &&
            (
                parentClassContains(target, "list-edit-menu") ||
                parentClassContains(target, "list-edit-container") ||
                parentClassContains(target, "list-edit-head")
                ))
    ) {
        return;
    }
    if (document.querySelector(".ctx-menu") && !target.classList.contains("ctx-menu")) {
        closeCtxMenu();
    }
    if (
        document.querySelector(".list-edit-menu") &&
        !target.classList.contains("list-edit-menu") &&
        !target.classList.contains("ctx-menu-btn") ||
        (
            !parentClassContains(target, "list-edit-menu") &&
            !parentClassContains(target, "list-edit-container") &&
            !parentClassContains(target, "list-edit-head")
            )
    ) {
        closeListEditing();
    }

    if (target.classList.contains("list-link")) {
        openListCtxMenu(event.pageX, event.pageY, target);
    } else if (target.classList.contains("tbd")) {
    
    } else {
        openDefaultCtxMenu(event.pageX, event.pageY);
    }
}

function closeCtxMenu() {
    const openCtxMenu = document.querySelector(".ctx-menu");
    if (openCtxMenu) {
        openCtxMenu.remove();
    }
}

function closeListEditing() {
    const ListEditMenu = document.querySelector(".list-edit-menu");
    if (ListEditMenu) {
        ListEditMenu.remove();
    }
}

function returnCtxMenuPosition(og_x, og_y, width, height) {
    
    let newPos = {x: og_x, y: og_y};
    if (window.innerWidth <= og_x + width) {
        newPos.x -= width;
        console.log("x")
    }
    if (window.innerHeight <= og_y + height) {
        newPos.y -= height;
        console.log("y")
    }
    return newPos;
}

function openListCtxMenu(x, y, target) {

    const openListBtn = document.createElement("button");
    openListBtn.classList.add("btn", "ctx-menu-btn");
    openListBtn.id = "ctx-btn-open-list";
    openListBtn.innerText = "Open";

    const editListBtn = document.createElement("button");
    editListBtn.classList.add("btn", "ctx-menu-btn");
    editListBtn.id = "ctx-btn-edit-list";
    editListBtn.innerText = "Edit";

    const delListBtn = document.createElement("button");
    delListBtn.classList.add("btn", "ctx-menu-btn");
    delListBtn.id = "ctx-btn-del-list";
    delListBtn.innerText = "Delete";

    const menu = document.createElement("div");
    menu.classList.add("ctx-menu", "list_ctx-menu");

    menu.appendChild(openListBtn);
    menu.appendChild(editListBtn);
    menu.appendChild(delListBtn);

    const menuWidth = 100;
    const menuHeight = menu.childElementCount * 40;
    menu.style.width = `${menuWidth}px`;
    menu.style.height = `${menuHeight}px`
    
    menu.style.left = `${returnCtxMenuPosition(x, y, menuWidth, menuHeight).x}px`;
    menu.style.top = `${returnCtxMenuPosition(x, y, menuWidth, menuHeight).y}px`;

    document.querySelector(".container").appendChild(menu);

    const allListLinks = document.querySelectorAll(".list-link");
    let index = Array.from(allListLinks).indexOf(target);
    const html_listCtxMenu = document.querySelector(".list_ctx-menu");

    html_listCtxMenu.addEventListener("click", function(event) {
        const target = event.target;
        switch (target.id) {
            case "ctx-btn-open-list":
                loadList(index);
                break;
            case "ctx-btn-edit-list":
                openListEditMenu(index);
                break;
            case "ctx-btn-del-list":
                deleteList(index);
                break;
        }
    });
}

function openDefaultCtxMenu(x, y) {

    const reload = document.createElement("button");
    reload.classList.add("btn", "ctx-menu-btn");
    reload.id = "ctx-btn-reload";
    reload.innerText = "Reload";

    const hl_settings = document.createElement("button");
    hl_settings.classList.add("btn", "ctx-menu-btn");
    hl_settings.id = "btn-settings-hyperlink";
    hl_settings.innerText = "Settings";

    const hl_info = document.createElement("button");
    hl_info.classList.add("btn", "ctx-menu-btn");
    hl_info.id = "btn-info-hyperlink";
    hl_info.innerText = "Info";


    const menu = document.createElement("div");
    menu.classList.add("ctx-menu", "default_ctx-menu");

    menu.appendChild(reload);
    menu.appendChild(hl_settings);
    menu.appendChild(hl_info);

    const menuWidth = 100;
    const menuHeight = menu.childElementCount * 40;
    menu.style.width = `${menuWidth}px`;
    menu.style.height = `${menuHeight}px`
    
    menu.style.left = `${returnCtxMenuPosition(x, y, menuWidth, menuHeight).x}px`;
    menu.style.top = `${returnCtxMenuPosition(x, y, menuWidth, menuHeight).y}px`;

    document.querySelector(".container").appendChild(menu);

    const default_listCtxMenu = document.querySelector(".default_ctx-menu");
    default_listCtxMenu.addEventListener("click", function(event) {
        const target = event.target;
        switch (target.id) {
            case "ctx-btn-reload":
                location.reload();
                break;
            case "btn-settings-hyperlink":
            window.location.href = 'settings/settings.html'
            break;
            case "btn-info-hyperlink":
                window.location.href = 'info/info.html'
                break;
        }
    });
}

function openListEditMenu(index) {
    const menu = document.createElement("div");
    menu.classList.add("list-edit-menu");    

    //Head
    const listEditHeadText = document.createElement("div");
    listEditHeadText.id = "list-edit-head-text"
    listEditHeadText.innerText = "Edit List Name"

    const btn_CancleListEdit = document.createElement("button");
    btn_CancleListEdit.classList.add("btn")
    btn_CancleListEdit.id = "btn-cancel-list-edit"
    btn_CancleListEdit.innerText = "Cancel"

    const listEditHead = document.createElement("div");
    listEditHead.classList.add("list-edit-head");
    listEditHead.appendChild(listEditHeadText);
    listEditHead.appendChild(btn_CancleListEdit);

    //Input
    const listEditInput = document.createElement("input");
    listEditInput.classList.add("input");
    listEditInput.type = "text";
    listEditInput.name = "edit-list-name";
    listEditInput.id = "edit-list-input"

    listEditInput.autocomplete = "off";
    listEditInput.maxLength = "20";
    listEditInput.value = data[index].name;

    const listEditInputBtn = document.createElement("button");
    listEditInputBtn.classList.add("btn");
    listEditInputBtn.id = "btn-edit-list-name"
    listEditInputBtn.innerText = "Submit"

    const listEditContainer = document.createElement("div");
    listEditContainer.classList.add("list-edit-container");
    listEditContainer.appendChild(listEditInput);
    listEditContainer.appendChild(listEditInputBtn);

    //Append to menu
    menu.appendChild(listEditHead);
    menu.appendChild(listEditContainer);

    document.querySelector(".container").appendChild(menu);

    const allListLinks = document.querySelectorAll(".list-link");
    const listLink = allListLinks[index];

    btn_CancleListEdit.addEventListener("click", function() {
        closeListEditing();
    });

    const interval_checkEnter = setInterval(checkEnter, 10);

    listEditInputBtn.addEventListener("click", function() {
        submitListEdit(listLink, listEditInput, index, menu, interval_checkEnter);
    });
    function checkEnter() {
        if (txtCursorPos === "edit-list-input" && keysDown.enter) {
            submitListEdit(listLink, listEditInput, index, menu, interval_checkEnter);
        }
    }
}

function submitListEdit(listLink, inputEdit, index, editContainer, interval_checkEnter) {
    if (!inputEdit.value) {
        messageConsole("Please enter a valid string.")
        return;
    }
    
    listLink.innerText = inputEdit.value;
    data[index].name = listLink.innerText;

    editContainer.remove();
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
    if (list == null) {
        messageConsole("Please create a list to add tasks.")
        return;
    }
    let newTaskText = document.getElementById("new-task-text").value;
    if (checkTaskLimit()) {
        return;
    }
    list.tasks.push({complete: false, text: newTaskText});
    addTask(newTaskText);
    updateLocalStorage();

    //Clear Input
    document.getElementById("new-task-text").value = "";
}

function setTaskStatus(element, completion) {
    
    if (completion) {
        element.innerText = "✔";
        list.tasks[findTaskIndex(element.parentElement)].complete = true;
    } else {
        element.innerText = "";
        list.tasks[findTaskIndex(element.parentElement)].complete = false;
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

    list.tasks.splice(findTaskIndex(element), 1);
    taskList.removeChild(element);
    updateLocalStorage();
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
    inputEdit.classList.add("input");
    inputEdit.maxLength = 100;

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

        //updateLocalStorage();
    });
}

function submitTaskEdit(task, inputEdit, index, editContainer) {
    task.innerText = inputEdit.value;
    list.tasks[index].text = task.innerText;

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
    data[selectedListIndex] = list;
    let data_serialized = JSON.stringify(data);
    localStorage.setItem("data", data_serialized);
    let data_parsed = JSON.parse(localStorage.getItem("data"));
    list = data[selectedListIndex];
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
            if (txtCursorPos === "input-edit") {
                const task = editing;
                const inputEdit = document.querySelector(".input-edit");
                const index = findTaskIndex(task.parentElement);
                const editContainer = document.querySelector(".edit-container");
                submitTaskEdit(task, inputEdit, index, editContainer);
            }
            if (txtCursorPos === "new-list-name") {
                newList();
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
    if (target.id === "new-list-name") {
        txtCursorPos = "new-list-name";
    }
    if (target.id === "edit-list-input") {
        txtCursorPos = "edit-list-input";
    }
    if (target.classList.contains("input-edit")) {
        txtCursorPos = "input-edit";
    }
});

function messageConsole(message) {
    const console = document.getElementById("console");
    console.style.transition = "none";
    console.style.opacity = "1";
    console.innerText = message;

    setTimeout(() => {
        console.style.transition = "opacity 2s";
        console.style.opacity = "0";
    }, 1000);
}