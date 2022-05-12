<script>
    import { tick } from 'svelte';
    import DictModal from './DictModal.svelte';
    import Toast from './Toast.svelte';
    import LetterBox from './LetterBox.svelte';
    import SearchField from './SearchField.svelte';
    import WordList from './WordList.svelte';
    import Keyboard from './Keyboard.svelte';

    const AT_LEAST = 1;

    let letters = [];
    let meansLike = '';

    let candidates = [];

    let letterCount = 3;
    let cursor = 0;

    let loading = false;
    let showEmptyState = false;

    let showModal = false;
    let showToast = false;

    function countNonEmpty() {
		let count = 0;
		for (const letter of letters) {
			if (letter) {
				count++;
			}
		}
		return count;
	}

    function onLetterBoxInput(e) {
		const { key } = e.detail;
		const keyVal = key.toLowerCase();
		showEmptyState = false;

        if (keyVal === 'backspace') {
            letters[cursor] = '';
        } else if (keyVal === 'enter') {
            if (countNonEmpty() >= AT_LEAST || meansLike) {
                fetchData();
            } else {
                toastOn('At least ' + AT_LEAST + ' letter' + (AT_LEAST> 1 ? 's' : ''));
            }
        } else if (keyVal.match(/^[a-z]$/i)) {
            candidates = [];
            letters[cursor] = keyVal;
        }
	}

	function onKeyPress(e){
        console.log(e);
		onLetterBoxInput({detail: { key: e.detail.key }});
	}

    let dict = {
		word: '',
		pron: '',
		defs: [],
	};

    function onClickWord(e) {
		const { index } = e.detail;

		const { word, tags, defs } = candidates[index];
		dict.word = word;
		dict.pron = tags[tags.findIndex(value => value.indexOf('ipa_pron') >= 0)].replace('ipa_pron:', '');
		dict.defs = defs;

		showModal = true;
	}

    let toastMsg = ''
    function toastOn(msg) {
        showToast = true;
        toastMsg = msg;
    }

    function onSearchFieldFocus() {
        cursor = -1;
    }

    function onSearchFieldInput() {
        candidates = [];
        showEmptyState = false;
    }

    function onSearchFieldChange() {
        if (meansLike || countNonEmpty() >= AT_LEAST ) {
            fetchData();
        } else {
            toastOn('Give me something');
        }
    }
    
    async function fetchData() {
		const ENDPOINT = 'https://api.datamuse.com/words';

        let meansLikeQueryStr = meansLike ? `&ml=${encodeURIComponent(meansLike)}` : '';
        let spellQueryStr = '';
        for (let i = 0; i < letterCount; i++) {
            letters[i] ? spellQueryStr += letters[i] : spellQueryStr += '?'
        }

		const query = '?sp=' + spellQueryStr + meansLikeQueryStr + '&md=dr&ipa=1&max=30';

		loading = true;

		const response = await fetch(ENDPOINT + query);
		const data = await response.json();
		candidates = data;

		await tick();

		loading = false;
		showEmptyState = true;
	}

</script>

<svelte:window on:touchstart={()=>{}} />

<div class="container">
    <div class="header">
        <h1 class="header__title">Xr<span class="theme">o</span>ssw<span class="theme">o</span>rd</h1>
    </div>

    <main class="main">
        <LetterBox bind:cursor bind:letters bind:count={letterCount} max="8" on:keydown={onKeyPress} />

        <SearchField bind:value={meansLike} on:input={onSearchFieldInput} on:change={onSearchFieldChange} on:focus={onSearchFieldFocus} />

        <WordList words={candidates} {loading} {showEmptyState} on:click={onClickWord} />
    </main>

    <div class="actions">
        <Keyboard bind:cursor on:input={onLetterBoxInput} />
    </div>
</div>

<Toast bind:show={showToast}>{toastMsg}</Toast>

<DictModal bind:show={showModal} {...dict} />

<style lang="scss">
    @use 'base';
    @include base.reset;

    @mixin width($width: 90%, $max: 520px) {
        width: $width;
        max-width: $max;
        margin: 0 auto;
    }

    :global(body) {
        color: var(--on-surface);
        background: var(--background);
        overflow: hidden;
    }

    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .header {
        position: sticky;
        top: 0;
        width: 100%;
        padding: 0.5em 0;
        background: var(--background);
        z-index: 1;

        &__title {
            font-size: 1.4em;
            margin: 0;
            padding: 0;
            text-align: center;
        }
    }

    .main {
        @include width;
        display: flex;
        flex-direction: column;
        gap: 2em;
        flex: 1;
        padding: 2em 0;
    }

    .actions {
        position: sticky;
        bottom: 0;
        width: 100%;
    }

    .theme {
        color: var(--theme);
    }

</style>