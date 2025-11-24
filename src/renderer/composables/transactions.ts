import { ref } from "vue";
import Transaction from "../../shared/transaction";

const transactions = ref<Transaction[]>([]);

export function useTransactions() {
    const fetchTransactions = async () => {
        if (!window.electronService) {
            console.error("Electron Service not found!");
            return;
        }
        try {
            transactions.value = await window.electronService.transactions.getTransactions();
        } catch (e) {
            console.error("Failed to fetch transactions:", e);
        }
    };

    return {
        transactions,
        fetchTransactions
    };
}
