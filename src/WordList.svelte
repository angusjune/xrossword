<script>
    import { createEventDispatcher } from 'svelte';
    import { scale, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

    const dispatch = createEventDispatcher();

    export let words = [];
    export let loading = false;
    export let showEmptyState = false;
</script>

<section class="word-list" role="list">

    {#if loading}
    <div class="loader word-list__loader" transition:scale={{duration: 100}}></div>
    {:else}

    {#each words as word, index}
    <div class="word" role="listitem" tabindex="0" on:click={()=>dispatch('click', {index})} transition:fade={{duration:100, delay: index * 10}}>
        {word.word}
    </div>
    {/each}

    {#if words.length < 1 && showEmptyState}
        <div class="word-list__empty" transition:scale={{easing:quintOut, duration: 500}} aria-label="no search result">🤷‍♀️</div>
    {/if}

    {/if}
    
</section>

<style scoped lang="scss">
    @use 'base';
    @use 'loader' as *;

    @include loader($color: base.color('on-surface'), $border: .3em);

    .word-list {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        gap: 0.4em;

        &__empty {
            position: absolute;
            margin-bottom: 2em 0;
            font-size: 3em;
        }

        &__loader {
            position: absolute;
            margin-top: 2em;
        }
    }

    .word {
        background: darken(base.color('surface'), 10%);
        color: lighten(base.color('on-surface'), 10%);
        padding: 0.25em 0.5em;
        border-radius: 4px;
        cursor: pointer;
        touch-action: manipulation;

        &:acitve {
            filter: brightness(1.1);
        }
    }

    @media (prefers-color-scheme: dark) {
        @include loader($color: base.color('on-surface', 'dark'), $border: .3em);
    }
</style>