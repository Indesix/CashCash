<template>
  <div class="dashboard-container">
    
    <h1 class="app-title">💰 CashCash</h1>

    <TresorerieWidget 
      :comptes="tresoreries" 
      @add="showTresorerieForm = true"
      @edit="handleEditTresorerie"
      @delete="handleDeleteTresorerie"
    />

    <EntretienWidget 
      :entretiens="entretiens"
      @delete="handleDeleteEntretien"
    />

    <LocataireWidget 
      :locataires="locataires"
      @delete="handleDeleteLocataire"
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

        <div class="transactions-section">
          <h2>📉 Dernières Transactions</h2>
          <div class="transactions-list">
            <div v-if="transactions.length === 0" class="info">Aucune transaction.</div>
            <table v-else class="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in transactions" :key="t.idTransaction">
                  <td>{{ new Date(t.dateTransaction).toLocaleDateString() }}</td>
                  <td><span class="badge-type">{{ t.typeTransaction }}</span></td>
                  <td>{{ t.description }}</td>
                  <td :class="t.montant < 0 ? 'negative' : 'positive'">
                    {{ new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(t.montant) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showAddForm" class="form-section">
        <AddImmeubleForm 
          :initialData="editingImmeuble"
          :tresoreries="tresoreries"
          :locataires="locataires"
          @save="handleSaveImmeuble" 
          @cancel="handleCancelForm"
          @add-entretien="handleAddEntretien"
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
import { Entretien } from '../../shared/entretien';
import { useImmeubles } from '../composables/immeubles'; // Use composable
import { useTresorerie } from '../composables/tresorerie'; // Use composable
import { useTransactions } from '../composables/transactions';
import { useLocataires } from '../composables/locataires';
import { useEntretiens } from '../composables/entretiens';

import TresorerieWidget from '../components/TresorerieWidget.vue';
import LocataireWidget from '../components/LocataireWidget.vue';
import EntretienWidget from '../components/EntretienWidget.vue';
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
const { transactions, fetchTransactions } = useTransactions();
const { locataires, fetchLocataires, deleteLocataire } = useLocataires();
const { entretiens, fetchEntretiens, addEntretien, deleteEntretien } = useEntretiens();

// --- LOGIQUE ---
const loadData = async () => {
  loading.value = true;
  
  // Fetch real data from Electron/DB
  await Promise.all([
    fetchImmeubles(),
    fetchTresoreries(),
    fetchTransactions(),
    fetchLocataires(),
    fetchEntretiens()
  ]);

  loading.value = false;
};

// --- ACTIONS ---
const handleSaveImmeuble = async (formData: Immeuble) => {
  if (editingImmeuble.value) {
    // Update existing
    console.log("Updating database:", formData);
    await updateImmeuble(formData);
    await Promise.all([fetchTresoreries(), fetchTransactions(), fetchLocataires(), fetchImmeubles()]);
  } else {
    // Create new
    const newImmeuble: Immeuble = {
      ...formData,
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
    // Refresh everything as adding an immeuble might create a transaction, update treasury, or create a locataire
    await Promise.all([fetchTresoreries(), fetchTransactions(), fetchLocataires(), fetchImmeubles()]);
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

const handleDeleteLocataire = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce locataire ?')) {
    try {
      await deleteLocataire(id);
      // Refresh immeubles because some might have been linked to this tenant
      await fetchImmeubles();
    } catch (error) {
      console.error("Failed to delete locataire:", error);
      alert("Impossible de supprimer ce locataire. Il est peut-être lié à d'autres données.");
    }
  }
};

const handleDeleteEntretien = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet entretien ?')) {
    await deleteEntretien(id);
  }
};

const handleAddEntretien = async (data: { entretien: Omit<Entretien, 'idEntretien'>, idTresorerie: number }) => {
  await addEntretien(data.entretien, data.idTresorerie);
  // Refresh data to show impact on treasury and transactions
  await Promise.all([
    fetchTresoreries(),
    fetchTransactions()
  ]);
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

/* Transactions Table */
.transactions-section {
  margin-top: 3rem;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  color: #333;
}

.transactions-table th,
.transactions-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.transactions-table th {
  background: #f3f4f6;
  font-weight: 600;
  color: #4b5563;
}

.transactions-table tr:last-child td {
  border-bottom: none;
}

.badge-type {
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.positive {
  color: #10b981;
  font-weight: bold;
}

.negative {
  color: #ef4444;
  font-weight: bold;
}
</style>