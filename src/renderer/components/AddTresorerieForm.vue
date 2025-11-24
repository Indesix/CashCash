<template>
  <form @submit.prevent="submit" class="add-form">
    <h3>{{ isEditing ? 'Modifier le compte' : 'Ajouter un compte' }}</h3>
    
    <div class="form-group">
      <label>Nom du compte</label>
      <input v-model="form.nomCompte" placeholder="Ex: Compte Courant" required />
    </div>

    <div class="form-group">
      <label>Solde Initial (€)</label>
      <input v-model.number="form.soldeInitial" type="number" step="0.01" placeholder="0.00" required />
    </div>
    
    <div class="actions">
      <button type="button" @click="$emit('cancel')" class="btn-cancel">Annuler</button>
      <button type="submit" class="btn-save">{{ isEditing ? 'Modifier' : 'Sauvegarder' }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import { Tresorerie } from '../../shared/tresorerie';

const props = defineProps<{
  initialData?: Tresorerie | null
}>();

const emit = defineEmits<{
  (e: 'save', tresorerie: Tresorerie): void
  (e: 'cancel'): void
}>();

const isEditing = computed(() => !!props.initialData);

const form = reactive<Tresorerie>({
  idTresorerie: 0,
  nomCompte: '',
  soldeInitial: 0,
  soldeActuel: 0
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(form, newData);
  } else {
    form.idTresorerie = 0;
    form.nomCompte = '';
    form.soldeInitial = 0;
    form.soldeActuel = 0;
  }
}, { immediate: true });

const submit = () => {
  emit('save', { ...form }); 
};
</script>

<style scoped>
.add-form {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #333;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-width: 300px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  font-size: 0.9rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
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
</style>
