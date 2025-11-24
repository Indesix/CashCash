<template>
  <form @submit.prevent="submit" class="add-form">
    <h3>{{ isEditing ? 'Modifier l\'immeuble' : 'Ajouter un immeuble' }}</h3>
    
    <div class="form-grid">
      <div class="form-group">
        <label>Type</label>
        <input v-model="form.typeImmeuble" placeholder="Ex: Maison, Appartement..." required />
      </div>

      <div class="form-group">
        <label>Adresse</label>
        <input v-model="form.adresse" placeholder="Adresse complète" required />
      </div>

      <div class="form-group">
        <label>Valeur Achat (€)</label>
        <input v-model.number="form.valeurAchat" type="number" placeholder="0" required />
      </div>

      <div class="form-group">
        <label>Surface (m²)</label>
        <input v-model.number="form.surface" type="number" placeholder="0" required />
      </div>

      <div class="form-group">
        <label>Revenu Cadastral (RC)</label>
        <input v-model.number="form.rc" type="number" placeholder="0" />
      </div>

      <div class="form-group">
        <label>Nombre de Chambres</label>
        <input v-model.number="form.chambres" type="number" placeholder="0" />
      </div>

      <div class="form-group">
        <label>Nombre de WC</label>
        <input v-model.number="form.wc" type="number" placeholder="0" />
      </div>

      <div class="form-group">
        <label>{{ isEditing ? 'Locataire' : 'Locataire' }}</label>
        <div class="locataire-selection">
          <div class="radio-group">
            <label>
              <input type="radio" v-model="locataireMode" value="new" /> Nouveau
            </label>
            <label>
              <input type="radio" v-model="locataireMode" value="existing" /> Existant
            </label>
          </div>
          
          <input 
            v-if="locataireMode === 'new'"
            v-model="form.locataireName" 
            placeholder="Nom du nouveau locataire" 
          />
          
          <select 
            v-else
            v-model="form.idLocataire"
          >
            <option :value="undefined">-- Sélectionner un locataire --</option>
            <option v-for="l in locataires" :key="l.idLocataire" :value="l.idLocataire">
              {{ l.nom }} {{ l.prenom || '' }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <h4>Équipements</h4>
    <div class="checkbox-grid">
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.grenier" /> Grenier
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.garage" /> Garage
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.jardin" /> Jardin
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.balcon" /> Balcon
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.ascenseur" /> Ascenseur
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.studic" /> Studio
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.commun" /> Commun
      </label>
    </div>

    <h4>Commerce / Colocation</h4>
    <div class="form-grid">
      <div class="form-group">
        <label>Type Commerce</label>
        <input v-model="form.typeCommerce" placeholder="Ex: Boulangerie..." />
      </div>
      <div class="form-group">
        <label>Loyer Commerce (€)</label>
        <input v-model.number="form.loyerCommerce" type="number" placeholder="0" />
      </div>
      <div class="form-group">
        <label>Nombre de Colocs</label>
        <input v-model.number="form.nbColocs" type="number" placeholder="0" />
      </div>
    </div>

    <div class="form-group" v-if="!isEditing">
      <label>Compte à débiter (Optionnel)</label>
      <select v-model.number="form.idTresorerie">
        <option :value="0">-- Aucun --</option>
        <option v-for="t in tresoreries" :key="t.idTresorerie" :value="t.idTresorerie">
          {{ t.nomCompte }} ({{ t.soldeActuel }} €)
        </option>
      </select>
    </div>

    <div v-if="isEditing" class="entretien-section">
      <h4>Ajouter un Entretien</h4>
      <div class="form-grid">
        <div class="form-group">
          <label>Description</label>
          <input v-model="entretienForm.description" placeholder="Ex: Réparation toiture" />
        </div>
        <div class="form-group">
          <label>Responsable</label>
          <input v-model="entretienForm.responsable" placeholder="Ex: Entreprise X" />
        </div>
        <div class="form-group">
          <label>Coût (€)</label>
          <input v-model.number="entretienForm.cout" type="number" placeholder="0" />
        </div>
        <div class="form-group">
          <label>Date</label>
          <input v-model="entretienForm.dateHeure" type="date" />
        </div>
      </div>
      <div class="form-group">
        <label>Compte à débiter</label>
        <select v-model.number="entretienForm.idTresorerie">
          <option :value="0">-- Aucun --</option>
          <option v-for="t in tresoreries" :key="t.idTresorerie" :value="t.idTresorerie">
            {{ t.nomCompte }} ({{ t.soldeActuel }} €)
          </option>
        </select>
      </div>
      <button type="button" @click="addEntretien" class="btn-secondary">Enregistrer l'entretien</button>
    </div>
    
    <div class="actions">
      <button type="button" @click="$emit('cancel')" class="btn-cancel">Annuler</button>
      <button type="submit" class="btn-save">{{ isEditing ? 'Modifier' : 'Sauvegarder' }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue';
import Immeuble from '../../shared/immeuble';
import { Tresorerie } from '../../shared/tresorerie';
import { Entretien } from '../../shared/entretien';
import { Locataire } from '../../shared/locataire';

const props = defineProps<{
  initialData?: Immeuble | null,
  tresoreries?: Tresorerie[],
  locataires?: Locataire[]
}>();

const emit = defineEmits<{
  (e: 'save', immeuble: Immeuble): void
  (e: 'cancel'): void
  (e: 'add-entretien', data: { entretien: Omit<Entretien, 'idEntretien'>, idTresorerie: number }): void
}>();

const isEditing = computed(() => !!props.initialData);
const locataireMode = ref<'new' | 'existing'>('new');

const form = reactive<Immeuble>({
  idImmeuble: 0,
  typeImmeuble: '',
  adresse: '',
  valeurAchat: 0,
  surface: 0,
  rc: 0,
  chambres: 0,
  wc: 0,
  grenier: false,
  garage: false,
  jardin: false,
  balcon: false,
  ascenseur: false,
  idTresorerie: 0,
  locataireName: '',
  idLocataire: undefined
});

const entretienForm = reactive({
  description: '',
  responsable: '',
  cout: 0,
  dateHeure: new Date().toISOString().split('T')[0],
  idTresorerie: 0
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(form, newData);
    if (newData.idLocataire) {
      locataireMode.value = 'existing';
    } else {
      locataireMode.value = 'new';
    }
  } else {
    // Reset form
    form.idImmeuble = 0;
    form.typeImmeuble = '';
    form.adresse = '';
    form.valeurAchat = 0;
    form.surface = 0;
    form.locataireName = '';
    form.idLocataire = undefined;
    locataireMode.value = 'new';
    // ... reset others if needed
  }
}, { immediate: true });

const submit = () => {
  // Clean up data based on mode
  if (locataireMode.value === 'existing') {
    form.locataireName = ''; // Clear name if using ID
  } else {
    form.idLocataire = undefined; // Clear ID if using name
  }
  emit('save', { ...form }); 
};

const addEntretien = () => {
  if (!entretienForm.description || !props.initialData?.idImmeuble) return;
  
  emit('add-entretien', {
    entretien: {
      description: entretienForm.description,
      responsable: entretienForm.responsable,
      cout: entretienForm.cout,
      dateHeure: new Date(entretienForm.dateHeure),
      idImmeuble: props.initialData.idImmeuble
    },
    idTresorerie: entretienForm.idTresorerie
  });

  // Reset entretien form
  entretienForm.description = '';
  entretienForm.responsable = '';
  entretienForm.cout = 0;
  entretienForm.idTresorerie = 0;
  alert('Entretien ajouté !');
};
</script>

<style scoped>
.add-form {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: #333;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
}

input, select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  border-color: #007bff;
  outline: none;
}

h4 {
  margin: 1rem 0 0.5rem 0;
  color: #444;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}
.btn-save {
  background: #007bff;
  color: white;
}
.btn-save:hover {
  background: #0056b3;
}
.btn-cancel {
  background: #e0e0e0;
  color: #333;
}
.btn-cancel:hover {
  background: #d0d0d0;
}
.btn-secondary {
  background: #6c757d;
  color: white;
  margin-top: 1rem;
}
.btn-secondary:hover {
  background: #5a6268;
}
.entretien-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px dashed #ddd;
}

.locataire-selection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.radio-group label {
  font-weight: normal;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
