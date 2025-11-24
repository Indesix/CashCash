import { ref } from "vue";
import { Tresorerie } from "../../shared/tresorerie";

const tresoreries = ref<Tresorerie[]>([]);

export function useTresorerie() {
    const fetchTresoreries = async () => {
        if (!window.electronService) {
            console.error("Electron Service not found!");
            return;
        }
        try {
            tresoreries.value = await window.electronService.tresoreries.getTresoreries();
        } catch (e) {
            console.error("Failed to fetch tresoreries:", e);
        }
    };

    const addTresorerie = async (tresorerie: Tresorerie) => {
        await window.electronService.tresoreries.addTresorerie(tresorerie);
        await fetchTresoreries();
    };

    const updateTresorerie = async (tresorerie: Tresorerie) => {
        await window.electronService.tresoreries.updateTresorerie(tresorerie);
        await fetchTresoreries();
    };

    const deleteTresorerie = async (id: number) => {
        await window.electronService.tresoreries.deleteTresorerie(id);
        await fetchTresoreries();
    };

    return {
        tresoreries,
        fetchTresoreries,
        addTresorerie,
        updateTresorerie,
        deleteTresorerie
    };
}
