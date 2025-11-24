<template>
  <div class="widget-wrapper">
    <h3>🛠️ Entretiens à venir</h3>
    <div class="entretien-widget">
      <div v-if="upcomingEntretiens.length === 0" class="info">Aucun entretien prévu.</div>
      
      <div v-for="ent in displayedEntretiens" :key="ent.idEntretien" class="entretien-card">
        <div class="card-header">
          <h4>{{ new Date(ent.dateHeure).toLocaleDateString() }}</h4>
          <button @click="$emit('delete', ent.idEntretien)" class="btn-icon delete" title="Supprimer">🗑️</button>
        </div>
        <div class="details">
          <p class="desc">{{ ent.description }}</p>
          <p class="resp">👤 {{ ent.responsable }}</p>
          <p class="cout" v-if="ent.cout > 0">{{ ent.cout }} €</p>
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
import type { Entretien } from '../../shared/entretien';

const props = defineProps<{
  entretiens: Entretien[]
}>();

defineEmits<{
  (e: 'delete', id: number): void;
}>();

const showAll = ref(false);

const upcomingEntretiens = computed(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return props.entretiens.filter(e => new Date(e.dateHeure) >= now);
});

const displayedEntretiens = computed(() => {
  const list = upcomingEntretiens.value;
  if (showAll.value) return list;
  return list.slice(0, 3);
});

const hasMore = computed(() => upcomingEntretiens.value.length > 3);
const hiddenCount = computed(() => upcomingEntretiens.value.length - 3);

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

.entretien-widget {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.entretien-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #333;
  min-width: 200px;
  flex: 1;
  max-width: 300px;
  border-left: 4px solid #f59e0b;
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

.desc {
  font-weight: 500;
  color: #333;
}

.cout {
  color: #ef4444;
  font-weight: bold;
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
