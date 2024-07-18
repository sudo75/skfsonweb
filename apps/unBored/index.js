const checkbox = {
    education: document.getElementById('checkbox_education'),
    recreational: document.getElementById('checkbox_recreational'),
    social: document.getElementById('checkbox_social'),
    diy: document.getElementById('checkbox_diy'),
    charity: document.getElementById('checkbox_charity'),
    cooking: document.getElementById('checkbox_cooking'),
    relaxation: document.getElementById('checkbox_relaxation'),
    music: document.getElementById('checkbox_music'),
    busywork: document.getElementById('checkbox_busywork')
}

function fetchActivity() {
    activityTypeOptions = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"];
    const activityTypesChecked = Object.keys(checkbox).filter(key => checkbox[key].checked);
    
    if (activityTypesChecked.length === 0) {
        alert('Please select at least one activity type.');
        return;
    }
    
    function randActivityType() {
        const rand_raw = Math.random();
        return rand_new = Math.floor(rand_raw * activityTypesChecked.length);
    }

    const activityTypeParam = activityTypesChecked[randActivityType()];

    fetch(`https://www.boredapi.com/api/activity?type=${activityTypeParam}`)
    .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('API request failed');
            }
        })
    .then(data => {
        console.log(data)
        output_Element.innerText = data.activity;
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

const button_generate_Element = document.getElementById('button_generate');
button_generate_Element.addEventListener('click', generateActivity);

const output_Element = document.getElementById('output');

function generateActivity() {
    fetchActivity();
}