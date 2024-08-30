const button =document.querySelector('.button-note');
const buttonDelete =document.querySelector('.button-delete');
const button_preset=document.getElementById('preset');
const button_recupero=document.getElementById('s-preset');
const button_delete_preset=document.getElementById('d-preset');
const inputField = document.getElementById('input-ese');
const todolist = document.querySelector('.todo-list');
const emptyListMessage = document.querySelector('.empty-list-message');

const peso=document.getElementById('peso-drop');
const serie=document.getElementById('serie-drop');
const ripetizioni=document.getElementById('rep-drop');


let dropdown_peso=document.getElementById("myDropdown");
let dropdown_serie=document.getElementById("dropdown-s");
let dropdown_ripetizioni=document.getElementById("dropdown-r");
let dropdown_preset=document.getElementById('dropdown-pre');

const STORAGE_KEY= '__bool__to__do';
const STORAGE_KEY_PRESET='__preset__';

// preparo lista attività
let activities = [];

const storageActivities =localStorage.getItem(STORAGE_KEY)
if(storageActivities){
    activities=JSON.parse(storageActivities);

}else{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(["Serie(4)-Rep(15)-Peso(50)-Lat machine","Serie(3)-Rep(12)-Peso(50)-Squat","Serie(3)-Rep(12)-Flessioni"]));
    activities=["Serie(4)-Rep(15)-Peso(50)-Lat machine","Serie(3)-Rep(12)-Peso(50)-Squat","Serie(3)-Rep(12)-Flessioni"];
};

// range pesi
let p=[5,10,15,20,25,30,35,40,45,50];


// serie più comuni
let s=[1,2,3,4];
// range ripetizioni più comuni
let r=[6,8,12,15];

// preset esercizi struct --> {id:asd,esercizi:["1","2","3"]}
let preset=[];

// Verifico se ci sono preset in locale
const storagePreset =localStorage.getItem(STORAGE_KEY_PRESET)
if(storagePreset){
    preset=JSON.parse(storagePreset);

}else{
    localStorage.setItem(STORAGE_KEY_PRESET,JSON.stringify([{"id":"Allenamento Dorso","esercizi":["Serie(4)-Rep(15)-Peso(50)-Lat machine","Serie(3)-Rep(12)-Peso(40)-Rematore(Bilanciere)","Serie(3)-Rep(8)-Trazioni alla sbarra"]},{"id":"Allenamento Gambe","esercizi":["Serie(3)-Rep(12)-Peso(50)-Squat","Serie(4)-Rep(12)-Peso(50)-Leg Press","Serie(4)-Rep(15)-Peso(25)-Leg Extension"]},{"id":"Allenamento Petto","esercizi":["Serie(3)-Rep(12)-Peso(40)-Panca Piana","Serie(3)-Rep(12)-Peso(20)-Spinte Manubri","Serie(3)-Rep(12)-Flessioni"]}]));
    preset=[{"id":"Allenamento Dorso","esercizi":["Serie(4)-Rep(15)-Peso(50)-Lat machine","Serie(3)-Rep(12)-Peso(40)-Rematore(Bilanciere)","Serie(3)-Rep(8)-Trazioni alla sbarra"]},{"id":"Allenamento Gambe","esercizi":["Serie(3)-Rep(12)-Peso(50)-Squat","Serie(4)-Rep(12)-Peso(50)-Leg Press","Serie(4)-Rep(15)-Peso(25)-Leg Extension"]},{"id":"Allenamento Petto","esercizi":["Serie(3)-Rep(12)-Peso(40)-Panca Piana","Serie(3)-Rep(12)-Peso(20)-Spinte Manubri","Serie(3)-Rep(12)-Flessioni"]}];
};

//attività presenti nel local storage
const storage = localStorage.getItem(STORAGE_KEY)
if(storage){
    activities=JSON.parse(storage);
};


// Chiedi a JS di decidere cosa mostrare
showContent();


// OPERAZIONI DINAMICHE
button.addEventListener('click',function(){
   addActivity();
});

buttonDelete.addEventListener('click',function(){
    deleteExercise();
});


//  Funzione che decide cosa mostrare in pagina
function showContent(){
    todolist.innerText = '';
    emptyListMessage.innerText='Esercizi Rimanenti '+ activities.length ;

    if(activities.length>0){
        // inserisco in pagina un blocco HTML che dico io:
        
        activities.forEach(function(activity,index){
            template=createActivityTemplate(activity,index)
            todolist.innerHTML += template;
        
        });
        makeCheckCliccable();
        makeModifyCliccable();
        makeSaveCliccable();
        
        

    }else{
        emptyListMessage.innerText = 'Non ci sono esercizi da fare';
    }
}


function makeCheckCliccable(){
    //cerca tutti i check e renderli cliccabili
    const checks = document.querySelectorAll('.todo-check');
        checks.forEach(function(check,index){
            //verifica se viene cliccato
            check.addEventListener('click',function(){
                //rimuovi l'elemento dalle attività
                activities.splice(index,1);
                //aggiorna local storage
                localStorage.setItem(STORAGE_KEY,JSON.stringify(activities));
                showContent();

            })

        });
};

function makeModifyCliccable(){
    //cerca tutti i check e renderli cliccabili
    const checks = document.querySelectorAll('.todo-modify');
        checks.forEach(function(check,index){
            //verifica se viene cliccato
            check.addEventListener('click',function(){
                const box_edit=document.getElementById('box-'+index);
                box_edit.removeAttribute('readonly');
            })

        });
};

function makeSaveCliccable(){
    //cerca tutti i check e renderli cliccabili
    const checks = document.querySelectorAll('.todo-save');
        checks.forEach(function(check,index){
            //verifica se viene cliccato
            
            check.addEventListener('click',function(){
                const box_edit=document.getElementById('box-'+index);
                activities[index]=box_edit.value;
                //aggiorna local storage
                localStorage.setItem(STORAGE_KEY,JSON.stringify(activities));
                box_edit.setAttribute('readonly',true);

            })

        });
};

//aggiungere i dati 
function addPreset(id){
    preset.forEach(function(data){
        if(data.id==id){
            let raw_exercise=data.esercizi;
            raw_exercise.forEach(function(raw){
                activities.push(raw);
            })
        }
    })
    
}

function addActivity(){
    
    //prendo i valori dalle input box
    const serInput =  serie.value;
    const repInput = ripetizioni.value;
    const pesoInput = peso.value;
    const newValue = inputField.value.trim();
    
    
    let toCheck = [serInput,repInput,pesoInput];
    let typeCheck =["Serie","Rep","Peso"]
    let value=''
    // faccio dei controlli per creare il formato di inserimento
    toCheck.forEach(function(check,index){
        let temp=ifNotEmpty(check,typeCheck[index]);
        value+=temp;
    })

    
    
    // inserisco il nuvo elemento 
    if(newValue.length>0){
        value+=newValue;
        // aggiungi nello storage
        activities.push(value);
        localStorage.setItem(STORAGE_KEY,JSON.stringify(activities))
        showContent();

        //resetto la UI
        resetInputBox();
    }
};

//Template attività
function createActivityTemplate(activity,index)
{
    return `<li class="todo-item">
    <div class="todo-check">
      <img src="images/check.svg" alt="Check Icon">
    </div>
    <input type="text" class="todo-text" value="${activity}" id="box-${index}" readonly="true">
    <div class="todo-modify" id=mod-${index}>
      <img src="images/modify.svg" alt="modify Icon">
    </div>
    <div class="todo-save" id=save-${index}>
      <img src="images/save.svg" alt="save Icon">
    </div>
  </li>`;
};

// funzione per verificare se i dati in input non sono vuoti
function ifNotEmpty(value,type){
    if(value==''){
        return value;
    }
    return type + "(" + value + ")-";
};

// template per le voci del dropdownmenu
function createMenuTemplate(value)
{
    return `<a >${value}</a>`;
};


/* Quando l'utente fa clic sul pulsante, alterna tra nascondere e mostrare il contenuto del menu a discesa delle ripetizioni */
function dropdown_show_p(){
    let preset_id=loadPreset();
    if(preset_id.length>0){
        createDropMenu(preset_id,dropdown_preset);
        dropdown_preset.classList.toggle("show");
        selectItemButton(button_preset,dropdown_preset);
    }else{window.alert("Non ci sono preset!")}
}

//funzione per resettare la UI
function resetInputBox(){
    peso.value='';
    serie.value='';
    ripetizioni.value='';
    inputField.value='';
};

//funzione per eliminare tutti gli esercizi si da localstorage che dalla UI
function deleteExercise(){

    if(window.confirm("Vuoi davvero procedere con l'eliminazione degli esercizi?'")){
            localStorage.removeItem(STORAGE_KEY);
            activities=[];
            showContent();
    }

};

//funzione per elimiare i preset
function deletePreset(){
        var message="Quale Preset vuoi cancellare (Inserisci il nome)?\n"
        var totPreset=preset.length;
        if(preset.length>0){
            preset.forEach(function(esecizio){message+=esecizio.id + "\n";})
            let anw=window.prompt(message);
            if( anw ){
                if(anw!=' '){
                        preset.forEach(function(data,index){
                            if(data.id==anw){
                                //rimuovi l'elemento se lo trovo
                                preset.splice(index,1);
                                //aggiorna local storage
                                localStorage.setItem(STORAGE_KEY_PRESET,JSON.stringify(preset));
                                showContent();
                            }
                        })
                        if(preset.length==totPreset){window.alert("Qualcosa è andato storto durante l'eliminazione")}
                };
           };       

}else{
    window.alert('Non ci sono preset!');
}

};
//funzione per aggiungere gli esercizi di preset
function setPreset(){
    var message="Quale Preset vuoi inserire (Inserisci il nome)?\n"
    var totActivities=activities.length;
    if(preset.length>0){
        preset.forEach(function(esecizio){message+=esecizio.id + "\n";})
        let anw=window.prompt(message);
        if( anw ){
            if(anw!=' '){
                    preset.forEach(function(data,index){
                        if(data.id==anw){
                            //aggiungo gli esercizi
                            addPreset(anw)
                            //aggiorna local storage
                            localStorage.setItem(STORAGE_KEY_PRESET,JSON.stringify(preset));
                            showContent();
                        }
                    })
                    if(activities.length==totActivities){window.alert("Qualcosa è andato storto durante l'inserimento")}
            };
       };       

}else{
window.alert('Non ci sono preset!');
}
};


// funzione per caricare gli id dei preset per il dropmenu button
function loadPreset(){
    let preset_raw=[];
    if(preset){preset.forEach(function(data){preset_raw.push(data.id);})};
    return preset_raw;
};

// funzione per salvare il preset da un nome da input
function savePreset(){
    nameP=window.prompt("come vuoi chiamare il preset?");
    if(activities.length>0 && nameP ){
        // inserisco in pagina un blocco HTML che dico io:
        if(nameP!=' '){
            let raw_preset = {id:nameP,esercizi:[]};
            activities.forEach(function(activity){
                raw_preset.esercizi.push(activity);
            });
            preset.push(raw_preset);
            localStorage.setItem(STORAGE_KEY_PRESET,JSON.stringify(preset));
        }       
    };
};



