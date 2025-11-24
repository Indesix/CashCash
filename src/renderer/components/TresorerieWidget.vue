<template>
  <div class="widget-wrapper">
    <div class="tresorerie-widget">
      <div v-for="compte in displayedComptes" :key="compte.idTresorerie" class="compte-card">
        <div class="card-header">
          <h4>{{ compte.nomCompte }}</h4>
          <div class="actions">
            <button @click="$emit('edit', compte)" class="btn-icon" title="Modifier">✏️</button>
            <button @click="$emit('delete', compte.idTresorerie)" class="btn-icon delete" title="Supprimer">🗑️</button>
          </div>
        </div>
        <p class="solde">{{ formatCurrency(compte.soldeActuel) }}</p>
      </div>

      <!-- Bouton Ajouter -->
      <button class="add-card-btn" @click="$emit('add')">
        <span class="plus-icon">+</span>
        <span>Ajouter un compte</span>
      </button>
    </div>

    <button v-if="hasMoreAccounts" @click="toggleShowAll" class="btn-see-more">
      {{ showAll ? 'Voir moins' : `Voir les autres comptes (${hiddenCount})` }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Tresorerie } from '../../shared/tresorerie';

const props = defineProps<{
  comptes: Tresorerie[]
}>();

defineEmits<{
  (e: 'add'): void;
  (e: 'edit', compte: Tresorerie): void;
  (e: 'delete', id: number | undefined): void;
}>();

const showAll = ref(false);

const displayedComptes = computed(() => {
  if (showAll.value) return props.comptes;
  // Affiche seulement le premier compte (ou celui qui s'appelle "Compte Courant BNP" si on voulait filtrer)
  return props.comptes.slice(0, 1);
});

const hasMoreAccounts = computed(() => props.comptes.length > 1);
const hiddenCount = computed(() => props.comptes.length - 1);

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const formatCurrency = (value: number | undefined) => {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value ?? 0);
};
</script>

<style scoped>
.widget-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tresorerie-widget {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.compte-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #333;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #555;
}

.actions {
  display: flex;
  gap: 0.25rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 2px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.btn-icon.delete:hover {
  color: #ef4444;
}

.solde {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.add-card-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
  padding: 1rem;
}

.add-card-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.plus-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.btn-see-more {
  background: none;
  border: none;
  color: var(--accent-gold, #facc15);
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  padding: 0;
  align-self: flex-start;
}

.btn-see-more:hover {
  color: #fff;
}
</style>
