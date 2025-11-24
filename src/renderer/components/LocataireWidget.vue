<template>
  <div class="widget-wrapper">
    <h3>👥 Locataires</h3>
    <div class="locataire-widget">
      <div v-if="locataires.length === 0" class="info">Aucun locataire enregistré.</div>
      
      <div v-for="loc in displayedLocataires" :key="loc.idLocataire" class="locataire-card">
        <div class="card-header">
          <h4>{{ loc.nom }} {{ loc.prenom }}</h4>
          <button @click="$emit('delete', loc.idLocataire)" class="btn-icon delete" title="Supprimer">🗑️</button>
        </div>
        <div class="details">
          <p v-if="loc.travail">💼 {{ loc.travail }}</p>
          <p v-if="loc.age">🎂 {{ loc.age }} ans</p>
        </div>
      </div>
    </div>

    <button v-if="hasMore" @click="toggleShowAll" class="btn-see-more">
      {{ showAll ? 'Voir moins' : `Voir les autres (${hiddenCount})` }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Locataire } from '../../shared/locataire';

const props = defineProps<{
  locataires: Locataire[]
}>();

defineEmits<{
  (e: 'delete', id: number): void;
}>();

const showAll = ref(false);

const displayedLocataires = computed(() => {
  if (showAll.value) return props.locataires;
  return props.locataires.slice(0, 3); // Show first 3 by default
});

const hasMore = computed(() => props.locataires.length > 3);
const hiddenCount = computed(() => props.locataires.length - 3);

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};
</script>

<style scoped>
.widget-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.locataire-widget {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.locataire-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #333;
  min-width: 200px;
  flex: 1;
  max-width: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.card-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.details p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
  color: #ef4444;
}

.btn-see-more {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  align-self: flex-start;
}

.info {
  color: #888;
  font-style: italic;
}
</style>
