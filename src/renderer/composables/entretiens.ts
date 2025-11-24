import { ref } from 'vue';
import { Entretien } from '../../shared/entretien';

const entretiens = ref<Entretien[]>([]);

export function useEntretiens() {
  const fetchEntretiens = async () => {
    entretiens.value = await window.electronService.entretiens.getAll();
  };

  const addEntretien = async (entretien: Omit<Entretien, 'idEntretien'>, idTresorerie?: number) => {
    const newEntretien = await window.electronService.entretiens.create(entretien, idTresorerie);
    entretiens.value.push(newEntretien);
    // Re-sort by date
    entretiens.value.sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
    return newEntretien;
  };

  const deleteEntretien = async (id: number) => {
    await window.electronService.entretiens.delete(id);
    entretiens.value = entretiens.value.filter(e => e.idEntretien !== id);
  };

  return {
    entretiens,
    fetchEntretiens,
    addEntretien,
    deleteEntretien
  };
}
