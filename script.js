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

//


// Hilfsvariable, um sich zu merken, welche Zeile gerade gelöscht werden soll
let rowToDeleteCurrently = null;

// Da der Button außerhalb des Form-Scrollbereichs liegt, triggern wir den Submit manuell
if (submitFactionBtn && factionForm) {
    submitFactionBtn.addEventListener('click', () => {
        factionForm.requestSubmit(); 
    });
}

// ==========================================
// HTML TEMPLATES (Ohne Inline-Styles!)
// ==========================================

// Fraktionsverwaltung: Template für neue Einheit (Statisch als Text)
const unitTemplate = `
    <div class="unit-catalog-row animate-spawn">
        <span class="unit-name">Einheiten-Name</span>
        
        <div class="unit-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-configure btn-edit-unit">
                ⚙️ Bearbeiten
            </button>
            
            <button type="button" class="delete-btn table-delete-style btn-remove-unit">
                🗑️
            </button>
        </div>
    </div>
`;

// Fraktionsverwaltung: Template für neue gestaffelte Boni innerhalb der Fähigkeits-Karten
// Hier wurden die Style-Attribute durch Klassen ersetzt (.label-muted und .label-success)
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
        <button type="button" class="btn-delete-nested" title="Effekt löschen">🗑️</button>
    </div>
`;

// Fraktionsverwaltung: Template für neue Detachments
const detachmentTemplate = `
    <div class="detachment-row animate-spawn">
        <span class="detachment-name">Detachment-Name</span>
        
        <div class="detachment-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-configure btn-edit-detachment">
                ⚙️ Bearbeiten
            </button>
            
            <button type="button" class="delete-btn table-delete-style btn-remove-detachment">
                🗑️
            </button>
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
    
    // 1. NEUE FÄHIGKEIT HINZUFÜGEN
    btnMainAddAbility.addEventListener('click', () => {
        const nestedBoxId = `nested-box-${abilityCounter}`;
        const nestedBtnId = `nested-btn-${abilityCounter}`;

        const abilityTemplate = `
            <div class="ability-card animate-spawn" data-ability-index="${abilityCounter}">
                <div class="ability-card-header">
                    <span class="ability-title">✨ Fähigkeit #${abilityCounter} (Neu)</span>
                    <button type="button" class="btn-delete-link btn-remove-entire-ability">
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
                            <option>Passiv / Immer aktiv</option>
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

        // Animations-Klasse nach 200ms wieder entfernen
        const newlyAddedCards = abilitiesContainer.querySelectorAll('.ability-card.animate-spawn');
        const lastAddedCard = newlyAddedCards[newlyAddedCards.length - 1];
        if (lastAddedCard) {
            setTimeout(() => {
                lastAddedCard.classList.remove('animate-spawn');
            }, 200);
        }
    }); // <-- Schließt das addEventListener für den Button sauber

    // 2. KLICKS INNERHALB DES CONTAINERS VERWALTEN
    abilitiesContainer.addEventListener('click', (e) => {
        
        // REPARIERT: Spezifischen/Gestaffelten Effekt hinzufügen (Original-Design)
        if (e.target.classList.contains('btn-add-nested-dynamic')) {
            const card = e.target.closest('.ability-card');
            const container = card.querySelector('.nested-effects-box');

            const nestedHtml = `
                <div class="nested-effect-row animate-spawn">
                    <input type="text" placeholder="Bedingung (z.B. Ab 3 verlorenen Modellen)" class="form-input" style="width: 40%;">
                    <input type="text" placeholder="Effekt (z.B. +1 auf Trefferwürfe)" class="form-input" style="width: 50%;">
                    <button type="button" class="delete-btn btn-delete-nested">🗑️</button>
                </div>
            `;
            
            // Fügt das Element sauber direkt vor dem Button ein
            e.target.insertAdjacentHTML('beforebegin', nestedHtml);

            // Die Spawn-Animation für den neuen Effekt nach 200ms entfernen
            const newlyAddedNested = card.querySelectorAll('.nested-effect-row.animate-spawn');
            const lastAddedNested = newlyAddedNested[newlyAddedNested.length - 1];
            if (lastAddedNested) {
                setTimeout(() => {
                    lastAddedNested.classList.remove('animate-spawn');
                }, 200);
            }
        }

        // Spezifischen/Gestaffelten Effekt löschen
        if (e.target.classList.contains('btn-delete-nested')) {
            e.target.closest('.nested-effect-row').remove();
        }

        // Ganze Fähigkeits-Karte löschen mit dem neuen Modal
        if (e.target.closest('.btn-remove-entire-ability')) {
            const card = e.target.closest('.ability-card');
            if (card) {
                rowToDeleteCurrently = card; // Karte im Speicher merken
                
                // Text im Modal dynamisch ändern
                deleteModalTitle.textContent = "Fähigkeit löschen?";
                deleteModalText.textContent = "Möchtest du diese gesamte Fähigkeit inklusive aller eingetragenen Texte und spezifischen Effekte wirklich löschen?";
                
                // Modal anzeigen
                deleteConfirmModal.classList.add('show');
            }
        }  
    }); // <-- Schließt das addEventListener für den Container sauber

} // <-- Schließt das if (btnMainAddAbility && abilitiesContainer) sauber


// ==========================================
// DYNAMISCHE DETACHMENTS HINZUFÜGEN & LÖSCHEN
// ==========================================
const btnMainAddDetachment = document.getElementById('btnMainAddDetachment');
const detachmentsContainer = document.getElementById('detachments-container');

// NEU: Separater Klick zum Hinzufügen
if (btnMainAddDetachment && detachmentsContainer) {
    btnMainAddDetachment.addEventListener('click', () => {
        // 1. Neues Detachment hinzufügen
        detachmentsContainer.insertAdjacentHTML('beforeend', detachmentTemplate);
        
        // 2. Die gerade eben hinzugefügte Reihe finden
        const newlyAddedRows = detachmentsContainer.querySelectorAll('.detachment-row.animate-spawn');
        const lastAddedRow = newlyAddedRows[newlyAddedRows.length - 1];
        
        // 3. Nach 200 Millisekunden (Dauer der Animation) die Animations-Klasse entfernen
        if (lastAddedRow) {
            setTimeout(() => {
                lastAddedRow.classList.remove('animate-spawn');
            }, 200);
        }
    });
}

// NEU: Das Detachment-Löschen öffnet jetzt das Modal (Hierhin kommt der erste Teil!)
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
// EINHEITEN-KATALOG: BEARBEITEN & LÖSCHEN (KORRIGIERT)
// ==========================================
if (unitsContainer) {
    unitsContainer.addEventListener('click', (e) => {
        
        // 1. LOGIK: Einheit löschen (Öffnet das Bestätigungs-Modal)
        if (e.target.closest('.btn-remove-unit')) {
            const row = e.target.closest('.unit-catalog-row');
            if (row) {
                rowToDeleteCurrently = row;
                deleteModalTitle.textContent = "Einheit löschen?";
                deleteModalText.textContent = "Möchtest du diese Einheit wirklich aus dem Katalog löschen?";
                deleteConfirmModal.classList.add('show');
            }
            return; // Beendet die Funktion für diesen Klick frühzeitig
        }

        // 2. LOGIK: Einheit bearbeiten (Öffnet das NEUE Datenblatt-Modal SOFORT)
        const editBtn = e.target.closest('.btn-edit-unit');
        if (editBtn) {
            e.preventDefault();
            e.stopPropagation(); // Stoppt jegliche andere Event-Verarbeitung im Browser
            
            const row = editBtn.closest('.unit-catalog-row');
            if (row) {
                const nameSpan = row.querySelector('.unit-name');
                if (nameSpan) {
                    // Setze den Text aus dem SPAN direkt in das Input-Feld des Modals
                    dsUnitNameInput.value = nameSpan.textContent.trim();
                    
                    // Zeige das Modal sofort an
                    unitDatasheetModal.classList.add('show');
                }
            }
        }
    });
}

// ==========================================================
// Einheiten Katalog MODAL SCHLIEẞEN (Datenblätter)
// ==========================================================
if (closeDsModalBtn) {
    closeDsModalBtn.addEventListener('click', () => {
        unitDatasheetModal.classList.remove('show');
    });
}

// ==========================================
// EINHEITEN-KATALOG: NEUE ZEILE STATISCH ANLEGEN
// ==========================================
if (btnMainAddUnit && unitsContainer) {
    btnMainAddUnit.addEventListener('click', () => {
        // 1. Neue Einheit hinzufügen
        const htmlString = unitTemplate;
        unitsContainer.insertAdjacentHTML('beforeend', htmlString);
        
        // 2. Die gerade eben hinzugefügte Reihe finden
        const newlyAddedRows = unitsContainer.querySelectorAll('.unit-catalog-row.animate-spawn');
        const lastAddedRow = newlyAddedRows[newlyAddedRows.length - 1];
        
        // 3. Nach 200 Millisekunden die Animations-Klasse entfernen
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