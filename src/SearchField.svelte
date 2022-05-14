<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value;
    export let focus = false;

</script>

<div class="searchfield">
    <label for="input" class="searchfield__label" class:active={focus}>Related to</label>
    <input
        class="searchfield__input"
        type="search" 
        bind:value
        on:input={()=>dispatch('input')}
        on:change={()=>dispatch('change')}
        on:focus={()=>{dispatch('focus'); focus = true;}}
        on:blur={()=>{dispatch('blur'); focus = false;}}
        placeholder="e.g. madagascar primate"
        id="input"
    >
</div>

<style scoped lang="scss">
    .searchfield {
        position: relative;
        width: 100%;

        &__label {
            display: inline-block;
            font-weight: bold;
            margin-bottom: 0.5em;

            &.active {
                color: var(--theme);
            }
        }

        &__input {
            -webkit-appearance:none;
            caret-color: var(--theme);
            width: 100%;
            font-size: 1.5em;
            background: var(--background);
            border: 2px solid var(--on-surface-secondary);
            border-radius: 4px;
            padding: 0.5em;
            color: var(--on-surface);
            touch-action: manipulation;

            &::-webkit-search-decoration/*, &::-webkit-search-cancel-button*/ {
                display: none;
            }

            &::-webkit-input-placeholder {
                color: var(--input-placeholder);
            }

            &:focus {
                outline: 0;
                border-color: var(--theme);
                background: var(--surface);
            }
        }
    }
</style>