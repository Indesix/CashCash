import { ref } from "vue";
import Immeuble from "../../shared/immeuble";

const immeubles = ref<Immeuble[]>([]);

export function useImmeubles() {
    const fetchImmeubles = async () => {
        if (!window.electronService) {
            console.error("Electron Service not found!");
            return;
        }
        try {
            immeubles.value = await window.electronService.immeubles.getImmeubles();
        } catch (e) {
            console.error("Failed to fetch immeubles:", e);
        }
    };

    const addImmeuble = async (immeuble: Immeuble) => {
        await window.electronService.immeubles.addImmeuble(immeuble);
        await fetchImmeubles();
    };

    const updateImmeuble = async (immeuble: Immeuble) => {
        await window.electronService.immeubles.updateImmeuble(immeuble);
        await fetchImmeubles();
    };

    const deleteImmeuble = async (id: number) => {
        await window.electronService.immeubles.deleteImmeuble(id);
        await fetchImmeubles();
    };

    return {
        immeubles,
        fetchImmeubles,
        addImmeuble,
        updateImmeuble,
        deleteImmeuble
    };
}
