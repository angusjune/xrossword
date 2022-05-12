<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let letters = [];
    export let count = 3;
    export let cursor = 0;
    export let min = 3;
    export let max = 8;

    let boxes = [];
    let prevCursor = 0;

    function clickBox(index) {
        cursor = index;

        if (index === prevCursor) {
            count = index + 1;
            letters.splice(count + 1);
            letters = letters;
        } else if (index > count - 1) {
            count = index + 1;
        }
        
        prevCursor = index;
    }

    $:if (cursor < 0) {
        prevCursor = cursor;
    }

    $:if (boxes) {
        boxes = [];
        for(let i = 0; i < max; i++) {
            boxes = [...boxes, i];
        }
    }

</script>

<div class="letterbox">
    <div class="letterbox__label" class:active={cursor > -1}>Word</div>

    <div class="letterbox__boxes" on:keydown={(e)=>dispatch('keydown', e)}>
        {#each boxes as box, i (box)}
        <div 
            class="letterbox__box" 
            class:focus={cursor === i}
            class:active={i < count}
            tabindex="0"
            on:click={()=>clickBox(i)}
        >
            {letters[i] ? letters[i] : ''}

            {#if i >= min - 1}
            <span class="letterbox__box-label" class:inactive={i !== count - 1} >{i + 1}</span>
            {/if}
        </div>
        {/each}
    </div>

    <div class="letterbox__tip">
        <p>Tap <strong>once</strong> on the box to <strong>increase</strong> word length.</p>
        <p>Tap <strong>twice</strong> on the box to <strong>decrease</strong> word length.</p>
    </div>
</div>

<style scoped lang="scss">
    .letterbox {

        &__boxes {
            box-sizing: border-box;
            display: flex;
            font-size: 2em;
        }

        &__box {
            --border: 2px solid var(--ruler);

            position: relative;
            width: 12.5%;
            height: 3.1rem;
            border: var(--border);
            border-right: 0;
            cursor: text;
            display: grid;
            place-items: center;
            touch-action: manipulation;
            text-transform: uppercase;

            &:after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
                transition: box-shadow 0.1s;
                box-shadow: 0 0 0 2px transparent;
            }

            &.active:after {
                box-shadow: 0 0 0 2px var(--on-surface-secondary);
            }

            &:first-of-type, &:first-of-type:after {
                border-radius: 4px 0 0 4px;
            }

            &:last-of-type {
                border-right: var(--border);
            }

            &:last-of-type, &:last-of-type:after {
                border-radius: 0 4px 4px 0;
            }

            &.focus, &:focus {
                outline: 0;
                z-index: 1;
                background: var(--surface);
                &:after {
                    box-shadow: 0 0 0 2px var(--theme);
                }
            }
        }

        &__box-label {
            font-size: 0.75rem;
            position: absolute;
            top: -1.5em;
            right: 0;

            &.inactive {
                opacity: 0.35;
            }

            &.selected {
                color: var(--theme);
            }
        }

        &__label {
            font-weight: bold;
            margin-bottom: 0.5em;

            &.active {
                color: var(--theme);
            }
        }

        &__tip  {
            padding-top: 1em;
            color: var(--on-surface-secondary);
            font-size: 0.75em;
            
            p {
                margin: 0;
            }
        }
    }
</style>