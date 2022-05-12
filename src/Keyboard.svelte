<script>
    import { slide } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let show = true;
    export let cursor = 0;

    $: show = cursor > -1;

    function onToggle() {
        show = !show;
        if (!show) {
            cursor = -1;
        } else {
            if (cursor < 0) {
                cursor = 0;
            }
        }
    }

    const keys = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
    ];
</script>

<div class="keyboard-addon">
    <div class="row">
        <button class="toggle" on:click={onToggle}>
            {#if show}
            <span class="material-symbols-outlined">keyboard_hide</span>
            {:else}
            <span class="material-symbols-outlined">keyboard</span>
            {/if}
        </button>
    </div>
    <div class="keyboard-addon__padding"></div>
</div>

{#if show}
<div class="keyboard" transition:slide>
{#each keys as row}
    <div class="row">
        {#each row as key}
            <button 
                class="key"
                class:action={!key.match(/^[a-z]$/i)} 
                on:click={()=>{dispatch('input', { key })}}
            >
                {#if key == 'backspace'}
                <span class="material-symbols-outlined">backspace</span>
                {:else}
                {key}
                {/if}
            </button>
        {/each}
    </div>
{/each}
</div>
{/if}

<style scoped lang="scss">
    @use 'base';

    .keyboard {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding-bottom: env(safe-area-offset-bottom, 1em);
        background: var(--background);
    }

    .row {
        width: 96%;
        margin: 0 auto;
        display: flex;
        gap: 6px;
        justify-content: center;
        max-width: 640px;

        .keyboard-addon & {
            justify-content: flex-end;
        }
    }

    .key {
        --key-line-height: 4;

        -webkit-appearance: none;
        text-transform: uppercase;
        padding: 0;
        color: var(--on-surface);
        font-size: 0.75em;
        font-weight: bold;
        flex: 1;
        max-width: calc((100% - 54px) / 10);
        line-height: var(--key-line-height);
        overflow: hidden;
        border-radius: 4px;
        background: var(--surface-secondary);
        border: 0;
        margin: 0;
        display: grid;
        place-items: center;
        touch-action: manipulation;

        &:active {
            background: darken(base.color('surface-secondary'), 10%);
        }

        &.action {
            max-width: none;
        }
    }

    .keyboard-addon {
        &__padding {
            height: env(safe-area-offset-bottom, 1em);
            background: var(--background);
        }
    }

    .toggle {
        border-radius: 4px;
        background: var(--background);
        color: var(--on-surface);
        border: 0;
        padding: 0;
        width: 3em;
        height: 3em;
        display: grid;
        place-items: center;

        &:active {
            background: darken(base.color('background'), 10%);
        }
    }

    @media (prefers-color-scheme: dark) {
        .toggle:active {
            background: darken(base.color('background', 'dark'), 10%);
        }
        .key:active {
            background: darken(base.color('surface-secondary', 'dark'), 10%);
        }
    }

    @media (min-width: 520px) {
		.key {
            --key-line-height: 2.5;
        }
	}
</style>
