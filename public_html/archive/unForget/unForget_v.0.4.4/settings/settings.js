
let settings = JSON.parse(localStorage.getItem("settings"));

if (!settings) {
    resetSettings();
}

function resetSettings() {
    settings = {
        "gen": {
            "menu_bar": false
        },
        "conf": {
            "menu_btns": true,
            "task_del": false,
            "list_del": true
        }
    }
    updateLocalStorage();
    location.reload();
}

function updateLocalStorage() {
    const settings_serialized = JSON.stringify(settings);
    localStorage.setItem("settings", settings_serialized);
}


const all_toggle_elements = document.querySelectorAll('.toggle');

all_toggle_elements.forEach((toggle) => {
    //load settings
    switch (toggle.id) {
        // General
        case "tog-gen-menuBar":
            toggle.checked = settings.gen.menu_bar;
            break;
    
        // Confirmation
        case "tog-conf-menuBtns":
            toggle.checked = settings.conf.menu_btns;
            break;
        case "tog-conf-taskDel":
            toggle.checked = settings.conf.task_del;
            break;
        case "tog-conf-listDel":
            toggle.checked = settings.conf.list_del;
            break;
    }
    
    
    //Create toggle click listener
    toggle.addEventListener("click", (event) => {
        editSettings(event.target.id);
    });
});

function editSettings(id) {
    console.log(id);
    switch (id) {
        // General
        case "tog-gen-menuBar":
            settings.gen.menu_bar = !settings.gen.menu_bar;
            break;
    
        // Confirmation
        case "tog-conf-menuBtns":
            settings.conf.menu_btns = !settings.conf.menu_btns;
            break;
        case "tog-conf-taskDel":
            settings.conf.task_del = !settings.conf.task_del;
            break;
        case "tog-conf-listDel":
            console.log(settings.conf.list_del)
            settings.conf.list_del = !settings.conf.list_del;
            break;
    }
    
    updateLocalStorage();
    console.log(settings);

}


//Reset functions

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-reset')) {
        switch (event.target.id) {
            case "reset-data":
                if (confirm("Are you sure? This will delete all lists and their data!")) {
                    localStorage.setItem("data", null);
                }
                break;
            case "reset-settings":
                if (confirm("Are you sure? This will revert all settings to their default values!")) {
                    resetSettings();
                }
                break;
        }
    }
});

export {settings};