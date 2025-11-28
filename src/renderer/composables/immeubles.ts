import { ref } from "vue";
import Immeuble from "../../shared/immeuble";

const immeubles = ref<Immeuble[]>([]); 
// immeubles is a property that holds an array of Immeuble objects
// elle est réactive grâce à 'ref' de Vue.js

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
        // c'est ici qu'on delegue l'ajout au service electron 
        // (c'est à dire au preload et main)
        // preload va appeler le main qui va appeler la bdd
        // preload a la fonction addImmeuble qui utilise ipcRenderer.invoke
        //  qui invoque justement la méthode exposée dans le main (ipcMain.handle)
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
