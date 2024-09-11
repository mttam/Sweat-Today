const button = document.querySelector('.button-note');
const buttonDelete = document.querySelector('.button-delete');
const button_preset = document.getElementById('preset');
const button_recupero = document.getElementById('s-preset');
const button_delete_preset = document.getElementById('d-preset');
const inputField = document.getElementById('input-ese');
const todolist = document.querySelector('.todo-list');
const emptyListMessage = document.querySelector('.empty-list-message');

const peso = document.getElementById('peso-drop');
const serie = document.getElementById('serie-drop');
const ripetizioni = document.getElementById('rep-drop');


let dropdown_peso = document.getElementById("myDropdown");
let dropdown_serie = document.getElementById("dropdown-s");
let dropdown_ripetizioni = document.getElementById("dropdown-r");
let dropdown_preset = document.getElementById('dropdown-pre');

const STORAGE_KEY = '__bool__to__do';
const STORAGE_KEY_PRESET = '__preset__';
const NAME_APP = 'Sweat-Today';


// preparo lista attività
let activities = [];

const storageActivities = localStorage.getItem(STORAGE_KEY)
if (storageActivities) {
  activities = JSON.parse(storageActivities);

} else {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(["Serie(4)-Rep(15)-Peso(50)-Lat machine", "Serie(3)-Rep(12)-Peso(50)-Squat", "Serie(3)-Rep(12)-Flessioni"]));
  activities = ["Serie(4)-Rep(15)-Peso(50)-Lat machine", "Serie(3)-Rep(12)-Peso(50)-Squat", "Serie(3)-Rep(12)-Flessioni"];
};


// preset esercizi struct --> {id:asd,esercizi:["1","2","3"]}
let preset = [];

// Verifico se ci sono preset in locale
const storagePreset = localStorage.getItem(STORAGE_KEY_PRESET)
if (storagePreset) {
  preset = JSON.parse(storagePreset);

} else {
  localStorage.setItem(STORAGE_KEY_PRESET, JSON.stringify([{ "id": "Allenamento Dorso", "esercizi": ["Serie(4)-Rep(15)-Peso(50)-Lat machine", "Serie(3)-Rep(12)-Peso(40)-Rematore(Bilanciere)", "Serie(3)-Rep(8)-Trazioni alla sbarra"] }, { "id": "Allenamento Gambe", "esercizi": ["Serie(3)-Rep(12)-Peso(50)-Squat", "Serie(4)-Rep(12)-Peso(50)-Leg Press", "Serie(4)-Rep(15)-Peso(25)-Leg Extension"] }, { "id": "Allenamento Petto", "esercizi": ["Serie(3)-Rep(12)-Peso(40)-Panca Piana", "Serie(3)-Rep(12)-Peso(20)-Spinte Manubri", "Serie(3)-Rep(12)-Flessioni"] }]));
  preset = [{ "id": "Allenamento Dorso", "esercizi": ["Serie(4)-Rep(15)-Peso(50)-Lat machine", "Serie(3)-Rep(12)-Peso(40)-Rematore(Bilanciere)", "Serie(3)-Rep(8)-Trazioni alla sbarra"] }, { "id": "Allenamento Gambe", "esercizi": ["Serie(3)-Rep(12)-Peso(50)-Squat", "Serie(4)-Rep(12)-Peso(50)-Leg Press", "Serie(4)-Rep(15)-Peso(25)-Leg Extension"] }, { "id": "Allenamento Petto", "esercizi": ["Serie(3)-Rep(12)-Peso(40)-Panca Piana", "Serie(3)-Rep(12)-Peso(20)-Spinte Manubri", "Serie(3)-Rep(12)-Flessioni"] }];
};

//attività presenti nel local storage
const storage = localStorage.getItem(STORAGE_KEY)
if (storage) {
  activities = JSON.parse(storage);
};

//Visualizzare i dati
showContent()

// OPERAZIONI DINAMICHE
button.addEventListener('click', function () {
  addActivity();
});

function showSuccessMessage() {
  const successMessage = document.getElementById('success-message');
  successMessage.classList.add('show');
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 1500);
}


//  Funzione che decide cosa mostrare in pagina
function showContent() {
  todolist.innerText = '';
  emptyListMessage.innerText = 'Esercizi Rimanenti ' + activities.length;

  if (activities.length > 0) {
    // inserisco in pagina un blocco HTML che dico io:

    activities.forEach(function (activity, index) {
      template = createActivityTemplate(activity, index)
      todolist.innerHTML += template;

    });
    makeCheckCliccable();
    makeModifyCliccable();
    makeSaveCliccable();



  } else {
    emptyListMessage.innerText = 'Non ci sono esercizi da fare';
  }
}

// Funzione che serve a verificare che tutti todo-check siano cliccabili
function makeCheckCliccable() {
  //cerca tutti i check e renderli cliccabili
  const checks = document.querySelectorAll('.todo-check');
  checks.forEach(function (check, index) {
    //verifica se viene cliccato
    check.addEventListener('click', function () {
      //rimuovi l'elemento dalle attività
      activities.splice(index, 1);
      //aggiorna local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
      showContent();

    })

  });
};

// Funzione che serve a verificare che tutti todo-modify siano cliccabili
function makeModifyCliccable() {
  //cerca tutti i check e renderli cliccabili
  const checks = document.querySelectorAll('.todo-modify');
  checks.forEach(function (check, index) {
    //verifica se viene cliccato
    check.addEventListener('click', function () {
      const box_edit = document.getElementById('box-' + index);
      box_edit.removeAttribute('readonly');
    })

  });
};

// Funzione che serve a verificare che tutti todo-save siano cliccabili
function makeSaveCliccable() {
  //cerca tutti i check e renderli cliccabili
  const checks = document.querySelectorAll('.todo-save');
  checks.forEach(function (check, index) {
    //verifica se viene cliccato

    check.addEventListener('click', function () {
      const box_edit = document.getElementById('box-' + index);
      activities[index] = box_edit.value;
      //aggiorna local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
      box_edit.setAttribute('readonly', true);

    })

  });
};

// Funzione per aggiunger gli esercizi da un preset specifico all'elenco principale di attività
// Parametro: id - identificatore del preset da cui aggiungere gli esercizi
function addPreset(id) {
  preset.forEach(function (data) {
    if (data.id == id) {
      let raw_exercise = data.esercizi;
      raw_exercise.forEach(function (raw) {
        activities.push(raw);
      })
    }
  })

}

// Funzione per aggiungere una nuova attività alla lista
function addActivity() {

  //prendo i valori dalle input box
  const serInput = serie.value;
  const repInput = ripetizioni.value;
  const pesoInput = peso.value;
  const newValue = inputField.value.trim();


  let toCheck = [serInput, repInput, pesoInput];
  let typeCheck = ["Serie", "Rep", "Peso"]
  let value = ''
  // faccio dei controlli per creare il formato di inserimento
  toCheck.forEach(function (check, index) {
    let temp = ifNotEmpty(check, typeCheck[index]);
    value += temp;
  })



  // inserisco il nuvo elemento 
  if (newValue.length > 0) {
    value += newValue;
    // aggiungi nello storage
    activities.push(value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    showContent();

    //resetto la UI
    resetInputBox();
  }
};

//Template attività
function createActivityTemplate(activity, index) {
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
function ifNotEmpty(value, type) {
  if (value == '') {
    return value;
  }
  return type + "(" + value + ")-";
};

//funzione per resettare la UI
function resetInputBox() {
  peso.value = '';
  serie.value = '';
  ripetizioni.value = '';
  inputField.value = '';
};

//funzione per eliminare tutti gli esercizi si da localstorage che dalla UI
function deleteExercise() {
  localStorage.removeItem(STORAGE_KEY);
  activities = [];
  showContent();

};



// funzione per caricare gli id dei preset per il dropmenu button
function loadPreset() {
  let preset_raw = [];
  if (preset) { preset.forEach(function (data) { preset_raw.push(data.id); }) };
  return preset_raw;
};

// funzione per salvare il preset da un nome da input
async function savePreset() {
  let message = "come vuoi chiamare il preset?";
  if (activities.length > 0) {
    // inserisco in pagina un blocco HTML che dico io:
    nameP = await showSavePresetDialog(message)
    if (nameP) {
      let raw_preset = { id: nameP, esercizi: [] };
      activities.forEach(function (activity) {
        raw_preset.esercizi.push(activity);
      });
      preset.push(raw_preset);
      localStorage.setItem(STORAGE_KEY_PRESET, JSON.stringify(preset));
      showSuccessMessage();
    }
  };
};

// Funzione per eliminare i preset
async function deletePreset() {
  let message = "Quale Preset vuoi cancellare?";
  if (preset.length > 0) {
    let presetNames = preset.map((data) => data.id);
    let selectedPreset = await showPresetDialog(message, presetNames);
    if (selectedPreset) {
      let index = preset.findIndex((data) => data.id === selectedPreset);
      if (index !== -1) {
        preset.splice(index, 1);
        localStorage.setItem(STORAGE_KEY_PRESET, JSON.stringify(preset));
        showSuccessMessage();
        showContent();
      } else {
        alert("Qualcosa è andato storto durante l'eliminazione");
      }
    }
  } else {
    alert('Non ci sono preset!');
  }
}

// Funzione per aggiungere gli esercizi di un preset
async function setPreset() {
  let message = "Quale Preset vuoi inserire?";
  if (preset.length > 0) {
    let presetNames = preset.map((data) => data.id);
    let selectedPreset = await showPresetDialog(message, presetNames);
    if (selectedPreset) {
      addPreset(selectedPreset);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
      showSuccessMessage();
      showContent();
    }
  } else {
    alert('Non ci sono preset!');
  }
}

//funzione per eliminare tutti gli esercizi
async function deleteAllExrcise() {
  let message = "Vuoi eliminare tutti gli esercizi?";
  if (activities.length > 0) {
    let decision = await showDeleteExDialog(message);
    if (decision) {
      deleteExercise();
      showSuccessMessage();
    }

  }

}
// Funzione per esportare o importare esercizi/preset
async function exportImport() {
  let message = "Sezione Import/Export"

  let exportImportDecision = await showDialogImpExp(message);
  if (exportImportDecision.op == "exEs") {
      exportDataOut(STORAGE_KEY,exportImportDecision.fileName);
  }
  else if (exportImportDecision.op == "exPr") {
    exportDataOut(STORAGE_KEY_PRESET,exportImportDecision.fileName);
  }
  else if (exportImportDecision.op == "imEs") {
    importDataToLocal(STORAGE_KEY, exportImportDecision)
  }
  else if (exportImportDecision.op == "imPr") {
    importDataToLocal(STORAGE_KEY_PRESET, exportImportDecision)
  }

}

// Funzione per mostrare un dialog di selezione del preset
async function showPresetDialog(message, options) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.classList.add('preset-dialog');
    dialog.innerHTML = `
            
            <div class="dialog-content">
            <h2>${message}</h2>
            <ul class="preset-list"></ul>
            <div class="dialog-actions">
                <button class="cancel-btn">Annulla</button>
                <button class="select-btn">Seleziona</button>
            </div>
            </div>
        `;

    const presetList = dialog.querySelector('.preset-list');
    options.forEach((option) => {
      const li = document.createElement('li');
      li.textContent = option;
      li.addEventListener('click', () => {
        selectedOption = option;
        presetList.querySelectorAll('li').forEach((li) => li.classList.remove('selected'));
        li.classList.add('selected');
      });
      presetList.appendChild(li);
    });

    const cancelBtn = dialog.querySelector('.cancel-btn');
    const selectBtn = dialog.querySelector('.select-btn');

    cancelBtn.addEventListener('click', () => {
      dialog.close();
      resolve(null);
    });

    selectBtn.addEventListener('click', () => {
      if (selectedOption) {
        dialog.close();
        resolve(selectedOption);
      }
    });

    document.body.appendChild(dialog);

    // Centro il dialog
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';

    dialog.showModal();
  });
}



// Funzione che mostra un dialog per scegliere l'eliminazione di tutti gli esercizi
async function showDeleteExDialog(message) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.classList.add('preset-dialog');
    dialog.innerHTML = `
            
            <div class="dialog-content">
            <h2>${message}</h2>
            <div class="dialog-actions">
                <button class="cancel-btn">Annulla</button>
                <button class="ok-btn">OK</button>
            </div>
            </div>
        `;

    const cancelBtn = dialog.querySelector('.cancel-btn');
    const okBtn = dialog.querySelector('.ok-btn');

    cancelBtn.addEventListener('click', () => {
      dialog.close();
      resolve(null);
    });

    okBtn.addEventListener('click', () => {
      dialog.close();
      resolve(true);

    });

    document.body.appendChild(dialog);

    // Centro il dialog
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';

    dialog.showModal();
  });
}

// funzione che mostra un dialog per dare un nome hai nuovi preset 
async function showSavePresetDialog(message) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.classList.add('preset-dialog');

    dialog.innerHTML = `
            <div class="dialog-content">
              <h2>${message}</h2>
              <input type="text" id="preset-name-input" placeholder="Nome preset">
              <div class="dialog-actions">
                <button class="cancel-btn" id="cancel-btn">Annulla</button>
                <button class="save-btn" id="save-btn">Salva</button>
              </div>
            </div>
          `;

    document.body.appendChild(dialog);

    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';

    dialog.showModal();

    const cancelBtn = dialog.querySelector('#cancel-btn');
    const saveBtn = dialog.querySelector('#save-btn');
    const inputField = dialog.querySelector('#preset-name-input');

    cancelBtn.addEventListener('click', () => {
      dialog.close();
      resolve(null);
    });

    saveBtn.addEventListener('click', () => {
      const inputValue = inputField.value;
      const trimmedValue = inputValue.trim();

      if (trimmedValue !== '') {
        dialog.close();
        resolve(trimmedValue);
      }
    });
  });
};


//funzione che serve ad salavare i dati importati in localr
function importDataToLocal(key, data) {
  // importo esercizi per le attività
  if (key == STORAGE_KEY) {
    data.raw_data.preset.forEach(item => {
      if (item.id == "N") {
        item.esercizi.forEach(ese => {
          activities.push(ese);
        })
      }
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))

  } else {
    // importo per i preset
    data.raw_data.preset.forEach(item => {
      if (item.id != "N") {
        let raw_preset = { id: item.id, esercizi: item.esercizi };
        preset.push(raw_preset);

      }
    })
    localStorage.setItem(STORAGE_KEY_PRESET, JSON.stringify(preset))
  }
  showSuccessMessage()
  showContent()

};

//Funzione che serve a generare la data odierna
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hour = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');
  return `${hour}${minutes}${seconds}${day}${month}${year}`;
};

//Funzione che serve ad esportare i dati locali in formato json
function exportDataOut(key, fileName) {
  try {
    let data = exportDataBase(key);
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json;charset=utf-8"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob)
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessMessage();

  } catch (error) {
    throw new Error('Failed!');
  }
};

//Funzione per leggere il file in input
function readFile(inputFile) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    fileReader.readAsText(inputFile);
  });
}

// Funzione per parsare il contenuto JSON
function parseJsonContent(fileContent) {
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error('Failed to parse JSON file');
  }
}

// Funzione asincrona che serve  ad importare i dati in formato json
async function importDataBase(operation, inputFile) {
  const file = inputFile;
  const fileName = file.name;

  try {
    const fileContent = await readFile(file);
    const fileContent_2 = parseJsonContent(fileContent);
    const data = { ...fileContent_2 };
    return {
      op: operation,
      id: fileName,
      raw_data: data
    };
  } catch (error) {
    return ({ error: error.message });
  }
}
// funzione che serve a creare il formato  di importazione
function exportDataBase(key) {
  // formato esercizi
  if (key == STORAGE_KEY) {
    let data_export =
    {
      preset: [{ id: "N", esercizi: activities }]
    }
    return data_export

  } 
  // formato preset
  else {
    let data_export = preset
    return data_export
  }
}


// Funzione asincrona che gestisce il dialogo per l'import/export
async function showDialogImpExp(message) {

  return new Promise((resolve) => {
    // crea l'oggetto dialog
    const dialog = document.createElement('dialog');
    dialog.classList.add('preset-dialog');

    dialog.innerHTML = `
            <div class="dialog-content">
              <h2>${message}</h2>
              <input type="file" id="fileInput" style="display: none;">
              <div class="dialog-actions-exip">
                <button class="select-btn" id="exEs-btn">Esporta Esercizi</button>
                <button class="select-btn" id="exPr-btn">Esporta Preset</button>
                <button class="select-btn" id="imEs-btn">Importa Esercizi</button>
                <button class="select-btn" id="imPr-btn">Importa Preset</button>
              </div>
              <div class="dialog-actions">
                <button class="cancel-btn" id="cancel-btn">Chiudi</button>
              </div>
            </div>
          `;
    document.body.appendChild(dialog);

    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';

    const cancelBtn = dialog.querySelector('#cancel-btn');
    const exEsBtn = dialog.querySelector('#exEs-btn');
    const exPrBtn = dialog.querySelector('#exPr-btn');
    const imEsBtn = dialog.querySelector('#imEs-btn');
    const imPrBtn = dialog.querySelector('#imPr-btn');

    let operation = '';
    dialog.showModal();

    cancelBtn.addEventListener('click', (e) => {
      dialog.close();
      resolve({ op: null, fileName: null, esercizi: null });
    });


    [imEsBtn, imPrBtn].forEach((btn) => {
      btn.addEventListener('click', (e) => {
        operation = btn.id.replace('-btn', '');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.click();

        fileInput.addEventListener('change', async (e) => {
          const Data = await importDataBase(operation, fileInput.files[0]);
          resolve(Data);
        });
      });
    });

    [exEsBtn, exPrBtn].forEach((btn) => {
      btn.addEventListener('click', (e) => {
        operation = btn.id.replace('-btn', '');
        let fileName = `${NAME_APP}_${getTodayDate()}.json`
        resolve({ op: operation, fileName: fileName })
        dialog.close();
      });
    });
  });
};

