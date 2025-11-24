import { ref } from 'vue';
import { Locataire } from '../../shared/locataire';

const locataires = ref<Locataire[]>([]);

export function useLocataires() {
  const fetchLocataires = async () => {
    locataires.value = await window.electronService.locataires.getAll();
  };

  const addLocataire = async (locataire: Omit<Locataire, 'idLocataire'>) => {
    const newLocataire = await window.electronService.locataires.create(locataire);
    locataires.value.push(newLocataire);
    return newLocataire;
  };

  const deleteLocataire = async (id: number) => {
    await window.electronService.locataires.delete(id);
    locataires.value = locataires.value.filter(l => l.idLocataire !== id);
  };

  return {
    locataires,
    fetchLocataires,
    addLocataire,
    deleteLocataire
  };
}
