let settings = JSON.parse(localStorage.getItem("settings"));

if (!settings) {
    resetSettings();
}

function resetSettings() {
    settings = {
        "gen": {
            "menu_bar": false,
            "hyperlinks": true,
            "dark": false
        },
        "conf": {
            "menu_btns": true,
            "task_del": false,
            "list_del": true
        },
        "notif": {
            "daily": true,
            "daily_time": "08:00",
            "due_date": true
        }
    }
    updateLocalStorage();
    location.reload();
}

function updateLocalStorage() {
    const settings_serialized = JSON.stringify(settings);
    localStorage.setItem("settings", settings_serialized);
}


//Toggles

const all_toggle_elements = document.querySelectorAll('.toggle');
all_toggle_elements.forEach((toggle) => {
    //load settings
    switch (toggle.id) {
        // General
        case "tog-gen-menuBar":
            toggle.checked = settings.gen.menu_bar;
            break;
        case "tog-gen-hyperlinks":
            toggle.checked = settings.gen.hyperlinks;
            break;
        case "tog-gen-dark":
            toggle.checked = settings.gen.dark;
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

        //Notifications
        case "tog-notif-daily":
            toggle.checked = settings.notif.daily;
            break;
        case "tog-notif-due":
            toggle.checked = settings.notif.due_date;
            break;
    }
    
    
    //Create toggle click listener
    toggle.addEventListener("click", (event) => {
        editSettings(event.target.id);
    });
});

function editSettings(id) {
    switch (id) {
        // General
        case "tog-gen-menuBar":
            settings.gen.menu_bar = !settings.gen.menu_bar;
            break;
        case "tog-gen-hyperlinks":
            settings.gen.hyperlinks = !settings.gen.hyperlinks;
            break;

        case "tog-gen-dark":
            settings.gen.dark = !settings.gen.dark;
            break;
    
        // Confirmation
        case "tog-conf-menuBtns":
            settings.conf.menu_btns = !settings.conf.menu_btns;
            break;
        case "tog-conf-taskDel":
            settings.conf.task_del = !settings.conf.task_del;
            break;
        case "tog-conf-listDel":
            settings.conf.list_del = !settings.conf.list_del;
            break;

        //Notifications
        case "tog-notif-daily":
            settings.notif.daily = !settings.notif.daily;
            break;
        case "tog-notif-due":
            settings.notif.due_date = !settings.notif.due_date;
            break;
    }
    updateLocalStorage();
}


//Time

const all_time_elements = document.querySelectorAll('.time');
all_time_elements.forEach((element) => {
    //Load HTML
    if (element.id = "time-notif-daily") {
        element.value = settings.notif.daily_time;
    }

    element.addEventListener("input", (event) => {
        const selectedTime = event.target.value;
        settings.notif.daily_time = selectedTime;
        updateLocalStorage();
    })
});


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


dailyNotifSender();
function dailyNotifSender() {
    if (settings.notif.daily) {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        const [notifHour, notifMin] = settings.notif.daily_time.split(":").map(Number);

        if (currentHour === notifHour && currentMinute === notifMin) {
            
            if (Notification.permission !== "granted") {
                console.warn("Notifications not enabled");
            }

            //Message data
            let due = {
                total: 0,
                today: 0, 
                tomorrow: 0,
                thisWeek: 0
            }

            //Calculate message data
            const data = JSON.parse(localStorage.getItem("data"));
            data.forEach((list) => {
                list.tasks.forEach((task) => {
                    if (!task.complete) {
                        if (task.due_date) {
                            const [dueYear, dueMonth, dueDay] = task.due_date.split('-').map(Number);
                            const dueDate = new Date(dueYear, dueMonth - 1, dueDay);
                            const currentDate = new Date();
                            const MsToDue = dueDate - currentDate;
                        
                            const daysToDue = Math.ceil(MsToDue / 1000 / 60 / 60 / 24);
    
                            if (daysToDue === 0) {
                                due.today++;
                            } else if (daysToDue === 1) {
                                due.tomorrow++;
                            } else if (daysToDue > 1 && daysToDue <= 7) {
                                due.thisWeek++;
                            }
                        }
                        due.total++;
                    }
                });
            });
            
            new Notification(`You have: ${due.total} task(s) in total - ${due.today} due today, ${due.tomorrow} due tomorrow, and ${due.thisWeek} due this week`)
        }
    }
    setTimeout(() => {
        dailyNotifSender();
    }, calcTimeout(60));
}

function getCurrentDate() { // depreciated
    const currentDate = new Date();
    const current = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
        hour: currentDate.getHours(),
        min: currentDate.getMinutes(),
        sec: currentDate.getSeconds(),
        mil: currentDate.getMilliseconds(),
    }
    return current;
}

dueNotifSender();
function dueNotifSender() {
    if (settings.notif.due_date) {
        const data = JSON.parse(localStorage.getItem("data"));
        if (!data) {
            //console.warn("no readable data");
            setTimeout(() => {
                dueNotifSender();
            }, 3000);
            return;
        }
        data.forEach((list) => {
            list.tasks.forEach((task) => {
                if (!task.complete && task.dueNotifs) {
                    const current = Math.floor(new Date().getTime() / 1000 / 60); //convert to min

                    //current = Math.floor(Date.parse('2024-03-29' + ' ' + '00:00') / 1000 / 60) //Debug
    
                    const due = Math.floor(Date.parse(task.due_date + ' ' + task.due_time) / 1000 / 60); //convert to min
    
                    let text = null;
                    switch (due) {
                        case current:
                            text = `Due Now: ${task.text}`;
                            break;
                        case current + 3 * 60:
                            text = `Due in 3h: ${task.text}`;
                            break;
                        case current + 24 * 60:
                            text = `Due in 24h: ${task.text}`;
                            break;
                        case current + 3 * 24 * 60:
                            text = `Due in 3d: ${task.text}`;
                            break;
                        case current + 7 * 24 * 60:
                            text = `Due in 1w: ${task.text}`;
                            break;
                    }
    
                    if (text) {
                        new Notification(text);
                    }
                }
            });
        });
    }

    setTimeout(() => {
        dueNotifSender();
    }, calcTimeout(60));
}

//Calculate timeout
function calcTimeout(interval) {
    const current_sec = Math.floor(new Date().getTime() / 1000);

    const targetTime = current_sec - (current_sec % interval) + interval; //
    const timeout = targetTime - current_sec; 
    
    return timeout * 1000; //convert to miliseconds
}


export {settings};