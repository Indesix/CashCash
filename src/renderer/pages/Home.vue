<template>
  <div class="dashboard-container">
    
    <h1 class="app-title">💰 CashCash</h1>

    <TresorerieWidget 
      :comptes="tresoreries" 
      @add="showTresorerieForm = true"
      @edit="handleEditTresorerie"
      @delete="handleDeleteTresorerie"
    />

    <div class="content-split">
      <div class="list-section">
        <div class="header-row">
          <h2>🏢 Mes Immeubles</h2>
          <button @click="showAddForm = !showAddForm" class="btn-toggle">
            {{ showAddForm ? 'Fermer' : '+ Ajouter' }}
          </button>
        </div>

        <div v-if="loading" class="info">Chargement...</div>
        <div v-else-if="immeubles.length === 0" class="info">Aucun immeuble trouvé.</div>

        <div v-else class="cards-container">
          <Card 
            v-for="imm in immeubles" 
            :key="imm.idImmeuble" 
            :immeuble="imm"
            @edit="handleEditImmeuble"
            @delete="handleDeleteImmeuble"
          />
        </div>
      </div>

      <div v-if="showAddForm" class="form-section">
        <AddImmeubleForm 
          :initialData="editingImmeuble"
          @save="handleSaveImmeuble" 
          @cancel="handleCancelForm"
        />
      </div>

      <div v-if="showTresorerieForm" class="form-section">
        <AddTresorerieForm 
          :initialData="editingTresorerie"
          @save="handleSaveTresorerie" 
          @cancel="handleCancelTresorerieForm"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Immeuble from '../../shared/immeuble'; // Use shared interface
import { Tresorerie } from '../../shared/tresorerie';
import { useImmeubles } from '../composables/immeubles'; // Use composable
import { useTresorerie } from '../composables/tresorerie'; // Use composable

import TresorerieWidget from '../components/TresorerieWidget.vue';
import AddImmeubleForm from '../components/AddImmeubleForm.vue';
import AddTresorerieForm from '../components/AddTresorerieForm.vue';
import Card from '../components/Card.vue';

// --- ETAT ---
const loading = ref(true);
const showAddForm = ref(false);
const editingImmeuble = ref<Immeuble | null>(null);

const showTresorerieForm = ref(false);
const editingTresorerie = ref<Tresorerie | null>(null);

// Use the composables
const { immeubles, fetchImmeubles, addImmeuble, updateImmeuble, deleteImmeuble } = useImmeubles();
const { tresoreries, fetchTresoreries, addTresorerie, updateTresorerie, deleteTresorerie } = useTresorerie();

// --- LOGIQUE ---
const loadData = async () => {
  loading.value = true;
  
  // Fetch real data from Electron/DB
  await Promise.all([
    fetchImmeubles(),
    fetchTresoreries()
  ]);

  loading.value = false;
};

// --- ACTIONS ---
const handleSaveImmeuble = async (formData: Immeuble) => {
  if (editingImmeuble.value) {
    // Update existing
    console.log("Updating database:", formData);
    await updateImmeuble(formData);
  } else {
    // Create new
    // Map the simplified form data to the full Immeuble object if needed, 
    // but AddImmeubleForm now returns a fuller object (though still partial if fields are missing)
    // We should ensure defaults are set if they are missing.
    const newImmeuble: Immeuble = {
      ...formData,
      // Ensure defaults for fields not in the form if they are undefined
      rc: formData.rc ?? 0,
      chambres: formData.chambres ?? 0,
      wc: formData.wc ?? 0,
      grenier: formData.grenier ?? false,
      garage: formData.garage ?? false,
      jardin: formData.jardin ?? false,
      balcon: formData.balcon ?? false,
      ascenseur: formData.ascenseur ?? false,
      idTresorerie: formData.idTresorerie ?? 0
    };
    console.log("Saving to database:", newImmeuble);
    await addImmeuble(newImmeuble);
  }
  
  handleCancelForm();
};

const handleDeleteImmeuble = async (id: number | undefined) => {
  if (!id) return;
  if (confirm('Êtes-vous sûr de vouloir supprimer cet immeuble ?')) {
    await deleteImmeuble(id);
  }
};

const handleEditImmeuble = (immeuble: Immeuble) => {
  console.log("Edit requested for:", immeuble);
  editingImmeuble.value = immeuble;
  showAddForm.value = true;
};

const handleCancelForm = () => {
  showAddForm.value = false;
  editingImmeuble.value = null;
};

// --- TRESORERIE ACTIONS ---
const handleSaveTresorerie = async (formData: Tresorerie) => {
  if (editingTresorerie.value) {
    await updateTresorerie(formData);
  } else {
    await addTresorerie(formData);
  }
  handleCancelTresorerieForm();
};

const handleDeleteTresorerie = async (id: number | undefined) => {
  if (!id) return;
  if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
    await deleteTresorerie(id);
  }
};

const handleEditTresorerie = (compte: Tresorerie) => {
  editingTresorerie.value = compte;
  showTresorerieForm.value = true;
};

const handleCancelTresorerieForm = () => {
  showTresorerieForm.value = false;
  editingTresorerie.value = null;
};

// Au montage du composant
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 2500px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.app-title {
  color: #facc15; /* Gold color */
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.content-split {
  position: relative;
}

.list-section {
  width: 100%;
}

.form-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-toggle {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* Style des cartes Immeubles */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.simple-card {
  background: white;
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}
.simple-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.tag {
  background: #e1f5fe;
  color: #0288d1;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.price {
  font-weight: bold;
  color: #27ae60;
}
</style>