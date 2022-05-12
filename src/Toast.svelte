<script>
    import { fade } from 'svelte/transition';
    export let show = false;
    export let duration = 2000;

    $:if (show) {
        setTimeout(()=>{
            show = false;
        }, duration);
    }
</script>

{#if show}
<div class="toast" transition:fade={{duration: 300}} >
    <slot></slot>
</div>
{/if}

<style>
    .toast {
        display: flex;
        padding: 1em 1.5em;
        background: var(--on-surface);
        border-radius: 4px;
        color: var(--surface);
        font-weight: bold;
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -40%);
    }
</style>