<template>
  <div class="card-immeuble">
    <div class="card-header">
      <h3 class="title">
        {{ immeuble.typeImmeuble || 'Immeuble' }}
      </h3>
      <div class="header-actions">
        <button class="btn-icon edit" @click.stop="$emit('edit', immeuble)" title="Modifier">
          ✏️
        </button>
        <button class="btn-icon delete" @click.stop="$emit('delete', immeuble.idImmeuble)" title="Supprimer">
          🗑️
        </button>
        <span class="badge-id" v-if="immeuble.idImmeuble">
          #{{ immeuble.idImmeuble }}
        </span>
      </div>
    </div>

    <div class="info-row">
      <span class="label">Lieu :</span>
      <span class="value">
        {{ immeuble.adresse }}
      </span>
    </div>

    <div class="info-row">
      <span class="label">Coût :</span>
      <span class="value">
        {{ formatCurrency(immeuble.valeurAchat) }}
      </span>
    </div>

    <div class="info-row">
      <span class="label">Entretien à venir :</span>
      <span class="value">
        <span v-if="nextEntretien">
          {{ formatDate(nextEntretien) }}
        </span>
        <span v-else>
          Aucun prévu
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Immeuble from '../../shared/immeuble';

interface ImmeubleWithEntretien extends Immeuble {
  // Optionnel : si tu rajoutes ce champ côté backend
  nextEntretien?: string | Date | null;
}

const props = defineProps<{
  immeuble: ImmeubleWithEntretien;
}>();

const emit = defineEmits<{
  (e: 'edit', immeuble: Immeuble): void;
  (e: 'delete', id: number | undefined): void;
}>();

// On accepte string ou Date pour être flexible
const nextEntretien = computed(() => props.immeuble.nextEntretien ?? null);

const formatCurrency = (value: number | undefined | null) => {
  const v = value ?? 0;
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(v);
};

const formatDate = (value: string | Date) => {
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return 'Date invalide';
  return d.toLocaleDateString('fr-BE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};
</script>

<style scoped>
.card-immeuble {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: var(--bg-card, #064e3b);
  border: 1px solid rgba(250, 204, 21, 0.25);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.35);
  gap: 0.75rem;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card-immeuble:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-icon.delete:hover {
  background: rgba(239, 68, 68, 0.2); /* Red hover for delete */
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent-gold, #facc15);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.badge-id {
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(250, 204, 21, 0.5);
  color: var(--accent-gold, #facc15);
  background: rgba(0, 0, 0, 0.25);
}

.info-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  column-gap: 0.75rem;
  row-gap: 0.2rem;
  align-items: baseline;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-gold, #facc15);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.value {
  font-size: 0.95rem;
  color: var(--text-main, #f9fafb);
  word-break: break-word;
}
</style>
