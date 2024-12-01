async function fetchData() {
    const response = await fetch('/get_records');
    const data = await response.json();
    populateTable(data);
}

async function createRecordFromForm() {
    const formData = new FormData(document.getElementById('create-form'));
    const nev = formData.get('nev');  // Település neve
    const npid = formData.get('npid');  // Nemzeti park ID

    const response = await fetch('/create_record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nev, npid })  // Küldjük a település nevét és a nemzeti park ID-t
    });

    if (response.ok) {
        fetchData();
        document.getElementById('create-dialog').close();  // Ablak bezárása sikeres létrehozás után
    }
}

async function updateRecordFromForm() {
    const formData = new FormData(document.getElementById('edit-form'));
    const id = formData.get('id');
    const nev = formData.get('nev').trim();  // Település neve
    const npid = formData.get('npid').trim();  // Nemzeti park ID

    // Lekérdezzük az aktuális rekordot
    const currentRecord = await fetch(`/get_record/${id}`).then(res => res.json());

    // Ha a mezők üresek, használjuk az eredeti értékeket
    const updatedNev = nev || currentRecord.nev;
    const updatedNpid = npid || currentRecord.npid;

    const response = await fetch('/update_record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, nev: updatedNev, npid: updatedNpid })  // Küldjük az ID-t, az új vagy eredeti értékeket
    });

    if (response.ok) {
        fetchData();
        document.getElementById('edit-dialog').close();  // Ablak bezárása sikeres frissítés után
    }
}

function createRecord() {
    document.getElementById('create-dialog').showModal();  // Megnyitjuk a létrehozási ablakot
}

async function editRecord(id) {
    const response = await fetch(`/get_record/${id}`);  // Kérünk egy rekordot az id alapján
    const data = await response.json();

    document.getElementById('nev').value = data.nev;  // Beállítjuk a település nevét
    document.getElementById('npid').value = data.npid;    // Beállítjuk a nemzeti park ID-t
    document.getElementById('id').value = id;  // Beállítjuk az id mezőt

    document.getElementById('edit-dialog').showModal();  // Megnyitjuk a szerkesztési ablakot
}

async function deleteRecord(id) {
    const response = await fetch(`/delete_record/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchData();  // Újratöltjük az adatokat törlés után
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('crud-table-body');
    tableBody.innerHTML = '';  // Kiürítjük a táblázatot

    data.forEach(record => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = record.id;
        row.appendChild(idCell);

        const nevCell = document.createElement('td');  // Település neve megjelenítése
        nevCell.textContent = record.nev;
        row.appendChild(nevCell);

        const npidCell = document.createElement('td');  // Nemzeti park ID megjelenítése
        npidCell.textContent = record.npid;
        row.appendChild(npidCell);

        const actionsCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Szerkesztés';
        editButton.onclick = () => editRecord(record.id);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Törlés';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteRecord(record.id);
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });
}

fetchData();  // Kezdetben lekérdezzük az adatokat és megjelenítjük a táblázatban
