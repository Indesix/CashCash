<template>
  <div class="container">
    <form @submit.prevent="handleAdd">
      <h2>Ajouter un immeuble</h2>

      <input
        v-model="typeImmeuble"
        type="text"
        name="typeImmeuble"
        placeholder="Type d'immeuble (maison, appartement, commerce...)"
      />

      <input
        v-model="adresse"
        type="text"
        name="adresse"
        placeholder="Adresse"
      />

      <input
        v-model.number="rc"
        type="number"
        name="rc"
        placeholder="Revenu cadastral"
      />

      <input
        v-model.number="surface"
        type="number"
        name="surface"
        placeholder="Surface (m²)"
      />

      <input
        v-model.number="valeurAchat"
        type="number"
        step="0.01"
        name="valeurAchat"
        placeholder="Valeur d'achat (€)"
      />

      <div class="grid">
        <input
          v-model.number="chambres"
          type="number"
          name="chambres"
          placeholder="Nombre de chambres"
        />
        <input
          v-model.number="wc"
          type="number"
          name="wc"
          placeholder="Nombre de WC"
        />
      </div>

      <div class="checkboxes">
        <label>
          <input type="checkbox" v-model="grenier" />
          Grenier
        </label>
        <label>
          <input type="checkbox" v-model="garage" />
          Garage
        </label>
        <label>
          <input type="checkbox" v-model="jardin" />
          Jardin
        </label>
        <label>
          <input type="checkbox" v-model="balcon" />
          Balcon
        </label>
        <label>
          <input type="checkbox" v-model="ascenseur" />
          Ascenseur
        </label>
      </div>

      <button type="submit">Ajouter l'immeuble</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Immeuble from '../../shared/immeuble';
import { useImmeubles } from '../composables/immeubles';

const { addImmeuble } = useImmeubles();
const router = useRouter();

const typeImmeuble = ref('');
const adresse = ref('');
const rc = ref<number | null>(null);
const surface = ref<number | null>(null);
const valeurAchat = ref<number | null>(null);
const chambres = ref<number | null>(null);
const wc = ref<number | null>(null);
const grenier = ref(false);
const garage = ref(false);
const jardin = ref(false);
const balcon = ref(false);
const ascenseur = ref(false);

const handleAdd = async () => {
  const immeuble: Immeuble = {
    // idImmeuble généré côté backend / main
    typeImmeuble: typeImmeuble.value,
    adresse: adresse.value,
    rc: rc.value ?? 0,
    surface: surface.value ?? 0,
    valeurAchat: valeurAchat.value ?? 0,
    chambres: chambres.value ?? 0,
    wc: wc.value ?? 0,
    grenier: grenier.value,
    garage: garage.value,
    jardin: jardin.value,
    balcon: balcon.value,
    ascenseur: ascenseur.value,
    // adapte si tu as besoin d'idTresorerie ou autre
    idTresorerie: 0
  };

  await addImmeuble(immeuble);
  router.push('/');
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at top, #022c22 0, #01130f 55%, #000 100%);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2.5rem;
  background: #064e3b;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  min-width: 520px;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

h2 {
  color: #facc15;
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

input {
  padding: 0.75rem 1rem;
  border: 2px solid #065f46;
  border-radius: 8px;
  background-color: #022c22;
  color: #ecf0f1;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
}

input:focus {
  border-color: #facc15;
  background-color: #064e3b;
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.4);
}

input::placeholder {
  color: #9ca3af;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  margin-top: 0.5rem;
}

.checkboxes label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #e5e7eb;
  font-size: 0.9rem;
}

.checkboxes input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: #facc15;
  cursor: pointer;
}

button {
  background: linear-gradient(135deg, #facc15, #f59e0b);
  border: none;
  color: #1f2933;
  padding: 0.85rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  margin-top: 0.5rem;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.4);
  filter: brightness(1.05);
}
</style>
