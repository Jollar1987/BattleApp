// ==========================================
// 1. GLOBALE VARIABLEN & DOM-ABGRIFFE
// ==========================================
const armyModal = document.getElementById('armyModal');
const openArmyBtn = document.getElementById('openModalBtn');
const closeArmyBtn = document.getElementById('closeModalBtn');
const armyForm = document.getElementById('createArmyForm');

const factionModal = document.getElementById('factionModal');
const openFactionBtn = document.getElementById('openFactionModalBtn');
const closeFactionBtn = document.getElementById('closeFactionModalBtn');
const factionForm = document.getElementById('factionForm');
const submitFactionBtn = document.getElementById('submitFactionFormBtn');

const unitsContainer = document.getElementById('units-container');
const btnMainAddUnit = document.getElementById('btnMainAddUnit');
const unitDatasheetModal = document.getElementById('unitDatasheetModal');
const closeDsModalBtn = document.getElementById('closeDsModalBtn'); // Korrigiert!
const dsUnitNameInput = document.getElementById('dsUnitName');

const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteModalTitle = document.getElementById('deleteModalTitle');
const deleteModalText = document.getElementById('deleteModalText');
const btnConfirmDeleteCoice = document.getElementById('btnConfirmDeleteCoice');
const btnCancelDeleteCoice = document.getElementById('btnCancelDeleteCoice');

// Detachments (Aus deinem Originalcode)
const detachmentsContainer = document.getElementById('detachments-container');

// Container im Datasheet
const rangedWeaponsContainer = document.getElementById('ranged-weapons-container');
const meleeWeaponsContainer = document.getElementById('melee-weapons-container');
const modelsProfileContainer = document.getElementById('models-profile-container');
const abilitiesContainer = document.getElementById('abilities-container');

// Status-Variablen
let rowToDeleteCurrently = null;
let abilityCounter = 2; 

// ==========================================
// 2. REIN STATISCHE HTML TEMPLATES (1:1 aus deinem Original)
// ==========================================
const unitTemplate = `
    <div class="unit-catalog-row animate-spawn">
        <span class="unit-name">Einheiten-Name</span>
        <div class="unit-actions">
            <button type="button" class="btn btn-secondary btn-configure btn-edit-unit">⚙️ Bearbeiten</button>
            <button type="button" class="btn-trash btn-remove-unit">🗑️</button>
        </div>
    </div>
`;

const detachmentTemplate = `
    <div class="detachment-row animate-spawn">
        <span class="detachment-name">Detachment-Name</span>
        <div class="detachment-actions">
            <button type="button" class="btn btn-secondary btn-configure btn-edit-detachment">⚙️ Bearbeiten</button>
            <button type="button" class="btn-trash btn-remove-detachment">🗑️</button>
        </div>
    </div>
`;

// Fraktionsverwaltung: Template für neue zusätzliche Modell-Profile im Einheiten-Datenblatt
const modelProfileTemplate = `
    <div class="model-profile-card animate-spawn">
        <div class="model-profile-top-row">
            <div class="form-group model-name-group">
                <label class="form-label model-name-label">Modell-Typ:</label>
                
                <div class="model-input-row">
                    <input type="text" placeholder="z.B. Standard-Modell / Sergeant" class="form-input" value="Standard-Modell">
                    <button type="button" class="btn-trash btn-remove-model-profile" title="Profil löschen">🗑️</button>
                </div>
                
            </div>
        </div>
        <div class="model-profile-stats-row">
            <div class="form-group model-stat-group"><label>M</label><div class="stat-input-wrapper"><input type="text" list="movement-suggestions" placeholder="6" class="form-input"><span class="stat-suffix">"</span></div></div>
            <div class="form-group model-stat-group"><label>T</label><div class="stat-input-wrapper"><input type="text" list="general-stats-suggestions" placeholder="3" class="form-input"></div></div>
            <div class="form-group model-stat-group"><label>Sv</label><div class="stat-input-wrapper"><input type="text" list="dice-suggestions" placeholder="5" class="form-input"><span class="stat-suffix">+</span></div></div>
            <div class="form-group model-stat-group"><label>InSv</label><div class="stat-input-wrapper"><input type="text" list="dice-suggestions" placeholder="5" class="form-input"><span class="stat-suffix">+</span></div></div>
            <div class="form-group model-stat-group"><label>W</label><div class="stat-input-wrapper"><input type="text" list="general-stats-suggestions" placeholder="1" class="form-input"></div></div>
            <div class="form-group model-stat-group"><label>Ld</label><div class="stat-input-wrapper"><input type="text" list="dice-suggestions" placeholder="7" class="form-input"><span class="stat-suffix">+</span></div></div>
            <div class="form-group model-stat-group"><label>OC</label><div class="stat-input-wrapper"><input type="text" list="general-stats-suggestions" placeholder="2" class="form-input"></div></div>
        </div>
    </div>
`;

// ==========================================
// 3. GENERELLE EVENT-STEUERUNG (Nach Ladevorgang)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- FORM SUBMITS & SPEZIAL-TRIGGERS ---
    if (submitFactionBtn && factionForm) {
        submitFactionBtn.addEventListener('click', () => factionForm.requestSubmit());
    }
    if (armyForm) {
        armyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (armyModal) armyModal.classList.remove('show');
        });
    }
    if (factionForm) {
        factionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (factionModal) factionModal.classList.remove('show');
        });
    }

    // ==========================================
    // 4. DER GLOBALE KLICK-ABFÄNGER (Zentraler Listener)
    // ==========================================
    document.addEventListener('click', (e) => {
        const target = e.target;

        // --- TAB-UMSCHALTUNG (1:1 deine original Logik gegen "Hintergrund-Leersaugen") ---
        if (target.classList.contains('tab-item')) {
            const targetPaneId = target.getAttribute('data-target');
            const currentModal = target.closest('.modal-content');
            if (targetPaneId && currentModal) {
                const navTabsContainer = target.closest('.modal-tabs');
                if (navTabsContainer) {
                    navTabsContainer.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
                }
                currentModal.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                target.classList.add('active');
                const targetPane = currentModal.querySelector(`#${targetPaneId}`);
                if (targetPane) targetPane.classList.add('active');
            }
            return;
        }

        // --- MODAL ÖFFNEN / SCHLIESSEN ---
        if (target === openArmyBtn) return armyModal?.classList.add('show');
        if (target === closeArmyBtn) return armyModal?.classList.remove('show');
        if (target === openFactionBtn) return factionModal?.classList.add('show');
        if (target === closeFactionBtn) return factionModal?.classList.remove('show');
        if (target === closeDsModalBtn) return unitDatasheetModal?.classList.remove('show');

        // --- HINZUFÜGEN-BUTTONS ---
        if (target === btnMainAddUnit) {
            unitsContainer?.insertAdjacentHTML('beforeend', unitTemplate);
            triggerSpawnAnimation(unitsContainer, '.unit-catalog-row');
            return;
        }

        if (target.id === 'btnMainAddDetachment') {
            detachmentsContainer?.insertAdjacentHTML('beforeend', detachmentTemplate);
            triggerSpawnAnimation(detachmentsContainer, '.detachment-row');
            return;
        }

        if (target.id === 'btnAddModelProfile') {
            modelsProfileContainer?.insertAdjacentHTML('beforeend', modelProfileTemplate);
            triggerSpawnAnimation(modelsProfileContainer, '.model-profile-card');
            return;
        }

        if (target.id === 'btnMainAddAbility') {
            addNewAbilityCard();
            return;
        }

        // Exakt DEIN schönes verschachteltes Template eingesetzt!
        if (e.target.classList.contains('btn-add-nested-dynamic')) {
            const card = e.target.closest('.ability-card');

            // REIN ANATOMISCHES HTML: Keine Breiten, keine Inline-Styles!
            const nestedHtml = `
                <div class="nested-effect-row animate-spawn">
                    <input type="text" placeholder="Bedingung (z.B. Ab 3 verlorenen Modellen)" class="form-input input-condition">
                    <input type="text" placeholder="Effekt (z.B. +1 auf Trefferwürfe)" class="form-input input-effect">
                    <button type="button" class="btn-trash btn-delete-nested" title="Effekt löschen">🗑️</button>
                </div>
            `;
            
            e.target.insertAdjacentHTML('beforebegin', nestedHtml);
            if (card) triggerSpawnAnimation(card, '.nested-effect-row');
            return;
        }

        if (target.id === 'btnAddRangedWeapon') {
            addWeaponCard(rangedWeaponsContainer, 'Fernkampfwaffe', 'z.B. Fleshborer / Heavy Venom Cannon', '18&quot;', '2', '4+', 'Standard-Fernkampfwaffe');
            return;
        }

        if (target.id === 'btnAddMeleeWeapon') {
            addWeaponCard(meleeWeaponsContainer, 'Nahkampfwaffe', 'z.B. Scything Talons / Power Weapon', 'Melee', '4', '4+', 'Standard-Nahkampfwaffe', true);
            return;
        }

        // --- BEARBEITEN-BUTTONS ---
        const editUnitBtn = target.closest('.btn-edit-unit');
        if (editUnitBtn) {
            e.preventDefault();
            const row = editUnitBtn.closest('.unit-catalog-row');
            const nameSpan = row?.querySelector('.unit-name');
            if (nameSpan && dsUnitNameInput && unitDatasheetModal) {
                dsUnitNameInput.value = nameSpan.textContent.trim();
                unitDatasheetModal.classList.add('show');
            }
            return;
        }

        // --- LÖSCHEN & BESTÄTIGUNGEN ---
        if (target.closest('.btn-remove-unit')) {
            openDeleteModal(target.closest('.unit-catalog-row'), "Einheit löschen?", "Möchtest du diese Einheit wirklich aus dem Katalog löschen?");
            return;
        }

        if (target.closest('.btn-remove-detachment')) {
            openDeleteModal(target.closest('.detachment-row'), "Detachment löschen?", "Möchtest du dieses Detachment wirklich löschen? Alle zugewiesenen Daten gehen verloren.");
            return;
        }

        if (target.closest('.btn-remove-entire-ability')) {
            openDeleteModal(target.closest('.ability-card'), "Fähigkeit löschen?", "Möchtest du diese gesamte Fähigkeit inklusive aller eingetragenen Texte und spezifischen Effekte wirklich löschen?");
            return;
        }

        if (target.closest('.btn-remove-weapon')) {
            target.closest('.weapon-card')?.remove();
            return;
        }

        if (target.closest('.btn-remove-model-profile')) {
            if (modelsProfileContainer && modelsProfileContainer.querySelectorAll('.model-profile-card').length > 1) {
                target.closest('.model-profile-card')?.remove();
            } else {
                alert("Eine Einheit muss mindestens aus einem Modell-Profil bestehen!");
            }
            return;
        }

        if (target.closest('.btn-delete-nested')) {
            target.closest('.nested-effect-row')?.remove();
            return;
        }

        if (target === btnConfirmDeleteCoice) {
            rowToDeleteCurrently?.remove();
            rowToDeleteCurrently = null;
            deleteConfirmModal?.classList.remove('show');
            return;
        }

        if (target === btnCancelDeleteCoice) {
            rowToDeleteCurrently = null;
            deleteConfirmModal?.classList.remove('show');
            return;
        }
    });
});

// ==========================================
// 5. HELFER-FUNKTIONEN
// ==========================================

function triggerSpawnAnimation(container, selector) {
    if (!container) return;
    const items = container.querySelectorAll(`${selector}.animate-spawn`);
    const lastItem = items[items.length - 1];
    if (lastItem) {
        setTimeout(() => lastItem.classList.remove('animate-spawn'), 200);
    }
}

function openDeleteModal(element, title, text) {
    rowToDeleteCurrently = element;
    if (deleteModalTitle) deleteModalTitle.textContent = title;
    if (deleteModalText) deleteModalText.textContent = text;
    deleteConfirmModal?.classList.add('show');
}

function addNewAbilityCard() {
    if (!abilitiesContainer) return;
    const nestedBoxId = `nested-box-${abilityCounter}`;
    const nestedBtnId = `nested-btn-${abilityCounter}`;

    const abilityTemplate = `
        <div class="ability-card animate-spawn" data-ability-index="${abilityCounter}">
            <div class="ability-card-header">
                <span class="ability-title">✨ Fähigkeit #${abilityCounter} (Neu)</span>
                <button type="button" class="btn-trash btn-remove-entire-ability">🗑️ Fähigkeit löschen</button>
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
                <div class="inline-form-group"><label class="form-label-inline">Limit:</label><input type="number" value="1" class="form-input input-small"></div>
                <div class="inline-form-group flex-grow-input">
                    <label class="form-label-inline">Anwendung(en) pro</label>
                    <select class="form-input select-input"><option>unbegrenzt</option><option>Runde</option><option>Spiel</option></select>
                </div>
                <div class="inline-form-group">
                    <label class="form-label-inline">Dauer des Effekts:</label>
                    <select class="form-input select-input"><option>Sofort (Instant)</option><option>Bis zum Ende der Phase</option><option>Bis zum Ende des Zuges</option></select>
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
    triggerSpawnAnimation(abilitiesContainer, '.ability-card');
}

function addWeaponCard(container, typeLabel, placeholderText, rValue, aDefault, bsDefault, nameDefault, isDisabled = false) {
    if (!container) return;
    const weaponCard = document.createElement('div');
    weaponCard.className = 'weapon-card';
    
    const disabledAttr = isDisabled ? 'disabled style="text-align: center; background-color: #f0f0f0; font-weight: bold; color: #666;"' : `placeholder="${rValue}"`;
    const bsLabel = isDisabled ? 'WS' : 'BS';
    const keywordPlaceholder = isDisabled ? 'z.B. Twin-linked, Anti-Infantry 4+, Sustained Hits 1' : 'z.B. Assault, Lethal Hits, Blast';

    weaponCard.innerHTML = `
        <div class="weapon-card-top-row">
            <div class="form-group weapon-name-group">
                <label class="form-label weapon-name-label">${typeLabel}:</label>
                <div class="weapon-input-row">
                    <input type="text" placeholder="${placeholderText}" class="form-input" value="${nameDefault}">
                    <button type="button" class="btn-trash btn-remove-weapon" title="Waffe löschen">🗑️</button>
                </div>
            </div>
        </div>
        <div class="weapon-stats-row">
            <div class="form-group weapon-stat-group"><label>R</label><div class="stat-input-wrapper"><input type="text" ${isDisabled ? '' : `placeholder="${rValue}"`} value="${isDisabled ? 'Melee' : ''}" class="form-input" ${disabledAttr}></div></div>
            <div class="form-group weapon-stat-group"><label>A</label><div class="stat-input-wrapper"><input type="text" placeholder="${aDefault}" class="form-input"></div></div>
            <div class="form-group weapon-stat-group"><label>${bsLabel}</label><div class="stat-input-wrapper"><input type="text" placeholder="${bsDefault}" class="form-input"></div></div>
            <div class="form-group weapon-stat-group"><label>S</label><div class="stat-input-wrapper"><input type="text" placeholder="4" class="form-input"></div></div>
            <div class="form-group weapon-stat-group"><label>AP</label><div class="stat-input-wrapper"><input type="text" placeholder="0" class="form-input"></div></div>
            <div class="form-group weapon-stat-group"><label>D</label><div class="stat-input-wrapper"><input type="text" placeholder="1" class="form-input"></div></div>
        </div>
        <div class="weapon-abilities-row">
            <div class="form-group">
                <label class="form-label">Waffenfähigkeiten / Keywords:</label>
                <input type="text" placeholder="${keywordPlaceholder}" class="form-input">
            </div>
        </div>
    `;
    container.appendChild(weaponCard);
}