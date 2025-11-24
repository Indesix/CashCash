<template>
  <form @submit.prevent="submit" class="add-form">
    <h3>{{ isEditing ? 'Modifier l\'immeuble' : 'Ajouter un immeuble' }}</h3>
    
    <input v-model="form.typeImmeuble" placeholder="Type (ex: MAISON)" required />
    <input v-model="form.adresse" placeholder="Adresse" required />
    <input v-model.number="form.valeurAchat" type="number" placeholder="Valeur Achat (€)" required />
    <input v-model.number="form.surface" type="number" placeholder="Surface (m²)" required />
    
    <div class="actions">
      <button type="button" @click="$emit('cancel')" class="btn-cancel">Annuler</button>
      <button type="submit" class="btn-save">{{ isEditing ? 'Modifier' : 'Sauvegarder' }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import Immeuble from '../../shared/immeuble';

const props = defineProps<{
  initialData?: Immeuble | null
}>();

const emit = defineEmits<{
  (e: 'save', immeuble: Immeuble): void
  (e: 'cancel'): void
}>();

const isEditing = computed(() => !!props.initialData);

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
  idTresorerie: 0
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(form, newData);
  } else {
    // Reset form
    form.idImmeuble = 0;
    form.typeImmeuble = '';
    form.adresse = '';
    form.valeurAchat = 0;
    form.surface = 0;
    // ... reset others if needed
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
