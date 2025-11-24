<template>
    <button class="add-immeuble" @click="handleClick">Ajouter Immeuble</button>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleClick = () => {
    router.push('/add-immeuble');
};
</script>

<style scoped>
.add-immeuble {
    position: fixed;
    bottom: 2rem;
    right: 2rem;

    background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-soft));
    color: #1f2933;

    padding: 1rem 2rem;
    border-radius: 999px;
    border: none;
    font-size: 1rem;
    font-weight: 700;

    cursor: pointer;
    box-shadow: 0 10px 25px rgba(0,0,0,0.35);
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.add-immeuble:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(0,0,0,0.45);
    filter: brightness(1.05);
}
</style>
