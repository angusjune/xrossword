import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import preprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	function toExit() {
		if (server) server.kill(0);
	}
	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
    input: 'src/main.js',
    output: {
				sourcemap: true,
        file: 'public/build/bundle.js',
        format: 'iife',
    },
    plugins: [
        svelte({
            compilerOptions: {
                dev: !production
            },
            preprocess: preprocess()
        }),
        css({output: 'bundle.css'}),

        resolve({ browser: true, dedupe: ['svelte'] }),
        commonjs(),
        !production && serve(),
        !production && livereload('public'),
        production && terser()
    ]
};