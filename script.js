// ==========================================
// DOM-ELEMENTE ABGREIFEN
// ==========================================

// Armee-Modal Elemente
const armyModal = document.getElementById('armyModal');
const openArmyBtn = document.getElementById('openModalBtn');
const closeArmyBtn = document.getElementById('closeModalBtn');
const armyForm = document.getElementById('createArmyForm');

// Fraktions-Modal Elemente
const factionModal = document.getElementById('factionModal');
const openFactionBtn = document.getElementById('openFactionModalBtn');
const closeFactionBtn = document.getElementById('closeFactionModalBtn');
const factionForm = document.getElementById('factionForm');
const submitFactionBtn = document.getElementById('submitFactionFormBtn');

// Einheiten-Katalog Container
const unitsContainer = document.getElementById('units-container');
const btnMainAddUnit = document.getElementById('btnMainAddUnit');

// Einheiten-Katalog Datenblatt Modal Elemente
const unitDatasheetModal = document.getElementById('unitDatasheetModal');
const closeDsModalBtn = document.getElementById('closeDsModalBtn');
const dsUnitNameInput = document.getElementById('dsUnitName');

// Lösch-Bestätigungs-Modal Elemente
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const btnConfirmDeleteCoice = document.getElementById('btnConfirmDeleteCoice');
const btnCancelDeleteCoice = document.getElementById('btnCancelDeleteCoice');
const deleteModalTitle = document.getElementById('deleteModalTitle');
const deleteModalText = document.getElementById('deleteModalText');

// Hilfsvariable, um sich zu merken, welche Zeile gerade gelöscht werden soll
let rowToDeleteCurrently = null;

// Da der Button außerhalb des Form-Scrollbereichs liegt, triggern wir den Submit manuell
if (submitFactionBtn && factionForm) {
    submitFactionBtn.addEventListener('click', () => {
        factionForm.requestSubmit(); 
    });
}

// ==========================================
// HTML TEMPLATES (Vereinheitlicht!)
// ==========================================

// Fraktionsverwaltung: Template für neue Einheit
const unitTemplate = `
    <div class="unit-catalog-row animate-spawn">
        <span class="unit-name">Einheiten-Name</span>
        
        <div class="unit-actions">
            <button type="button" class="btn btn-secondary btn-configure btn-edit-unit">
                ⚙️ Bearbeiten
            </button>
            
            <button type="button" class="btn-trash btn-remove-unit">
                🗑️
            </button>
        </div>
    </div>
`;

// Fraktionsverwaltung: Template für neue gestaffelte Boni innerhalb der Fähigkeits-Karten
const newRowHTML = `
    <div class="nested-effect-row">
        <div class="form-group flex-grow-input">
            <label class="form-label label-muted">Bedingung / Situation:</label>
            <input type="text" placeholder="z.B. Standard / Wenn Ziel am Missionsziel steht" class="form-input">
        </div>
        <div class="form-group flex-grow-input">
            <label class="form-label label-success">Modifikator / Bonus:</label>
            <input type="text" placeholder="z.B. Re-roll 1s to hit / Re-roll full hit roll" class="form-input">
        </div>
        <button type="button" class="btn-trash btn-delete-nested" title="Effekt löschen">🗑️</button>
    </div>
`;

// Fraktionsverwaltung: Template für neue Detachments
const detachmentTemplate = `
    <div class="detachment-row animate-spawn">
        <span class="detachment-name">Detachment-Name</span>
        
        <div class="detachment-actions">
            <button type="button" class="btn btn-secondary btn-configure btn-edit-detachment">
                ⚙️ Bearbeiten
            </button>
            
            <button type="button" class="btn-trash btn-remove-detachment">
                🗑️
            </button>
        </div>
    </div>
`;

// Fraktionsverwaltung: Template für neue zusätzliche Modell-Profile im Einheiten-Datenblatt
const modelProfileTemplate = `
    <div class="model-profile-card animate-spawn">
        
        <div class="model-profile-top-row">
            <div class="form-group model-name-group">
                <label class="form-label model-name-label">Modell-Typ:</label>
                <input type="text" placeholder="z.B. Standard-Modell / Sergeant" class="form-input" value="Zusätzliches Modell">
            </div>
            <button type="button" class="btn-trash btn-remove-model-profile" title="Profil löschen">🗑️</button>
        </div>

        <div class="model-profile-stats-row">
            <div class="form-group model-stat-group"><label>M</label><input type="text" placeholder="6&quot;" class="form-input"></div>
            <div class="form-group model-stat-group"><label>WS</label><input type="text" placeholder="4+" class="form-input"></div>
            <div class="form-group model-stat-group"><label>BS</label><input type="text" placeholder="4+" class="form-input"></div>
            <div class="form-group model-stat-group"><label>S</label><input type="number" placeholder="3" class="form-input"></div>
            <div class="form-group model-stat-group"><label>T</label><input type="number" placeholder="3" class="form-input"></div>
            <div class="form-group model-stat-group"><label>W</label><input type="number" placeholder="1" class="form-input"></div>
            <div class="form-group model-stat-group"><label>A</label><input type="number" placeholder="1" class="form-input"></div>
            <div class="form-group model-stat-group"><label>Ld</label><input type="text" placeholder="7+" class="form-input"></div>
            <div class="form-group model-stat-group"><label>Sv</label><input type="text" placeholder="5+" class="form-input"></div>
        </div>

    </div>
`;

// ==========================================
// MODAL 1: ARMEE ERSTELLEN
// ==========================================
if (openArmyBtn && armyModal) {
    openArmyBtn.addEventListener('click', () => {
        armyModal.classList.add('show');
    });
}

if (closeArmyBtn && armyModal) {
    closeArmyBtn.addEventListener('click', () => {
        armyModal.classList.remove('show');
    });
}

if (armyForm && armyModal) {
    armyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        armyModal.classList.remove('show');
    });
}

// ==========================================
// MODAL 2: FRAKTIONS-VERWALTUNG
// ==========================================
if (openFactionBtn && factionModal) {
    openFactionBtn.addEventListener('click', () => {
        factionModal.classList.add('show');
    });
}

if (closeFactionBtn && factionModal) {
    closeFactionBtn.addEventListener('click', () => {
        factionModal.classList.remove('show');
    });
}

if (factionForm && factionModal) {
    factionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        factionModal.classList.remove('show');
    });
}

// ==========================================
// TABS UMSCHALT-LOGIK
// ==========================================
const tabButtons = document.querySelectorAll('.tab-item');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        tabPanes.forEach(pane => pane.classList.remove('active'));
        if (tabPanes[index]) {
            tabPanes[index].classList.add('active');
        }
    });
});

// ==========================================
// DYNAMISCHE FRAKTIONSFÄHIGKEITEN HINZUFÜGEN
// ==========================================
const btnMainAddAbility = document.getElementById('btnMainAddAbility');
const abilitiesContainer = document.getElementById('abilities-container');

let abilityCounter = 2; 

if (btnMainAddAbility && abilitiesContainer) {
    
    btnMainAddAbility.addEventListener('click', () => {
        const nestedBoxId = `nested-box-${abilityCounter}`;
        const nestedBtnId = `nested-btn-${abilityCounter}`;

        const abilityTemplate = `
            <div class="ability-card animate-spawn" data-ability-index="${abilityCounter}">
                <div class="ability-card-header">
                    <span class="ability-title">✨ Fähigkeit #${abilityCounter} (Neu)</span>
                    <button type="button" class="btn-trash btn-remove-entire-ability">
                        🗑️ Fähigkeit löschen
                    </button>
                </div>

                <div class="form-row-2col">
                    <div class="form-group">
                        <label class="form-label">Name der Fähigkeit:</label>
                        <input type="text" placeholder="z.B. Synapse / Hyper-Adaptations" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Wann? (Trigger):</label>
                        <select class="form-input select-input">
                            <option>Passiv / Immer active</option>
                            <option>In der Schussphase</option>
                            <option>In der Nahkampfphase</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Beschreibung / Regeltext (Flavor):</label>
                    <textarea placeholder="Beschreibe die Funktionsweise der Regel..." class="form-input form-textarea" rows="3"></textarea>
                </div>

                <div class="form-row-special">
                    <div class="inline-form-group">
                        <label class="form-label-inline">Limit:</label>
                        <input type="number" value="1" class="form-input input-small">
                    </div>
                    <div class="inline-form-group flex-grow-input">
                        <label class="form-label-inline">Anwendung(en) pro</label>
                        <select class="form-input select-input">
                            <option>unbegrenzt</option>
                            <option>Runde</option>
                            <option>Spiel</option>
                        </select>
                    </div>
                    <div class="inline-form-group">
                        <label class="form-label-inline">Dauer des Effekts:</label>
                        <select class="form-input select-input">
                            <option>Sofort (Instant)</option>
                            <option>Bis zum Ende der Phase</option>
                            <option>Bis zum Ende des Zuges</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Globaler Effekt (Mechanik für Automatisierung):</label>
                    <input type="text" placeholder="z.B. Einheiten in Synapsenreichweite bestehen Moraltests automatisch" class="form-input">
                </div>

                <div class="nested-effects-box" id="${nestedBoxId}">
                    <div class="nested-title">📊 SPEZIFISCHE EFFEKTE & GESTAFFELTE BONI (KONDITIONEN):</div>
                    <button type="button" id="${nestedBtnId}" class="btn btn-secondary btn-add-nested-dynamic">+ Spezifischen/Gestaffelten Effekt hinzufügen</button>
                </div>
            </div>
        `;

        abilitiesContainer.insertAdjacentHTML('beforeend', abilityTemplate);
        abilityCounter++;

        const newlyAddedCards = abilitiesContainer.querySelectorAll('.ability-card.animate-spawn');
        const lastAddedCard = newlyAddedCards[newlyAddedCards.length - 1];
        if (lastAddedCard) {
            setTimeout(() => {
                lastAddedCard.classList.remove('animate-spawn');
            }, 200);
        }
    });

    abilitiesContainer.addEventListener('click', (e) => {
        
        if (e.target.classList.contains('btn-add-nested-dynamic')) {
            const card = e.target.closest('.ability-card');

            const nestedHtml = `
                <div class="nested-effect-row animate-spawn">
                    <input type="text" placeholder="Bedingung (z.B. Ab 3 verlorenen Modellen)" class="form-input" style="width: 40%;">
                    <input type="text" placeholder="Effekt (z.B. +1 auf Trefferwürfe)" class="form-input" style="width: 50%;">
                    <button type="button" class="btn-trash btn-delete-nested">🗑️</button>
                </div>
            `;
            
            e.target.insertAdjacentHTML('beforebegin', nestedHtml);

            const newlyAddedNested = card.querySelectorAll('.nested-effect-row.animate-spawn');
            const lastAddedNested = newlyAddedNested[newlyAddedNested.length - 1];
            if (lastAddedNested) {
                setTimeout(() => {
                    lastAddedNested.classList.remove('animate-spawn');
                }, 200);
            }
        }

        if (e.target.classList.contains('btn-delete-nested')) {
            e.target.closest('.nested-effect-row').remove();
        }

        if (e.target.closest('.btn-remove-entire-ability')) {
            const card = e.target.closest('.ability-card');
            if (card) {
                rowToDeleteCurrently = card;
                deleteModalTitle.textContent = "Fähigkeit löschen?";
                deleteModalText.textContent = "Möchtest du diese gesamte Fähigkeit inklusive aller eingetragenen Texte und spezifischen Effekte wirklich löschen?";
                deleteConfirmModal.classList.add('show');
            }
        }  
    });

}


// ==========================================
// DYNAMISCHE DETACHMENTS HINZUFÜGEN & LÖSCHEN
// ==========================================
const btnMainAddDetachment = document.getElementById('btnMainAddDetachment');
const detachmentsContainer = document.getElementById('detachments-container');

if (btnMainAddDetachment && detachmentsContainer) {
    btnMainAddDetachment.addEventListener('click', () => {
        detachmentsContainer.insertAdjacentHTML('beforeend', detachmentTemplate);
        
        const newlyAddedRows = detachmentsContainer.querySelectorAll('.detachment-row.animate-spawn');
        const lastAddedRow = newlyAddedRows[newlyAddedRows.length - 1];
        
        if (lastAddedRow) {
            setTimeout(() => {
                lastAddedRow.classList.remove('animate-spawn');
            }, 200);
        }
    });
}

if (detachmentsContainer) {
    detachmentsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-detachment')) {
            const row = e.target.closest('.detachment-row');
            if (row) {
                rowToDeleteCurrently = row;
                deleteModalTitle.textContent = "Detachment löschen?";
                deleteModalText.textContent = "Möchtest du dieses Detachment wirklich löschen? Alle zugewiesenen Daten gehen verloren.";
                deleteConfirmModal.classList.add('show');
            }
        }
    });
}

// ==========================================
// EINHEITEN-KATALOG: BEARBEITEN & LÖSCHEN
// ==========================================
if (unitsContainer) {
    unitsContainer.addEventListener('click', (e) => {
        
        if (e.target.closest('.btn-remove-unit')) {
            const row = e.target.closest('.unit-catalog-row');
            if (row) {
                rowToDeleteCurrently = row;
                deleteModalTitle.textContent = "Einheit löschen?";
                deleteModalText.textContent = "Möchtest du diese Einheit wirklich aus dem Katalog löschen?";
                deleteConfirmModal.classList.add('show');
            }
            return;
        }

        const editBtn = e.target.closest('.btn-edit-unit');
        if (editBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const row = editBtn.closest('.unit-catalog-row');
            if (row) {
                const nameSpan = row.querySelector('.unit-name');
                if (nameSpan) {
                    dsUnitNameInput.value = nameSpan.textContent.trim();
                    unitDatasheetModal.classList.add('show');
                }
            }
        }
    });
}

if (closeDsModalBtn) {
    closeDsModalBtn.addEventListener('click', () => {
        unitDatasheetModal.classList.remove('show');
    });
}

// ==========================================
// EINHEITEN-KATALOG: NEUE ZEILE ANLEGEN
// ==========================================
if (btnMainAddUnit && unitsContainer) {
    btnMainAddUnit.addEventListener('click', () => {
        unitsContainer.insertAdjacentHTML('beforeend', unitTemplate);
        
        const newlyAddedRows = unitsContainer.querySelectorAll('.unit-catalog-row.animate-spawn');
        const lastAddedRow = newlyAddedRows[newlyAddedRows.length - 1];
        
        if (lastAddedRow) {
            setTimeout(() => {
                lastAddedRow.classList.remove('animate-spawn');
            }, 200);
        }
    });
}

// ==========================================
// LOGIK FÜR DAS LÖSCH-BESTÄTIGUNGS-MODAL
// ==========================================
if (btnConfirmDeleteCoice) {
    btnConfirmDeleteCoice.addEventListener('click', () => {
        if (rowToDeleteCurrently) {
            rowToDeleteCurrently.remove();
            rowToDeleteCurrently = null;
        }
        if (deleteConfirmModal) {
            deleteConfirmModal.classList.remove('show');
        }
    });
}

if (btnCancelDeleteCoice) {
    btnCancelDeleteCoice.addEventListener('click', () => {
        rowToDeleteCurrently = null;
        if (deleteConfirmModal) {
            deleteConfirmModal.classList.remove('show');
        }
    });
}

// ==========================================
// PROFILWERTE-INTERFACE LOGIK
// ==========================================
const modelsProfileContainer = document.getElementById('models-profile-container');
const btnAddModelProfile = document.getElementById('btnAddModelProfile');

if (btnAddModelProfile && modelsProfileContainer) {
    btnAddModelProfile.addEventListener('click', () => {
        modelsProfileContainer.insertAdjacentHTML('beforeend', modelProfileTemplate);
        
        const newlyAddedCards = modelsProfileContainer.querySelectorAll('.model-profile-card.animate-spawn');
        const lastAddedCard = newlyAddedCards[newlyAddedCards.length - 1];
        if (lastAddedCard) {
            setTimeout(() => {
                lastAddedCard.classList.remove('animate-spawn');
            }, 200);
        }
    });
}

if (modelsProfileContainer) {
    modelsProfileContainer.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-model-profile')) {
            if (modelsProfileContainer.querySelectorAll('.model-profile-card').length > 1) {
                e.target.closest('.model-profile-card').remove();
            } else {
                alert("Eine Einheit muss mindestens aus einem Modell-Profil bestehen!");
            }
        }
    });
}