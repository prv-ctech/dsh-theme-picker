window.__ModuleLoader__.load({
	id: 'dsh-theme-picker',
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		const react = require('react');
		const { defineStore } = require('@deepseek-ai/dsh-client-store');

		//#region styles
		const CSS = '.dstp-root{display:flex;flex-direction:column;gap:16px;padding:20px 0 32px}.dstp-title{margin:0;color:var(--dsw-alias-label-primary);font-size:16px;font-weight:600;line-height:24px}.dstp-hint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}.dstp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}.dstp-card{position:relative;display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background-color:var(--dsw-alias-bg-layer-2);cursor:pointer;transition:border-color .1s ease}.dstp-card:hover{border-color:var(--dsw-alias-border-l3)}.dstp-card:has(.dstp-input:checked){border-color:var(--dsw-alias-brand-primary);background-color:var(--dsw-alias-bg-layer-1)}.dstp-card:has(.dstp-input:focus-visible){outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.dstp-input{position:absolute;width:1px;height:1px;margin:0;opacity:0;pointer-events:none}.dstp-swatch{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);flex:0 0 auto;width:34px;height:34px;border:1px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);overflow:hidden}.dstp-chip{display:block;width:100%;height:100%}.dstp-text{display:flex;flex-direction:column;gap:2px;min-width:0}.dstp-name{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:510;line-height:18px;overflow-wrap:anywhere}.dstp-scheme{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}';
		const CSS_TAG = 'dsh-theme-picker/theme-picker.css';
		if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG) + ']') === null) {
			const tag = document.createElement('style');
			tag.dataset.plugin = 'dsh-theme-picker';
			tag.dataset.pluginCss = CSS_TAG;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion

		// #region generated tables — node scripts/build-tables.mjs
		/**
		 * Reference theme tokens (docs/research/*.json, MIT), filtered to the token
		 * names the installed build declares. The base-palette tokens these tables
		 * miss are filled from each palette at load time.
		 */
		const TABLES = {
			"dracula": {
				name: "Dracula",
				colorScheme: "dark",
				tokens: {
					"--dsw-alias-bg-base": "#20212b",
					"--dsw-alias-bg-layer-1": "#282a36",
					"--dsw-alias-bg-layer-2": "#2e3040",
					"--dsw-alias-bg-layer-3": "#44475a",
					"--dsw-alias-bg-mask-1": "rgba(0, 0, 0, 0.45)",
					"--dsw-alias-bg-mask-2": "rgba(0, 0, 0, 0.55)",
					"--dsw-alias-bg-mask-3": "rgba(0, 0, 0, 0.65)",
					"--dsw-alias-bg-mask-drop": "rgba(32, 33, 43, 0.7)",
					"--dsw-alias-bg-mask-photo": "rgba(0, 0, 0, 0.88)",
					"--dsw-alias-bg-module-platform": "#44475a",
					"--dsw-alias-bg-multi-select": "#44475a",
					"--dsw-alias-bg-overlay": "#343746",
					"--dsw-alias-bg-skeleton": "rgba(248, 248, 242, 0.05)",
					"--dsw-alias-border-inverted": "rgba(0, 0, 0, 0.08)",
					"--dsw-alias-border-inverted2": "rgba(0, 0, 0, 0.12)",
					"--dsw-alias-border-l1": "color-mix(in srgb, #6272a4 30%, transparent)",
					"--dsw-alias-border-l2": "color-mix(in srgb, #6272a4 45%, transparent)",
					"--dsw-alias-border-l2-darkmode-thin": "rgba(98, 114, 164, 0.3)",
					"--dsw-alias-border-l3": "color-mix(in srgb, #6272a4 60%, transparent)",
					"--dsw-alias-border-l4": "color-mix(in srgb, #6272a4 75%, transparent)",
					"--dsw-alias-brand-primary": "#bd93f9",
					"--dsw-alias-brand-primary-invert": "#f8f8f2",
					"--dsw-alias-brand-primary-new-colorprimary-new-color": "#bd93f9",
					"--dsw-alias-brand-text": "#8be9fd",
					"--dsw-alias-button-contrast-fill": "#282a36",
					"--dsw-alias-button-elevated-fill": "#2e3040",
					"--dsw-alias-button-floating-fill": "#343746",
					"--dsw-alias-button-floating-hover": "#424450",
					"--dsw-alias-button-ghost-active-border": "#6272a4",
					"--dsw-alias-button-ghost-active-fill": "#2e3040",
					"--dsw-alias-button-ghost-active-hover": "#353747",
					"--dsw-alias-button-info-fill": "#bd93f9",
					"--dsw-alias-button-info-hover": "#5a3e99",
					"--dsw-alias-button-primary-dimmed": "#7a5abf",
					"--dsw-alias-button-primary-fill": "#bd93f9",
					"--dsw-alias-button-primary-hover": "#a97dfa",
					"--dsw-alias-button-tool-bar-fill": "rgba(98, 114, 164, 0.35)",
					"--dsw-alias-button-tool-bar-fill-invisible": "rgba(98, 114, 164, 0.2)",
					"--dsw-alias-button-tool-bar-hover": "rgba(189, 147, 249, 0.35)",
					"--dsw-alias-interactive-bg-active": "rgba(248, 248, 242, 0.14)",
					"--dsw-alias-interactive-bg-hover": "rgba(248, 248, 242, 0.08)",
					"--dsw-alias-interactive-bg-hover-accent": "rgba(189, 147, 249, 0.16)",
					"--dsw-alias-interactive-bg-hover-danger": "rgba(255, 85, 85, 0.14)",
					"--dsw-alias-interactive-bg-hover-solid": "#353747",
					"--dsw-alias-label-caption": "#6272a4",
					"--dsw-alias-label-dimmed": "#7b8fc4",
					"--dsw-alias-label-primary": "#f8f8f2",
					"--dsw-alias-label-primary-bluish": "#f8f8f2",
					"--dsw-alias-label-primary-dimmed": "#9ba9d0",
					"--dsw-alias-label-primary-foreground": "#282a36",
					"--dsw-alias-label-primary-inverted": "#44475a",
					"--dsw-alias-label-secondary": "#bbc4de",
					"--dsw-alias-label-tertiary": "#9ba9d0",
					"--dsw-alias-markdown-citation": "#44475a",
					"--dsw-alias-markdown-code-block": "#2e3040",
					"--dsw-alias-markdown-code-block-banner": "#282a36",
					"--dsw-alias-markdown-code-segment-selected": "#44475a",
					"--dsw-alias-markdown-code-segment-unselected": "#2e3040",
					"--dsw-alias-markdown-inline-code": "#44475a",
					"--dsw-alias-markdown-placeholder": "#7b8fc4",
					"--dsw-alias-markdown-tag": "#bd93f9",
					"--dsw-alias-scrollbar-bg-l1": "rgba(98, 114, 164, 0.4)",
					"--dsw-alias-scrollbar-bg-l2": "rgba(98, 114, 164, 0.4)",
					"--dsw-alias-scrollbar-hover-l1": "rgba(189, 147, 249, 0.6)",
					"--dsw-alias-scrollbar-hover-l2": "rgba(189, 147, 249, 0.6)",
					"--dsw-alias-state-business-primary": "#8be9fd",
					"--dsw-alias-state-business-tertiary": "rgba(139, 233, 253, 0.1)",
					"--dsw-alias-state-error-primary": "#ff5555",
					"--dsw-alias-state-error-secondary": "rgba(255, 85, 85, 0.16)",
					"--dsw-alias-state-success-primary": "#50fa7b",
					"--dsw-alias-state-success-secondary": "rgba(80, 250, 123, 0.16)",
					"--dsw-alias-state-success-tertiary": "rgba(80, 250, 123, 0.1)",
					"--dsw-alias-state-warn-label": "#ffca80",
					"--dsw-alias-state-warn-primary": "#ffb86c",
					"--dsw-alias-state-warn-secondary": "rgba(255, 184, 108, 0.16)",
					"--dsw-alias-state-warn-tertiary": "rgba(255, 184, 108, 0.1)",
					"--dsw-alias-toast-bg": "#2e3040",
					"--dsw-alias-tooltip-bg": "#343746",
					"--dsw-specific-bubble": "#2e3040",
					"--dsw-specific-bubble-highlight": "#353747",
					"--dsw-specific-input-major": "#282a36",
					"--dsw-specific-login-input": "#282a36",
					"--dsw-specific-menu": "#2e3040",
					"--dsw-specific-selector": "#44475a",
					"--dsw-specific-sidebar-fill": "#282a36",
					"--dsw-specific-sidebar-nav-item-active": "#353747",
					"--dsw-specific-sidebar-nav-item-active-accent": "rgba(189, 147, 249, 0.25)",
					"--dsw-specific-sidebar-nav-item-hover": "#2e3040",
					"--dsw-specific-tip": "#2e3040",
					"--dsw-static-amber-100": "#fff0dc",
					"--dsw-static-amber-400": "#ffb86c",
					"--dsw-static-amber-500": "#f2a352",
					"--dsw-static-amber-600": "#d48b43",
					"--dsw-static-amber-900": "#6b4521",
					"--dsw-static-blue-100": "#b0edfc",
					"--dsw-static-blue-300": "#8be9fd",
					"--dsw-static-blue-400": "#6fd8f0",
					"--dsw-static-blue-450": "#58c6e2",
					"--dsw-static-blue-50": "#eafcff",
					"--dsw-static-blue-500": "#41b0cf",
					"--dsw-static-blue-50p": "#d9f8fe",
					"--dsw-static-blue-600": "#2b94b5",
					"--dsw-static-blue-75": "#c6f3fd",
					"--dsw-static-blue-800": "#1c6a86",
					"--dsw-static-blue-900": "#165064",
					"--dsw-static-blue-950": "#103d4d",
					"--dsw-static-deepseek-100": "#e0d2fe",
					"--dsw-static-deepseek-200": "#c8aafd",
					"--dsw-static-deepseek-300": "#b088fc",
					"--dsw-static-deepseek-400": "#8be9fd",
					"--dsw-static-deepseek-450": "#bd93f9",
					"--dsw-static-deepseek-50": "#f0eaff",
					"--dsw-static-deepseek-500": "#a97dfa",
					"--dsw-static-deepseek-600": "#7a5abf",
					"--dsw-static-deepseek-700-delete": "#5a3e99",
					"--dsw-static-deepseek-800": "#44475a",
					"--dsw-static-deepseek-900": "#383a4a",
					"--dsw-static-green-100": "#dcfce6",
					"--dsw-static-green-400": "#50fa7b",
					"--dsw-static-green-500": "#3fdd68",
					"--dsw-static-green-900": "#205c38",
					"--dsw-static-neutral-00": "#f8f8f2",
					"--dsw-static-neutral-100": "#e2e2da",
					"--dsw-static-neutral-1000": "#191a21",
					"--dsw-static-neutral-150": "#d8d8d0",
					"--dsw-static-neutral-200": "#cdcdc5",
					"--dsw-static-neutral-250": "#c2c2ba",
					"--dsw-static-neutral-300": "#b6b6ae",
					"--dsw-static-neutral-400": "#8f8f96",
					"--dsw-static-neutral-50": "#efefe9",
					"--dsw-static-neutral-500": "#6d6d7a",
					"--dsw-static-neutral-550": "#5c5c6b",
					"--dsw-static-neutral-600": "#4d4d5e",
					"--dsw-static-neutral-700": "#3e3e50",
					"--dsw-static-neutral-800": "#30303f",
					"--dsw-static-neutral-850": "#282a36",
					"--dsw-static-neutral-900": "#20212b",
					"--dsw-static-neutral-bluish-00": "#f8f8f2",
					"--dsw-static-neutral-bluish-100": "#e8eaf4",
					"--dsw-static-neutral-bluish-1000": "#1a1b24",
					"--dsw-static-neutral-bluish-150": "#d8ddef",
					"--dsw-static-neutral-bluish-200": "#ccd2e8",
					"--dsw-static-neutral-bluish-300": "#bbc4de",
					"--dsw-static-neutral-bluish-400": "#9ba9d0",
					"--dsw-static-neutral-bluish-50": "#f8f8f2",
					"--dsw-static-neutral-bluish-500": "#7b8fc4",
					"--dsw-static-neutral-bluish-60": "#282a36",
					"--dsw-static-neutral-bluish-600": "#6272a4",
					"--dsw-static-neutral-bluish-700": "#6272a4",
					"--dsw-static-neutral-bluish-75": "#eef0f8",
					"--dsw-static-neutral-bluish-750": "#44475a",
					"--dsw-static-neutral-bluish-800": "#44475a",
					"--dsw-static-neutral-bluish-850": "#2e3040",
					"--dsw-static-neutral-bluish-875": "#282a36",
					"--dsw-static-neutral-bluish-900": "#282a36",
					"--dsw-static-neutral-bluish-950": "#20212b",
					"--dsw-static-red-100": "#ffd9d9",
					"--dsw-static-red-400": "#ff5555",
					"--dsw-static-red-50": "#ffecec",
					"--dsw-static-red-500": "#ec4d4d",
					"--dsw-static-red-600": "#cd4141",
					"--dsw-static-red-900": "#5e2727",
					"--shiki-background": "#282a36",
					"--shiki-foreground": "#f8f8f2",
					"--shiki-token-comment": "#6272a4",
					"--shiki-token-constant": "#ffb86c",
					"--shiki-token-function": "#50fa7b",
					"--shiki-token-keyword": "#ff79c6",
					"--shiki-token-link": "#8be9fd",
					"--shiki-token-parameter": "#f8f8f2",
					"--shiki-token-punctuation": "#f8f8f2",
					"--shiki-token-string": "#f1fa8c",
					"--shiki-token-string-expression": "#f1fa8c",
				},
			},
			"catppuccin-latte": {
				name: "Latte",
				colorScheme: "light",
				tokens: {
					"--dsw-alias-bg-base": "#eff1f5",
					"--dsw-alias-bg-layer-1": "#eff1f5",
					"--dsw-alias-bg-layer-2": "#e6e9ef",
					"--dsw-alias-bg-layer-3": "#ccd0da",
					"--dsw-alias-bg-mask-1": "rgba(220, 224, 232, 0.24)",
					"--dsw-alias-bg-mask-2": "rgba(220, 224, 232, 0.12)",
					"--dsw-alias-bg-mask-3": "rgba(220, 224, 232, 0.48)",
					"--dsw-alias-bg-mask-drop": "rgba(255, 255, 255, 0.7)",
					"--dsw-alias-bg-mask-photo": "rgba(0, 0, 0, 0.88)",
					"--dsw-alias-bg-module-platform": "#e6e9ef",
					"--dsw-alias-bg-multi-select": "#e6e9ef",
					"--dsw-alias-bg-overlay": "#eff1f5",
					"--dsw-alias-bg-skeleton": "rgba(204, 208, 218, 0.04)",
					"--dsw-alias-border-inverted": "rgba(0, 0, 0, 0)",
					"--dsw-alias-border-inverted2": "rgba(0, 0, 0, 0)",
					"--dsw-alias-border-l1": "rgba(156, 160, 176, 0.3)",
					"--dsw-alias-border-l2": "rgba(140, 143, 161, 0.5)",
					"--dsw-alias-border-l2-darkmode-thin": "rgba(140, 143, 161, 0.35)",
					"--dsw-alias-border-l3": "rgba(140, 143, 161, 0.6)",
					"--dsw-alias-border-l4": "rgba(140, 143, 161, 0.75)",
					"--dsw-alias-brand-primary": "#8839ef",
					"--dsw-alias-brand-primary-invert": "#4c4f69",
					"--dsw-alias-brand-primary-new-colorprimary-new-color": "#8839ef",
					"--dsw-alias-brand-text": "#eff1f5",
					"--dsw-alias-button-contrast-fill": "#4c4f69",
					"--dsw-alias-button-elevated-fill": "#eff1f5",
					"--dsw-alias-button-floating-fill": "#eff1f5",
					"--dsw-alias-button-floating-hover": "#e6e9ef",
					"--dsw-alias-button-ghost-active-border": "#bcc0cc",
					"--dsw-alias-button-ghost-active-fill": "#e6e9ef",
					"--dsw-alias-button-ghost-active-hover": "#ccd0da",
					"--dsw-alias-button-info-fill": "#8839ef",
					"--dsw-alias-button-info-hover": "#c6a7f3",
					"--dsw-alias-button-primary-dimmed": "#e6e9ef",
					"--dsw-alias-button-primary-fill": "#8839ef",
					"--dsw-alias-button-primary-hover": "#7287fd",
					"--dsw-alias-button-tool-bar-fill": "rgba(140, 143, 161, 0.5)",
					"--dsw-alias-button-tool-bar-fill-invisible": "rgba(140, 143, 161, 0.36)",
					"--dsw-alias-button-tool-bar-hover": "rgba(124, 127, 147, 0.6)",
					"--dsw-alias-interactive-bg-active": "rgba(188, 192, 204, 0.4)",
					"--dsw-alias-interactive-bg-hover": "rgba(204, 208, 218, 0.3)",
					"--dsw-alias-interactive-bg-hover-accent": "rgba(136, 57, 239, 0.1)",
					"--dsw-alias-interactive-bg-hover-danger": "rgba(210, 15, 57, 0.05)",
					"--dsw-alias-interactive-bg-hover-solid": "#e6e9ef",
					"--dsw-alias-label-caption": "#5c5f77",
					"--dsw-alias-label-dimmed": "#5c5f77",
					"--dsw-alias-label-primary": "#4c4f69",
					"--dsw-alias-label-primary-bluish": "#4c4f69",
					"--dsw-alias-label-primary-dimmed": "#6c6f85",
					"--dsw-alias-label-primary-foreground": "#eff1f5",
					"--dsw-alias-label-primary-inverted": "#eff1f5",
					"--dsw-alias-label-secondary": "#6c6f85",
					"--dsw-alias-label-tertiary": "#5c5f77",
					"--dsw-alias-markdown-citation": "#e6e9ef",
					"--dsw-alias-markdown-code-block": "#e6e9ef",
					"--dsw-alias-markdown-code-block-banner": "#e6e9ef",
					"--dsw-alias-markdown-code-segment-selected": "#eff1f5",
					"--dsw-alias-markdown-code-segment-unselected": "#e6e9ef",
					"--dsw-alias-markdown-inline-code": "#eff1f5",
					"--dsw-alias-markdown-placeholder": "#e6e9ef",
					"--dsw-alias-markdown-tag": "#e6e9ef",
					"--dsw-alias-scrollbar-bg-l1": "#ccd0da",
					"--dsw-alias-scrollbar-bg-l2": "#bcc0cc",
					"--dsw-alias-scrollbar-hover-l1": "#acb0be",
					"--dsw-alias-scrollbar-hover-l2": "#acb0be",
					"--dsw-alias-state-business-primary": "#8839ef",
					"--dsw-alias-state-business-tertiary": "#e6e9ef",
					"--dsw-alias-state-error-primary": "#d20f39",
					"--dsw-alias-state-error-secondary": "#d20f39",
					"--dsw-alias-state-success-primary": "#40a02b",
					"--dsw-alias-state-success-secondary": "#40a02b",
					"--dsw-alias-state-success-tertiary": "#e6e9ef",
					"--dsw-alias-state-warn-label": "#fe640b",
					"--dsw-alias-state-warn-primary": "#fe640b",
					"--dsw-alias-state-warn-secondary": "#fe640b",
					"--dsw-alias-state-warn-tertiary": "#e6e9ef",
					"--dsw-alias-toast-bg": "#ccd0da",
					"--dsw-alias-tooltip-bg": "#bcc0cc",
					"--dsw-specific-bubble": "#e6e9ef",
					"--dsw-specific-bubble-highlight": "#ccd0da",
					"--dsw-specific-input-major": "#eff1f5",
					"--dsw-specific-login-input": "#e6e9ef",
					"--dsw-specific-menu": "#e6e9ef",
					"--dsw-specific-selector": "#ccd0da",
					"--dsw-specific-sidebar-fill": "#e6e9ef",
					"--dsw-specific-sidebar-nav-item-active": "#bcc0cc",
					"--dsw-specific-sidebar-nav-item-active-accent": "rgba(136, 57, 239, 0.2)",
					"--dsw-specific-sidebar-nav-item-hover": "#ccd0da",
					"--dsw-specific-tip": "#e6e9ef",
					"--dsw-static-amber-100": "color-mix(in srgb, #df8e1d 35%, #eff1f5)",
					"--dsw-static-amber-400": "color-mix(in srgb, #df8e1d 88%, #eff1f5)",
					"--dsw-static-amber-500": "#fe640b",
					"--dsw-static-amber-600": "#fe640b",
					"--dsw-static-amber-900": "color-mix(in srgb, #fe640b 40%, #4c4f69)",
					"--dsw-static-blue-100": "color-mix(in srgb, #1e66f5 28%, #eff1f5)",
					"--dsw-static-blue-300": "color-mix(in srgb, #1e66f5 78%, #eff1f5)",
					"--dsw-static-blue-400": "color-mix(in srgb, #1e66f5 88%, #eff1f5)",
					"--dsw-static-blue-450": "#8839ef",
					"--dsw-static-blue-50": "color-mix(in srgb, #1e66f5 60%, #eff1f5)",
					"--dsw-static-blue-500": "#8839ef",
					"--dsw-static-blue-50p": "color-mix(in srgb, #1e66f5 48%, #eff1f5)",
					"--dsw-static-blue-600": "color-mix(in srgb, #1e66f5 70%, #4c4f69)",
					"--dsw-static-blue-75": "color-mix(in srgb, #1e66f5 38%, #eff1f5)",
					"--dsw-static-blue-800": "color-mix(in srgb, #1e66f5 50%, #4c4f69)",
					"--dsw-static-blue-900": "color-mix(in srgb, #1e66f5 35%, #4c4f69)",
					"--dsw-static-blue-950": "color-mix(in srgb, #1e66f5 25%, #4c4f69)",
					"--dsw-static-deepseek-100": "color-mix(in srgb, #8839ef 40%, #eff1f5)",
					"--dsw-static-deepseek-200": "#7287fd",
					"--dsw-static-deepseek-300": "color-mix(in srgb, #8839ef 75%, #eff1f5)",
					"--dsw-static-deepseek-400": "#8839ef",
					"--dsw-static-deepseek-450": "#8839ef",
					"--dsw-static-deepseek-50": "color-mix(in srgb, #8839ef 60%, #eff1f5)",
					"--dsw-static-deepseek-500": "#8839ef",
					"--dsw-static-deepseek-600": "color-mix(in srgb, #8839ef 65%, #4c4f69)",
					"--dsw-static-deepseek-700-delete": "color-mix(in srgb, #8839ef 45%, #4c4f69)",
					"--dsw-static-deepseek-800": "color-mix(in srgb, #8839ef 30%, #4c4f69)",
					"--dsw-static-deepseek-900": "color-mix(in srgb, #8839ef 18%, #4c4f69)",
					"--dsw-static-green-100": "color-mix(in srgb, #40a02b 35%, #eff1f5)",
					"--dsw-static-green-400": "color-mix(in srgb, #40a02b 80%, #eff1f5)",
					"--dsw-static-green-500": "#40a02b",
					"--dsw-static-green-900": "color-mix(in srgb, #40a02b 35%, #4c4f69)",
					"--dsw-static-neutral-00": "#eff1f5",
					"--dsw-static-neutral-100": "#ccd0da",
					"--dsw-static-neutral-1000": "#4c4f69",
					"--dsw-static-neutral-150": "color-mix(in srgb, #ccd0da 50%, #bcc0cc)",
					"--dsw-static-neutral-200": "#bcc0cc",
					"--dsw-static-neutral-250": "color-mix(in srgb, #bcc0cc 50%, #acb0be)",
					"--dsw-static-neutral-300": "#acb0be",
					"--dsw-static-neutral-400": "color-mix(in srgb, #acb0be 50%, #9ca0b0)",
					"--dsw-static-neutral-50": "color-mix(in srgb, #eff1f5 50%, #e6e9ef)",
					"--dsw-static-neutral-500": "#8c8fa1",
					"--dsw-static-neutral-550": "color-mix(in srgb, #8c8fa1 50%, #7c7f93)",
					"--dsw-static-neutral-600": "#7c7f93",
					"--dsw-static-neutral-700": "color-mix(in srgb, #7c7f93 50%, #6c6f85)",
					"--dsw-static-neutral-800": "color-mix(in srgb, #6c6f85 50%, #5c5f77)",
					"--dsw-static-neutral-850": "#5c5f77",
					"--dsw-static-neutral-900": "#4c4f69",
					"--dsw-static-neutral-bluish-00": "#eff1f5",
					"--dsw-static-neutral-bluish-100": "#ccd0da",
					"--dsw-static-neutral-bluish-1000": "#4c4f69",
					"--dsw-static-neutral-bluish-150": "color-mix(in srgb, #ccd0da 50%, #bcc0cc)",
					"--dsw-static-neutral-bluish-200": "#bcc0cc",
					"--dsw-static-neutral-bluish-300": "#acb0be",
					"--dsw-static-neutral-bluish-400": "color-mix(in srgb, #acb0be 50%, #9ca0b0)",
					"--dsw-static-neutral-bluish-50": "color-mix(in srgb, #eff1f5 50%, #e6e9ef)",
					"--dsw-static-neutral-bluish-500": "#8c8fa1",
					"--dsw-static-neutral-bluish-60": "#e6e9ef",
					"--dsw-static-neutral-bluish-600": "#7c7f93",
					"--dsw-static-neutral-bluish-700": "color-mix(in srgb, #7c7f93 50%, #6c6f85)",
					"--dsw-static-neutral-bluish-75": "color-mix(in srgb, #e6e9ef 50%, #ccd0da)",
					"--dsw-static-neutral-bluish-750": "#6c6f85",
					"--dsw-static-neutral-bluish-800": "color-mix(in srgb, #6c6f85 50%, #5c5f77)",
					"--dsw-static-neutral-bluish-850": "#5c5f77",
					"--dsw-static-neutral-bluish-875": "color-mix(in srgb, #5c5f77 50%, #4c4f69)",
					"--dsw-static-neutral-bluish-900": "#4c4f69",
					"--dsw-static-neutral-bluish-950": "#4c4f69",
					"--dsw-static-red-100": "color-mix(in srgb, #d20f39 28%, #eff1f5)",
					"--dsw-static-red-400": "color-mix(in srgb, #d20f39 78%, #eff1f5)",
					"--dsw-static-red-50": "color-mix(in srgb, #d20f39 45%, #eff1f5)",
					"--dsw-static-red-500": "#d20f39",
					"--dsw-static-red-600": "color-mix(in srgb, #d20f39 68%, #4c4f69)",
					"--dsw-static-red-900": "color-mix(in srgb, #d20f39 35%, #4c4f69)",
					"--shiki-background": "#e6e9ef",
					"--shiki-foreground": "#4c4f69",
					"--shiki-token-comment": "#8c8fa1",
					"--shiki-token-constant": "#fe640b",
					"--shiki-token-function": "#1e66f5",
					"--shiki-token-keyword": "#8839ef",
					"--shiki-token-link": "#1e66f5",
					"--shiki-token-parameter": "#e64553",
					"--shiki-token-punctuation": "#5c5f77",
					"--shiki-token-string": "#40a02b",
					"--shiki-token-string-expression": "#40a02b",
				},
			},
			"catppuccin-frappe": {
				name: "Frappé",
				colorScheme: "dark",
				tokens: {
					"--dsw-alias-bg-base": "#303446",
					"--dsw-alias-bg-layer-1": "#292c3c",
					"--dsw-alias-bg-layer-2": "#414559",
					"--dsw-alias-bg-layer-3": "#51576d",
					"--dsw-alias-bg-mask-1": "rgba(35, 38, 52, 0.5)",
					"--dsw-alias-bg-mask-2": "rgba(35, 38, 52, 0.2)",
					"--dsw-alias-bg-mask-3": "rgba(35, 38, 52, 0.48)",
					"--dsw-alias-bg-mask-drop": "rgba(39, 39, 48, 0.7)",
					"--dsw-alias-bg-mask-photo": "rgba(0, 0, 0, 0.88)",
					"--dsw-alias-bg-module-platform": "#414559",
					"--dsw-alias-bg-multi-select": "#414559",
					"--dsw-alias-bg-overlay": "#414559",
					"--dsw-alias-bg-skeleton": "rgba(81, 87, 109, 0.08)",
					"--dsw-alias-border-inverted": "rgba(255, 255, 255, 0.06)",
					"--dsw-alias-border-inverted2": "rgba(255, 255, 255, 0.08)",
					"--dsw-alias-border-l1": "rgba(115, 121, 148, 0.25)",
					"--dsw-alias-border-l2": "rgba(131, 139, 167, 0.45)",
					"--dsw-alias-border-l2-darkmode-thin": "rgba(131, 139, 167, 0.3)",
					"--dsw-alias-border-l3": "rgba(131, 139, 167, 0.55)",
					"--dsw-alias-border-l4": "rgba(131, 139, 167, 0.7)",
					"--dsw-alias-brand-primary": "#ca9ee6",
					"--dsw-alias-brand-primary-invert": "#c6d0f5",
					"--dsw-alias-brand-primary-new-colorprimary-new-color": "#ca9ee6",
					"--dsw-alias-brand-text": "#232634",
					"--dsw-alias-button-contrast-fill": "#c6d0f5",
					"--dsw-alias-button-elevated-fill": "#414559",
					"--dsw-alias-button-floating-fill": "#51576d",
					"--dsw-alias-button-floating-hover": "#626880",
					"--dsw-alias-button-ghost-active-border": "#626880",
					"--dsw-alias-button-ghost-active-fill": "#414559",
					"--dsw-alias-button-ghost-active-hover": "#51576d",
					"--dsw-alias-button-info-fill": "#ca9ee6",
					"--dsw-alias-button-info-hover": "#6e5e86",
					"--dsw-alias-button-primary-dimmed": "#414559",
					"--dsw-alias-button-primary-fill": "#ca9ee6",
					"--dsw-alias-button-primary-hover": "#babbf1",
					"--dsw-alias-button-tool-bar-fill": "rgba(115, 121, 148, 0.5)",
					"--dsw-alias-button-tool-bar-fill-invisible": "rgba(115, 121, 148, 0.36)",
					"--dsw-alias-button-tool-bar-hover": "rgba(131, 139, 167, 0.6)",
					"--dsw-alias-interactive-bg-active": "rgba(81, 87, 109, 0.55)",
					"--dsw-alias-interactive-bg-hover": "rgba(65, 69, 89, 0.45)",
					"--dsw-alias-interactive-bg-hover-accent": "rgba(202, 158, 230, 0.14)",
					"--dsw-alias-interactive-bg-hover-danger": "rgba(231, 130, 132, 0.15)",
					"--dsw-alias-interactive-bg-hover-solid": "#51576d",
					"--dsw-alias-label-caption": "#b5bfe2",
					"--dsw-alias-label-dimmed": "#b5bfe2",
					"--dsw-alias-label-primary": "#c6d0f5",
					"--dsw-alias-label-primary-bluish": "#c6d0f5",
					"--dsw-alias-label-primary-dimmed": "#a5adce",
					"--dsw-alias-label-primary-foreground": "#232634",
					"--dsw-alias-label-primary-inverted": "#414559",
					"--dsw-alias-label-secondary": "#a5adce",
					"--dsw-alias-label-tertiary": "#b5bfe2",
					"--dsw-alias-markdown-citation": "#414559",
					"--dsw-alias-markdown-code-block": "#292c3c",
					"--dsw-alias-markdown-code-block-banner": "#414559",
					"--dsw-alias-markdown-code-segment-selected": "#414559",
					"--dsw-alias-markdown-code-segment-unselected": "#292c3c",
					"--dsw-alias-markdown-inline-code": "#414559",
					"--dsw-alias-markdown-placeholder": "#414559",
					"--dsw-alias-markdown-tag": "#414559",
					"--dsw-alias-scrollbar-bg-l1": "#414559",
					"--dsw-alias-scrollbar-bg-l2": "#51576d",
					"--dsw-alias-scrollbar-hover-l1": "#626880",
					"--dsw-alias-scrollbar-hover-l2": "#626880",
					"--dsw-alias-state-business-primary": "#ca9ee6",
					"--dsw-alias-state-business-tertiary": "#414559",
					"--dsw-alias-state-error-primary": "#e78284",
					"--dsw-alias-state-error-secondary": "#e78284",
					"--dsw-alias-state-success-primary": "#a6d189",
					"--dsw-alias-state-success-secondary": "#a6d189",
					"--dsw-alias-state-success-tertiary": "#414559",
					"--dsw-alias-state-warn-label": "#e5c890",
					"--dsw-alias-state-warn-primary": "#e5c890",
					"--dsw-alias-state-warn-secondary": "#e5c890",
					"--dsw-alias-state-warn-tertiary": "#414559",
					"--dsw-alias-toast-bg": "#292c3c",
					"--dsw-alias-tooltip-bg": "#414559",
					"--dsw-specific-bubble": "#414559",
					"--dsw-specific-bubble-highlight": "#51576d",
					"--dsw-specific-input-major": "#292c3c",
					"--dsw-specific-login-input": "#292c3c",
					"--dsw-specific-menu": "#414559",
					"--dsw-specific-selector": "#51576d",
					"--dsw-specific-sidebar-fill": "#292c3c",
					"--dsw-specific-sidebar-nav-item-active": "#51576d",
					"--dsw-specific-sidebar-nav-item-active-accent": "rgba(202, 158, 230, 0.25)",
					"--dsw-specific-sidebar-nav-item-hover": "#414559",
					"--dsw-specific-tip": "#414559",
					"--dsw-static-amber-100": "color-mix(in srgb, #e5c890 30%, #c6d0f5)",
					"--dsw-static-amber-400": "color-mix(in srgb, #e5c890 85%, #303446)",
					"--dsw-static-amber-500": "#ef9f76",
					"--dsw-static-amber-600": "#ef9f76",
					"--dsw-static-amber-900": "color-mix(in srgb, #ef9f76 40%, #303446)",
					"--dsw-static-blue-100": "color-mix(in srgb, #8caaee 25%, #c6d0f5)",
					"--dsw-static-blue-300": "color-mix(in srgb, #8caaee 75%, #303446)",
					"--dsw-static-blue-400": "color-mix(in srgb, #8caaee 85%, #303446)",
					"--dsw-static-blue-450": "#ca9ee6",
					"--dsw-static-blue-50": "color-mix(in srgb, #8caaee 55%, #c6d0f5)",
					"--dsw-static-blue-500": "#ca9ee6",
					"--dsw-static-blue-50p": "color-mix(in srgb, #8caaee 45%, #c6d0f5)",
					"--dsw-static-blue-600": "color-mix(in srgb, #8caaee 70%, #303446)",
					"--dsw-static-blue-75": "color-mix(in srgb, #8caaee 35%, #c6d0f5)",
					"--dsw-static-blue-800": "color-mix(in srgb, #8caaee 50%, #303446)",
					"--dsw-static-blue-900": "color-mix(in srgb, #8caaee 35%, #303446)",
					"--dsw-static-blue-950": "color-mix(in srgb, #8caaee 25%, #303446)",
					"--dsw-static-deepseek-100": "color-mix(in srgb, #ca9ee6 35%, #c6d0f5)",
					"--dsw-static-deepseek-200": "#babbf1",
					"--dsw-static-deepseek-300": "color-mix(in srgb, #ca9ee6 70%, #303446)",
					"--dsw-static-deepseek-400": "#ca9ee6",
					"--dsw-static-deepseek-450": "#ca9ee6",
					"--dsw-static-deepseek-50": "color-mix(in srgb, #ca9ee6 55%, #c6d0f5)",
					"--dsw-static-deepseek-500": "#ca9ee6",
					"--dsw-static-deepseek-600": "color-mix(in srgb, #ca9ee6 60%, #303446)",
					"--dsw-static-deepseek-700-delete": "color-mix(in srgb, #ca9ee6 45%, #303446)",
					"--dsw-static-deepseek-800": "color-mix(in srgb, #ca9ee6 30%, #303446)",
					"--dsw-static-deepseek-900": "color-mix(in srgb, #ca9ee6 20%, #303446)",
					"--dsw-static-green-100": "color-mix(in srgb, #a6d189 30%, #c6d0f5)",
					"--dsw-static-green-400": "color-mix(in srgb, #a6d189 75%, #303446)",
					"--dsw-static-green-500": "#a6d189",
					"--dsw-static-green-900": "color-mix(in srgb, #a6d189 35%, #303446)",
					"--dsw-static-neutral-00": "#c6d0f5",
					"--dsw-static-neutral-100": "#a5adce",
					"--dsw-static-neutral-1000": "#232634",
					"--dsw-static-neutral-150": "color-mix(in srgb, #a5adce 50%, #949cbb)",
					"--dsw-static-neutral-200": "#949cbb",
					"--dsw-static-neutral-250": "color-mix(in srgb, #949cbb 50%, #838ba7)",
					"--dsw-static-neutral-300": "#838ba7",
					"--dsw-static-neutral-400": "color-mix(in srgb, #838ba7 50%, #737994)",
					"--dsw-static-neutral-50": "color-mix(in srgb, #c6d0f5 50%, #b5bfe2)",
					"--dsw-static-neutral-500": "#626880",
					"--dsw-static-neutral-550": "color-mix(in srgb, #626880 50%, #51576d)",
					"--dsw-static-neutral-600": "#51576d",
					"--dsw-static-neutral-700": "#414559",
					"--dsw-static-neutral-800": "color-mix(in srgb, #414559 25%, #303446)",
					"--dsw-static-neutral-850": "#303446",
					"--dsw-static-neutral-900": "#292c3c",
					"--dsw-static-neutral-bluish-00": "#c6d0f5",
					"--dsw-static-neutral-bluish-100": "#a5adce",
					"--dsw-static-neutral-bluish-1000": "#232634",
					"--dsw-static-neutral-bluish-150": "color-mix(in srgb, #a5adce 50%, #949cbb)",
					"--dsw-static-neutral-bluish-200": "#949cbb",
					"--dsw-static-neutral-bluish-300": "#838ba7",
					"--dsw-static-neutral-bluish-400": "color-mix(in srgb, #838ba7 50%, #737994)",
					"--dsw-static-neutral-bluish-50": "color-mix(in srgb, #c6d0f5 50%, #b5bfe2)",
					"--dsw-static-neutral-bluish-500": "#626880",
					"--dsw-static-neutral-bluish-60": "#b5bfe2",
					"--dsw-static-neutral-bluish-600": "#51576d",
					"--dsw-static-neutral-bluish-700": "#414559",
					"--dsw-static-neutral-bluish-75": "color-mix(in srgb, #b5bfe2 50%, #a5adce)",
					"--dsw-static-neutral-bluish-750": "color-mix(in srgb, #414559 50%, #303446)",
					"--dsw-static-neutral-bluish-800": "color-mix(in srgb, #414559 25%, #303446)",
					"--dsw-static-neutral-bluish-850": "#303446",
					"--dsw-static-neutral-bluish-875": "color-mix(in srgb, #303446 50%, #292c3c)",
					"--dsw-static-neutral-bluish-900": "#292c3c",
					"--dsw-static-neutral-bluish-950": "color-mix(in srgb, #292c3c 50%, #232634)",
					"--dsw-static-red-100": "color-mix(in srgb, #e78284 25%, #c6d0f5)",
					"--dsw-static-red-400": "color-mix(in srgb, #e78284 75%, #303446)",
					"--dsw-static-red-50": "color-mix(in srgb, #e78284 40%, #c6d0f5)",
					"--dsw-static-red-500": "#e78284",
					"--dsw-static-red-600": "color-mix(in srgb, #e78284 65%, #303446)",
					"--dsw-static-red-900": "color-mix(in srgb, #e78284 35%, #303446)",
					"--shiki-background": "#292c3c",
					"--shiki-foreground": "#c6d0f5",
					"--shiki-token-comment": "#949cbb",
					"--shiki-token-constant": "#ef9f76",
					"--shiki-token-function": "#8caaee",
					"--shiki-token-keyword": "#ca9ee6",
					"--shiki-token-link": "#8caaee",
					"--shiki-token-parameter": "#ea999c",
					"--shiki-token-punctuation": "#a5adce",
					"--shiki-token-string": "#a6d189",
					"--shiki-token-string-expression": "#a6d189",
				},
			},
			"catppuccin-macchiato": {
				name: "Macchiato",
				colorScheme: "dark",
				tokens: {
					"--dsw-alias-bg-base": "#24273a",
					"--dsw-alias-bg-layer-1": "#1e2030",
					"--dsw-alias-bg-layer-2": "#363a4f",
					"--dsw-alias-bg-layer-3": "#494d64",
					"--dsw-alias-bg-mask-1": "rgba(24, 25, 38, 0.5)",
					"--dsw-alias-bg-mask-2": "rgba(24, 25, 38, 0.2)",
					"--dsw-alias-bg-mask-3": "rgba(24, 25, 38, 0.48)",
					"--dsw-alias-bg-mask-drop": "rgba(39, 39, 48, 0.7)",
					"--dsw-alias-bg-mask-photo": "rgba(0, 0, 0, 0.88)",
					"--dsw-alias-bg-module-platform": "#363a4f",
					"--dsw-alias-bg-multi-select": "#363a4f",
					"--dsw-alias-bg-overlay": "#363a4f",
					"--dsw-alias-bg-skeleton": "rgba(73, 77, 100, 0.08)",
					"--dsw-alias-border-inverted": "rgba(255, 255, 255, 0.06)",
					"--dsw-alias-border-inverted2": "rgba(255, 255, 255, 0.08)",
					"--dsw-alias-border-l1": "rgba(110, 115, 141, 0.25)",
					"--dsw-alias-border-l2": "rgba(128, 135, 162, 0.45)",
					"--dsw-alias-border-l2-darkmode-thin": "rgba(128, 135, 162, 0.3)",
					"--dsw-alias-border-l3": "rgba(128, 135, 162, 0.55)",
					"--dsw-alias-border-l4": "rgba(128, 135, 162, 0.7)",
					"--dsw-alias-brand-primary": "#c6a0f6",
					"--dsw-alias-brand-primary-invert": "#cad3f5",
					"--dsw-alias-brand-primary-new-colorprimary-new-color": "#c6a0f6",
					"--dsw-alias-brand-text": "#181926",
					"--dsw-alias-button-contrast-fill": "#cad3f5",
					"--dsw-alias-button-elevated-fill": "#363a4f",
					"--dsw-alias-button-floating-fill": "#494d64",
					"--dsw-alias-button-floating-hover": "#5b6078",
					"--dsw-alias-button-ghost-active-border": "#5b6078",
					"--dsw-alias-button-ghost-active-fill": "#363a4f",
					"--dsw-alias-button-ghost-active-hover": "#494d64",
					"--dsw-alias-button-info-fill": "#c6a0f6",
					"--dsw-alias-button-info-hover": "#655785",
					"--dsw-alias-button-primary-dimmed": "#363a4f",
					"--dsw-alias-button-primary-fill": "#c6a0f6",
					"--dsw-alias-button-primary-hover": "#b7bdf8",
					"--dsw-alias-button-tool-bar-fill": "rgba(110, 115, 141, 0.5)",
					"--dsw-alias-button-tool-bar-fill-invisible": "rgba(110, 115, 141, 0.36)",
					"--dsw-alias-button-tool-bar-hover": "rgba(128, 135, 162, 0.6)",
					"--dsw-alias-interactive-bg-active": "rgba(73, 77, 100, 0.55)",
					"--dsw-alias-interactive-bg-hover": "rgba(54, 58, 79, 0.45)",
					"--dsw-alias-interactive-bg-hover-accent": "rgba(198, 160, 246, 0.14)",
					"--dsw-alias-interactive-bg-hover-danger": "rgba(237, 135, 150, 0.15)",
					"--dsw-alias-interactive-bg-hover-solid": "#494d64",
					"--dsw-alias-label-caption": "#b8c0e0",
					"--dsw-alias-label-dimmed": "#b8c0e0",
					"--dsw-alias-label-primary": "#cad3f5",
					"--dsw-alias-label-primary-bluish": "#cad3f5",
					"--dsw-alias-label-primary-dimmed": "#a5adcb",
					"--dsw-alias-label-primary-foreground": "#181926",
					"--dsw-alias-label-primary-inverted": "#363a4f",
					"--dsw-alias-label-secondary": "#a5adcb",
					"--dsw-alias-label-tertiary": "#b8c0e0",
					"--dsw-alias-markdown-citation": "#363a4f",
					"--dsw-alias-markdown-code-block": "#1e2030",
					"--dsw-alias-markdown-code-block-banner": "#363a4f",
					"--dsw-alias-markdown-code-segment-selected": "#363a4f",
					"--dsw-alias-markdown-code-segment-unselected": "#1e2030",
					"--dsw-alias-markdown-inline-code": "#363a4f",
					"--dsw-alias-markdown-placeholder": "#363a4f",
					"--dsw-alias-markdown-tag": "#363a4f",
					"--dsw-alias-scrollbar-bg-l1": "#363a4f",
					"--dsw-alias-scrollbar-bg-l2": "#494d64",
					"--dsw-alias-scrollbar-hover-l1": "#5b6078",
					"--dsw-alias-scrollbar-hover-l2": "#5b6078",
					"--dsw-alias-state-business-primary": "#c6a0f6",
					"--dsw-alias-state-business-tertiary": "#363a4f",
					"--dsw-alias-state-error-primary": "#ed8796",
					"--dsw-alias-state-error-secondary": "#ed8796",
					"--dsw-alias-state-success-primary": "#a6da95",
					"--dsw-alias-state-success-secondary": "#a6da95",
					"--dsw-alias-state-success-tertiary": "#363a4f",
					"--dsw-alias-state-warn-label": "#eed49f",
					"--dsw-alias-state-warn-primary": "#eed49f",
					"--dsw-alias-state-warn-secondary": "#eed49f",
					"--dsw-alias-state-warn-tertiary": "#363a4f",
					"--dsw-alias-toast-bg": "#1e2030",
					"--dsw-alias-tooltip-bg": "#363a4f",
					"--dsw-specific-bubble": "#363a4f",
					"--dsw-specific-bubble-highlight": "#494d64",
					"--dsw-specific-input-major": "#1e2030",
					"--dsw-specific-login-input": "#1e2030",
					"--dsw-specific-menu": "#363a4f",
					"--dsw-specific-selector": "#494d64",
					"--dsw-specific-sidebar-fill": "#1e2030",
					"--dsw-specific-sidebar-nav-item-active": "#494d64",
					"--dsw-specific-sidebar-nav-item-active-accent": "rgba(198, 160, 246, 0.25)",
					"--dsw-specific-sidebar-nav-item-hover": "#363a4f",
					"--dsw-specific-tip": "#363a4f",
					"--dsw-static-amber-100": "color-mix(in srgb, #eed49f 30%, #cad3f5)",
					"--dsw-static-amber-400": "color-mix(in srgb, #eed49f 85%, #24273a)",
					"--dsw-static-amber-500": "#f5a97f",
					"--dsw-static-amber-600": "#f5a97f",
					"--dsw-static-amber-900": "color-mix(in srgb, #f5a97f 40%, #24273a)",
					"--dsw-static-blue-100": "color-mix(in srgb, #8aadf4 25%, #cad3f5)",
					"--dsw-static-blue-300": "color-mix(in srgb, #8aadf4 75%, #24273a)",
					"--dsw-static-blue-400": "color-mix(in srgb, #8aadf4 85%, #24273a)",
					"--dsw-static-blue-450": "#c6a0f6",
					"--dsw-static-blue-50": "color-mix(in srgb, #8aadf4 55%, #cad3f5)",
					"--dsw-static-blue-500": "#c6a0f6",
					"--dsw-static-blue-50p": "color-mix(in srgb, #8aadf4 45%, #cad3f5)",
					"--dsw-static-blue-600": "color-mix(in srgb, #8aadf4 70%, #24273a)",
					"--dsw-static-blue-75": "color-mix(in srgb, #8aadf4 35%, #cad3f5)",
					"--dsw-static-blue-800": "color-mix(in srgb, #8aadf4 50%, #24273a)",
					"--dsw-static-blue-900": "color-mix(in srgb, #8aadf4 35%, #24273a)",
					"--dsw-static-blue-950": "color-mix(in srgb, #8aadf4 25%, #24273a)",
					"--dsw-static-deepseek-100": "color-mix(in srgb, #c6a0f6 35%, #cad3f5)",
					"--dsw-static-deepseek-200": "#b7bdf8",
					"--dsw-static-deepseek-300": "color-mix(in srgb, #c6a0f6 70%, #24273a)",
					"--dsw-static-deepseek-400": "#c6a0f6",
					"--dsw-static-deepseek-450": "#c6a0f6",
					"--dsw-static-deepseek-50": "color-mix(in srgb, #c6a0f6 55%, #cad3f5)",
					"--dsw-static-deepseek-500": "#c6a0f6",
					"--dsw-static-deepseek-600": "color-mix(in srgb, #c6a0f6 60%, #24273a)",
					"--dsw-static-deepseek-700-delete": "color-mix(in srgb, #c6a0f6 45%, #24273a)",
					"--dsw-static-deepseek-800": "color-mix(in srgb, #c6a0f6 30%, #24273a)",
					"--dsw-static-deepseek-900": "color-mix(in srgb, #c6a0f6 20%, #24273a)",
					"--dsw-static-green-100": "color-mix(in srgb, #a6da95 30%, #cad3f5)",
					"--dsw-static-green-400": "color-mix(in srgb, #a6da95 75%, #24273a)",
					"--dsw-static-green-500": "#a6da95",
					"--dsw-static-green-900": "color-mix(in srgb, #a6da95 35%, #24273a)",
					"--dsw-static-neutral-00": "#cad3f5",
					"--dsw-static-neutral-100": "#a5adcb",
					"--dsw-static-neutral-1000": "#181926",
					"--dsw-static-neutral-150": "color-mix(in srgb, #a5adcb 50%, #939ab7)",
					"--dsw-static-neutral-200": "#939ab7",
					"--dsw-static-neutral-250": "color-mix(in srgb, #939ab7 50%, #8087a2)",
					"--dsw-static-neutral-300": "#8087a2",
					"--dsw-static-neutral-400": "color-mix(in srgb, #8087a2 50%, #6e738d)",
					"--dsw-static-neutral-50": "color-mix(in srgb, #cad3f5 50%, #b8c0e0)",
					"--dsw-static-neutral-500": "#5b6078",
					"--dsw-static-neutral-550": "color-mix(in srgb, #5b6078 50%, #494d64)",
					"--dsw-static-neutral-600": "#494d64",
					"--dsw-static-neutral-700": "#363a4f",
					"--dsw-static-neutral-800": "color-mix(in srgb, #363a4f 25%, #24273a)",
					"--dsw-static-neutral-850": "#24273a",
					"--dsw-static-neutral-900": "#1e2030",
					"--dsw-static-neutral-bluish-00": "#cad3f5",
					"--dsw-static-neutral-bluish-100": "#a5adcb",
					"--dsw-static-neutral-bluish-1000": "#181926",
					"--dsw-static-neutral-bluish-150": "color-mix(in srgb, #a5adcb 50%, #939ab7)",
					"--dsw-static-neutral-bluish-200": "#939ab7",
					"--dsw-static-neutral-bluish-300": "#8087a2",
					"--dsw-static-neutral-bluish-400": "color-mix(in srgb, #8087a2 50%, #6e738d)",
					"--dsw-static-neutral-bluish-50": "color-mix(in srgb, #cad3f5 50%, #b8c0e0)",
					"--dsw-static-neutral-bluish-500": "#5b6078",
					"--dsw-static-neutral-bluish-60": "#b8c0e0",
					"--dsw-static-neutral-bluish-600": "#494d64",
					"--dsw-static-neutral-bluish-700": "#363a4f",
					"--dsw-static-neutral-bluish-75": "color-mix(in srgb, #b8c0e0 50%, #a5adcb)",
					"--dsw-static-neutral-bluish-750": "color-mix(in srgb, #363a4f 50%, #24273a)",
					"--dsw-static-neutral-bluish-800": "color-mix(in srgb, #363a4f 25%, #24273a)",
					"--dsw-static-neutral-bluish-850": "#24273a",
					"--dsw-static-neutral-bluish-875": "color-mix(in srgb, #24273a 50%, #1e2030)",
					"--dsw-static-neutral-bluish-900": "#1e2030",
					"--dsw-static-neutral-bluish-950": "color-mix(in srgb, #1e2030 50%, #181926)",
					"--dsw-static-red-100": "color-mix(in srgb, #ed8796 25%, #cad3f5)",
					"--dsw-static-red-400": "color-mix(in srgb, #ed8796 75%, #24273a)",
					"--dsw-static-red-50": "color-mix(in srgb, #ed8796 40%, #cad3f5)",
					"--dsw-static-red-500": "#ed8796",
					"--dsw-static-red-600": "color-mix(in srgb, #ed8796 65%, #24273a)",
					"--dsw-static-red-900": "color-mix(in srgb, #ed8796 35%, #24273a)",
					"--shiki-background": "#1e2030",
					"--shiki-foreground": "#cad3f5",
					"--shiki-token-comment": "#939ab7",
					"--shiki-token-constant": "#f5a97f",
					"--shiki-token-function": "#8aadf4",
					"--shiki-token-keyword": "#c6a0f6",
					"--shiki-token-link": "#8aadf4",
					"--shiki-token-parameter": "#ee99a0",
					"--shiki-token-punctuation": "#a5adcb",
					"--shiki-token-string": "#a6da95",
					"--shiki-token-string-expression": "#a6da95",
				},
			},
			"catppuccin-mocha": {
				name: "Mocha",
				colorScheme: "dark",
				tokens: {
					"--dsw-alias-bg-base": "#1e1e2e",
					"--dsw-alias-bg-layer-1": "#181825",
					"--dsw-alias-bg-layer-2": "#313244",
					"--dsw-alias-bg-layer-3": "#45475a",
					"--dsw-alias-bg-mask-1": "rgba(17, 17, 27, 0.5)",
					"--dsw-alias-bg-mask-2": "rgba(17, 17, 27, 0.2)",
					"--dsw-alias-bg-mask-3": "rgba(17, 17, 27, 0.48)",
					"--dsw-alias-bg-mask-drop": "rgba(39, 39, 48, 0.7)",
					"--dsw-alias-bg-mask-photo": "rgba(0, 0, 0, 0.88)",
					"--dsw-alias-bg-module-platform": "#313244",
					"--dsw-alias-bg-multi-select": "#313244",
					"--dsw-alias-bg-overlay": "#313244",
					"--dsw-alias-bg-skeleton": "rgba(69, 71, 90, 0.08)",
					"--dsw-alias-border-inverted": "rgba(255, 255, 255, 0.06)",
					"--dsw-alias-border-inverted2": "rgba(255, 255, 255, 0.08)",
					"--dsw-alias-border-l1": "rgba(108, 112, 134, 0.25)",
					"--dsw-alias-border-l2": "rgba(127, 132, 156, 0.45)",
					"--dsw-alias-border-l2-darkmode-thin": "rgba(127, 132, 156, 0.3)",
					"--dsw-alias-border-l3": "rgba(127, 132, 156, 0.55)",
					"--dsw-alias-border-l4": "rgba(127, 132, 156, 0.7)",
					"--dsw-alias-brand-primary": "#cba6f7",
					"--dsw-alias-brand-primary-invert": "#cdd6f4",
					"--dsw-alias-brand-primary-new-colorprimary-new-color": "#cba6f7",
					"--dsw-alias-brand-text": "#11111b",
					"--dsw-alias-button-contrast-fill": "#cdd6f4",
					"--dsw-alias-button-elevated-fill": "#313244",
					"--dsw-alias-button-floating-fill": "#45475a",
					"--dsw-alias-button-floating-hover": "#585b70",
					"--dsw-alias-button-ghost-active-border": "#585b70",
					"--dsw-alias-button-ghost-active-fill": "#313244",
					"--dsw-alias-button-ghost-active-hover": "#45475a",
					"--dsw-alias-button-info-fill": "#cba6f7",
					"--dsw-alias-button-info-hover": "#63547e",
					"--dsw-alias-button-primary-dimmed": "#313244",
					"--dsw-alias-button-primary-fill": "#cba6f7",
					"--dsw-alias-button-primary-hover": "#b4befe",
					"--dsw-alias-button-tool-bar-fill": "rgba(108, 112, 134, 0.5)",
					"--dsw-alias-button-tool-bar-fill-invisible": "rgba(108, 112, 134, 0.36)",
					"--dsw-alias-button-tool-bar-hover": "rgba(127, 132, 156, 0.6)",
					"--dsw-alias-interactive-bg-active": "rgba(69, 71, 90, 0.55)",
					"--dsw-alias-interactive-bg-hover": "rgba(49, 50, 68, 0.45)",
					"--dsw-alias-interactive-bg-hover-accent": "rgba(203, 166, 247, 0.14)",
					"--dsw-alias-interactive-bg-hover-danger": "rgba(243, 139, 168, 0.15)",
					"--dsw-alias-interactive-bg-hover-solid": "#45475a",
					"--dsw-alias-label-caption": "#bac2de",
					"--dsw-alias-label-dimmed": "#bac2de",
					"--dsw-alias-label-primary": "#cdd6f4",
					"--dsw-alias-label-primary-bluish": "#cdd6f4",
					"--dsw-alias-label-primary-dimmed": "#a6adc8",
					"--dsw-alias-label-primary-foreground": "#11111b",
					"--dsw-alias-label-primary-inverted": "#313244",
					"--dsw-alias-label-secondary": "#a6adc8",
					"--dsw-alias-label-tertiary": "#bac2de",
					"--dsw-alias-markdown-citation": "#313244",
					"--dsw-alias-markdown-code-block": "#181825",
					"--dsw-alias-markdown-code-block-banner": "#313244",
					"--dsw-alias-markdown-code-segment-selected": "#313244",
					"--dsw-alias-markdown-code-segment-unselected": "#181825",
					"--dsw-alias-markdown-inline-code": "#313244",
					"--dsw-alias-markdown-placeholder": "#313244",
					"--dsw-alias-markdown-tag": "#313244",
					"--dsw-alias-scrollbar-bg-l1": "#313244",
					"--dsw-alias-scrollbar-bg-l2": "#45475a",
					"--dsw-alias-scrollbar-hover-l1": "#585b70",
					"--dsw-alias-scrollbar-hover-l2": "#585b70",
					"--dsw-alias-state-business-primary": "#cba6f7",
					"--dsw-alias-state-business-tertiary": "#313244",
					"--dsw-alias-state-error-primary": "#f38ba8",
					"--dsw-alias-state-error-secondary": "#f38ba8",
					"--dsw-alias-state-success-primary": "#a6e3a1",
					"--dsw-alias-state-success-secondary": "#a6e3a1",
					"--dsw-alias-state-success-tertiary": "#313244",
					"--dsw-alias-state-warn-label": "#f9e2af",
					"--dsw-alias-state-warn-primary": "#f9e2af",
					"--dsw-alias-state-warn-secondary": "#f9e2af",
					"--dsw-alias-state-warn-tertiary": "#313244",
					"--dsw-alias-toast-bg": "#181825",
					"--dsw-alias-tooltip-bg": "#313244",
					"--dsw-specific-bubble": "#313244",
					"--dsw-specific-bubble-highlight": "#45475a",
					"--dsw-specific-input-major": "#181825",
					"--dsw-specific-login-input": "#181825",
					"--dsw-specific-menu": "#313244",
					"--dsw-specific-selector": "#45475a",
					"--dsw-specific-sidebar-fill": "#181825",
					"--dsw-specific-sidebar-nav-item-active": "#45475a",
					"--dsw-specific-sidebar-nav-item-active-accent": "rgba(203, 166, 247, 0.25)",
					"--dsw-specific-sidebar-nav-item-hover": "#313244",
					"--dsw-specific-tip": "#313244",
					"--dsw-static-amber-100": "color-mix(in srgb, #f9e2af 30%, #cdd6f4)",
					"--dsw-static-amber-400": "color-mix(in srgb, #f9e2af 85%, #1e1e2e)",
					"--dsw-static-amber-500": "#fab387",
					"--dsw-static-amber-600": "#fab387",
					"--dsw-static-amber-900": "color-mix(in srgb, #fab387 40%, #1e1e2e)",
					"--dsw-static-blue-100": "color-mix(in srgb, #89b4fa 25%, #cdd6f4)",
					"--dsw-static-blue-300": "color-mix(in srgb, #89b4fa 75%, #1e1e2e)",
					"--dsw-static-blue-400": "color-mix(in srgb, #89b4fa 85%, #1e1e2e)",
					"--dsw-static-blue-450": "#cba6f7",
					"--dsw-static-blue-50": "color-mix(in srgb, #89b4fa 55%, #cdd6f4)",
					"--dsw-static-blue-500": "#cba6f7",
					"--dsw-static-blue-50p": "color-mix(in srgb, #89b4fa 45%, #cdd6f4)",
					"--dsw-static-blue-600": "color-mix(in srgb, #89b4fa 70%, #1e1e2e)",
					"--dsw-static-blue-75": "color-mix(in srgb, #89b4fa 35%, #cdd6f4)",
					"--dsw-static-blue-800": "color-mix(in srgb, #89b4fa 50%, #1e1e2e)",
					"--dsw-static-blue-900": "color-mix(in srgb, #89b4fa 35%, #1e1e2e)",
					"--dsw-static-blue-950": "color-mix(in srgb, #89b4fa 25%, #1e1e2e)",
					"--dsw-static-deepseek-100": "color-mix(in srgb, #cba6f7 35%, #cdd6f4)",
					"--dsw-static-deepseek-200": "#b4befe",
					"--dsw-static-deepseek-300": "color-mix(in srgb, #cba6f7 70%, #1e1e2e)",
					"--dsw-static-deepseek-400": "#cba6f7",
					"--dsw-static-deepseek-450": "#cba6f7",
					"--dsw-static-deepseek-50": "color-mix(in srgb, #cba6f7 55%, #cdd6f4)",
					"--dsw-static-deepseek-500": "#cba6f7",
					"--dsw-static-deepseek-600": "color-mix(in srgb, #cba6f7 60%, #1e1e2e)",
					"--dsw-static-deepseek-700-delete": "color-mix(in srgb, #cba6f7 45%, #1e1e2e)",
					"--dsw-static-deepseek-800": "color-mix(in srgb, #cba6f7 30%, #1e1e2e)",
					"--dsw-static-deepseek-900": "color-mix(in srgb, #cba6f7 20%, #1e1e2e)",
					"--dsw-static-green-100": "color-mix(in srgb, #a6e3a1 30%, #cdd6f4)",
					"--dsw-static-green-400": "color-mix(in srgb, #a6e3a1 75%, #1e1e2e)",
					"--dsw-static-green-500": "#a6e3a1",
					"--dsw-static-green-900": "color-mix(in srgb, #a6e3a1 35%, #1e1e2e)",
					"--dsw-static-neutral-00": "#cdd6f4",
					"--dsw-static-neutral-100": "#a6adc8",
					"--dsw-static-neutral-1000": "#11111b",
					"--dsw-static-neutral-150": "color-mix(in srgb, #a6adc8 50%, #9399b2)",
					"--dsw-static-neutral-200": "#9399b2",
					"--dsw-static-neutral-250": "color-mix(in srgb, #9399b2 50%, #7f849c)",
					"--dsw-static-neutral-300": "#7f849c",
					"--dsw-static-neutral-400": "color-mix(in srgb, #7f849c 50%, #6c7086)",
					"--dsw-static-neutral-50": "color-mix(in srgb, #cdd6f4 50%, #bac2de)",
					"--dsw-static-neutral-500": "#585b70",
					"--dsw-static-neutral-550": "color-mix(in srgb, #585b70 50%, #45475a)",
					"--dsw-static-neutral-600": "#45475a",
					"--dsw-static-neutral-700": "#313244",
					"--dsw-static-neutral-800": "color-mix(in srgb, #313244 25%, #1e1e2e)",
					"--dsw-static-neutral-850": "#1e1e2e",
					"--dsw-static-neutral-900": "#181825",
					"--dsw-static-neutral-bluish-00": "#cdd6f4",
					"--dsw-static-neutral-bluish-100": "#a6adc8",
					"--dsw-static-neutral-bluish-1000": "#11111b",
					"--dsw-static-neutral-bluish-150": "color-mix(in srgb, #a6adc8 50%, #9399b2)",
					"--dsw-static-neutral-bluish-200": "#9399b2",
					"--dsw-static-neutral-bluish-300": "#7f849c",
					"--dsw-static-neutral-bluish-400": "color-mix(in srgb, #7f849c 50%, #6c7086)",
					"--dsw-static-neutral-bluish-50": "color-mix(in srgb, #cdd6f4 50%, #bac2de)",
					"--dsw-static-neutral-bluish-500": "#585b70",
					"--dsw-static-neutral-bluish-60": "#bac2de",
					"--dsw-static-neutral-bluish-600": "#45475a",
					"--dsw-static-neutral-bluish-700": "#313244",
					"--dsw-static-neutral-bluish-75": "color-mix(in srgb, #bac2de 50%, #a6adc8)",
					"--dsw-static-neutral-bluish-750": "color-mix(in srgb, #313244 50%, #1e1e2e)",
					"--dsw-static-neutral-bluish-800": "color-mix(in srgb, #313244 25%, #1e1e2e)",
					"--dsw-static-neutral-bluish-850": "#1e1e2e",
					"--dsw-static-neutral-bluish-875": "color-mix(in srgb, #1e1e2e 50%, #181825)",
					"--dsw-static-neutral-bluish-900": "#181825",
					"--dsw-static-neutral-bluish-950": "color-mix(in srgb, #181825 50%, #11111b)",
					"--dsw-static-red-100": "color-mix(in srgb, #f38ba8 25%, #cdd6f4)",
					"--dsw-static-red-400": "color-mix(in srgb, #f38ba8 75%, #1e1e2e)",
					"--dsw-static-red-50": "color-mix(in srgb, #f38ba8 40%, #cdd6f4)",
					"--dsw-static-red-500": "#f38ba8",
					"--dsw-static-red-600": "color-mix(in srgb, #f38ba8 65%, #1e1e2e)",
					"--dsw-static-red-900": "color-mix(in srgb, #f38ba8 35%, #1e1e2e)",
					"--shiki-background": "#181825",
					"--shiki-foreground": "#cdd6f4",
					"--shiki-token-comment": "#9399b2",
					"--shiki-token-constant": "#fab387",
					"--shiki-token-function": "#89b4fa",
					"--shiki-token-keyword": "#cba6f7",
					"--shiki-token-link": "#89b4fa",
					"--shiki-token-parameter": "#eba0ac",
					"--shiki-token-punctuation": "#a6adc8",
					"--shiki-token-string": "#a6e3a1",
					"--shiki-token-string-expression": "#a6e3a1",
				},
			},
		}
		// #endregion generated tables

		//#region catalog
		/**
		 * Fill the base-palette tokens the reference tables miss, from the palette
		 * each table already carries. The base stylesheet expresses these as
		 * `var()` chains into its own ramps; a registered theme has one color
		 * scheme, so each token gets that scheme's concrete value here.
		 * @param table - the theme's reference tokens.
		 * @param scheme - the theme's color scheme.
		 * @returns the filled tokens.
		 */
		function fills(table, scheme) {
			const light = scheme === 'light';
			const green = table['--dsw-static-green-500'];
			const red = table['--dsw-static-red-500'];
			const bg = table['--dsw-alias-bg-base'];
			const mix = (color, percent, other) => `color-mix(in srgb, ${color} ${percent}%, ${other})`;
			const alpha = (color, percent) => mix(color, percent, 'transparent');
			const greenA08 = alpha(green, 8);
			const greenA12 = alpha(green, 12);
			const redA08 = alpha(red, 8);
			const redA12 = alpha(red, 12);
			return {
				'--dsw-static-green-500-a08': greenA08,
				'--dsw-static-green-500-a12': greenA12,
				'--dsw-static-red-400-a12': redA12,
				'--dsw-static-red-600-a08': redA08,
				'--dsw-alias-bg-document-preview': light ? table['--dsw-static-neutral-bluish-100'] : table['--dsw-static-neutral-bluish-950'],
				'--dsw-alias-label-document-preview': light ? table['--dsw-static-neutral-bluish-700'] : table['--dsw-static-neutral-bluish-300'],
				'--dsw-alias-menu-icon': light ? table['--dsw-static-neutral-bluish-800'] : table['--dsw-alias-label-primary-dimmed'],
				'--dsw-alias-link': light ? table['--dsw-static-deepseek-500'] : table['--dsw-static-deepseek-400'],
				'--dsw-alias-code-diff-added': light ? greenA08 : greenA12,
				'--dsw-alias-code-diff-deleted': light ? redA08 : redA12,
				'--dsw-alias-file-diff-added-bg': mix(green, light ? 12 : 15, bg),
				'--dsw-alias-file-diff-added-gutter': mix(green, light ? 6 : 7, bg),
				'--dsw-alias-file-diff-added-marker': light ? mix(green, 84, 'black') : table['--dsw-static-green-400'],
				'--dsw-alias-file-diff-deleted-bg': mix(red, light ? 12 : 15, bg),
				'--dsw-alias-file-diff-deleted-gutter': mix(red, light ? 6 : 7, bg),
				'--dsw-alias-file-diff-deleted-marker': light ? mix(red, 84, 'black') : table['--dsw-static-red-400'],
				'--dsw-alias-state-idle-primary': light ? table['--dsw-static-neutral-300'] : table['--dsw-static-neutral-600'],
				'--dsw-alias-toast-label': table['--dsw-static-neutral-bluish-00'],
				'--dsw-alias-tooltip-key-bg': mix(table['--dsw-alias-tooltip-bg'], 82, 'white'),
				'--dsw-menu-surface-fill': alpha(table['--dsw-specific-menu'], light ? 58 : 45),
				'--dsw-alias-onboarding-accent': table['--dsw-alias-brand-primary'],
				'--dsw-alias-onboarding-card-fill': alpha(light ? table['--dsw-static-neutral-bluish-00'] : table['--dsw-alias-bg-layer-2'], 80),
				'--dsw-alias-onboarding-checkbox-border': light ? alpha(table['--dsw-static-neutral-bluish-1000'], 20) : table['--dsw-alias-border-l2'],
				'--dsw-alias-onboarding-secondary-fill': light ? table['--dsw-static-neutral-bluish-00'] : table['--dsw-static-neutral-bluish-750'],
				'--dsw-alias-settings-card-fill': table['--dsw-alias-bg-layer-2'],
				'--dsw-alias-settings-card-stroke': table['--dsw-alias-border-l4'],
			};
		}

		/** Theme catalog: namespaced ids, display name, scheme, boot color, tokens. */
		const SKINS = Object.keys(TABLES).map((key) => {
			const table = TABLES[key];
			const tokens = { ...table.tokens, ...fills(table.tokens, table.colorScheme) };
			return {
				id: `theme-picker/${key}`,
				name: table.name,
				colorScheme: table.colorScheme,
				/** Pre-plugin boot background (the host paints it before first paint). */
				background: table.tokens['--dsw-alias-bg-base'],
				tokens,
				/** Card swatch: surface, accent, raised surface, text. */
				swatch: [
					tokens['--dsw-alias-bg-base'],
					tokens['--dsw-alias-brand-primary'],
					tokens['--dsw-alias-bg-layer-2'],
					tokens['--dsw-alias-label-primary'],
				],
			};
		});
		const SKIN_BY_ID = new Map(SKINS.map((skin) => [skin.id, skin]));
		/** The Default card selects the durable built-in preference instead. */
		const DEFAULT_ID = 'default';
		const BUILTIN_IDS = ['light', 'dark', 'system'];
		/** Default-card swatch, from the base palette of each built-in scheme. */
		const DEFAULT_SWATCH = {
			light: ['#ffffff', '#4176e6', '#ebeef2', '#0f1115'],
			dark: ['#151517', '#7aaaff', '#2c2c2e', '#f9fafb'],
		};
		//#endregion

		//#region state
		/** Durable selection route served by the host half. */
		const STATE_PATH = '/theme-picker/state';
		/** Instant layer; the state file covers fresh browsers and port churn. */
		const STORAGE_KEY = 'dsh-theme-picker/selection';
		const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
		const NS = 'theme-picker';
		const DICTS = {
			zh: {
				tab: '主题',
				title: '主题',
				hint: '即时生效，重新加载后依然保留。',
				defaultName: '默认',
				light: '浅色',
				dark: '深色',
			},
			en: {
				tab: 'Themes',
				title: 'Themes',
				hint: 'Applies immediately and survives a reload.',
				defaultName: 'Default',
				light: 'Light',
				dark: 'Dark',
			},
		};

		/** Normalize a stored payload; anything unexpected means "no selection". */
		function readState(value) {
			if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
			if (value.version !== 1) return null;
			const selection = typeof value.selection === 'string' && SKIN_BY_ID.has(value.selection) ? value.selection : null;
			return { version: 1, selection };
		}

		function readLocal() {
			try {
				if (typeof localStorage === 'undefined') return null;
				const raw = localStorage.getItem(STORAGE_KEY);
				return raw === null ? null : readState(JSON.parse(raw));
			} catch {
				return null;
			}
		}

		function writeLocal(state) {
			try {
				if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			} catch {
				/* private mode or quota: the state file remains authoritative */
			}
		}

		async function fetchDurable() {
			try {
				const response = await fetch(STATE_PATH, { headers: { accept: 'application/json' } });
				if (!response.ok) return null;
				return readState(await response.json());
			} catch {
				return null;
			}
		}

		async function putDurable(state) {
			try {
				await fetch(STATE_PATH, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(state),
				});
			} catch {
				/* the instant layer keeps the selection for this browser */
			}
		}
		//#endregion

		//#region section
		/**
		* Theme Picker settings page: one radio card per theme, native radio
		* semantics (label + hidden input, so click, arrow keys, and screen-reader
		* announcements come from the platform).
		* @param props - slot props: copy binding, selection store, and the pick action.
		* @returns the section element tree.
		*/
		function ThemePickerSection({ t, useStore, pick }) {
			const selection = useStore((state) => state.selection);
			const scheme = useStore((state) => state.scheme);
			const card = (id, name, cardScheme, swatch) => react.createElement('label', { key: id, className: 'dstp-card' },
				react.createElement('input', {
					type: 'radio',
					className: 'dstp-input',
					name: 'theme-picker',
					value: id,
					checked: selection === id,
					onChange: () => pick(id),
				}),
				react.createElement('span', { className: 'dstp-swatch', 'aria-hidden': 'true' },
					swatch.map((color, index) => react.createElement('span', { key: index, className: 'dstp-chip', style: { background: color } }))),
				react.createElement('span', { className: 'dstp-text' },
					react.createElement('span', { className: 'dstp-name' }, name),
					react.createElement('span', { className: 'dstp-scheme' }, cardScheme === 'light' ? t('light') : t('dark'))));
			return react.createElement('div', { className: 'dstp-root' },
				react.createElement('h2', { className: 'dstp-title' }, t('title')),
				react.createElement('p', { className: 'dstp-hint' }, t('hint')),
				react.createElement('div', { className: 'dstp-grid', role: 'radiogroup', 'aria-label': t('title') },
					card(DEFAULT_ID, t('defaultName'), scheme, DEFAULT_SWATCH[scheme]),
					...SKINS.map((skin) => card(skin.id, skin.name, skin.colorScheme, skin.swatch))));
		}
		//#endregion

		const inject = ['slots', 'locale', 'theme'];

		/**
		* Client half: register the catalog with `ctx.theme`, keep the selection
		* applied across the runtime's built-in-preference adoptions, persist it
		* (localStorage + host state file), and contribute the Settings tab.
		* @param ctx - client cordis context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, DICTS), 'theme-picker: dictionaries');
			const t = ctx.locale.bind(NS);
			const theme = ctx.theme;
			const live = new Set();
			const disposers = [];
			for (const skin of SKINS) {
				try {
					disposers.push(theme.register({ id: skin.id, colorScheme: skin.colorScheme, tokens: skin.tokens }));
					live.add(skin.id);
				} catch (error) {
					ctx.logger.warn(`theme-picker: ${skin.id} not registered (${error instanceof Error ? error.message : String(error)})`);
				}
			}
			/** The saved selection: one of our ids, or null for Default. */
			let saved = null;
			/** Last built-in preference, the Default card's target. */
			let builtinPref = BUILTIN_IDS.includes(theme.getTheme().preference) ? theme.getTheme().preference : 'system';
			let bound;
			let putTimer;

			const state = () => {
				const skin = saved === null ? undefined : SKIN_BY_ID.get(saved);
				if (skin === undefined || !HEX_COLOR.test(skin.background)) return { version: 1, selection: null };
				return {
					version: 1,
					selection: skin.id,
					boot: { background: skin.background, colorScheme: skin.colorScheme },
				};
			};
			/** Write both layers: localStorage now, the host file after a pause. */
			const persist = () => {
				const payload = state();
				writeLocal(payload);
				clearTimeout(putTimer);
				putTimer = setTimeout(() => {
					void putDurable(payload);
				}, 300);
			};
			const sync = () => {
				const scheme = theme.getTheme().active.colorScheme;
				if (bound !== undefined) bound.sync(saved === null ? DEFAULT_ID : saved, scheme);
			};

			// Explicit picks go through the wrapper (the Appearance row included):
			// a built-in pick clears our selection, so the adopt echo that follows
			// is read as the user's choice and never re-asserted. An adoption that
			// arrives WITHOUT passing here is a clobber and gets re-asserted below.
			const setTheme = theme.setTheme.bind(theme);
			theme.setTheme = (id) => {
				builtinPref = BUILTIN_IDS.includes(id) ? id : builtinPref;
				saved = live.has(id) ? id : null;
				persist();
				return setTheme(id);
			};

			ctx.on('theme/change', (snapshot) => {
				const id = snapshot.preference;
				if (BUILTIN_IDS.includes(id)) {
					builtinPref = id;
					// A macrotask, not a re-entrant call: ui-layout's presenter applies
					// this snapshot after the dispatch, so an immediate re-assert would
					// be overwritten by the clobbered palette it is still holding.
					if (saved !== null && live.has(saved)) {
						const want = saved;
						setTimeout(() => {
							if (saved !== want || !live.has(want)) return;
							try {
								setTheme(want);
							} catch (error) {
								ctx.logger.warn(`theme-picker: re-assert of ${want} failed (${error instanceof Error ? error.message : String(error)})`);
							}
						}, 0);
					}
				} else if (!live.has(id)) {
					// Another plugin's theme won the preference; ours is gone.
					saved = null;
					persist();
				}
				sync();
			});

			const select = (id) => {
				if (id === DEFAULT_ID) {
					saved = null;
					persist();
					theme.setTheme(builtinPref);
					sync();
					return;
				}
				if (!live.has(id)) return;
				theme.setTheme(id);
				sync();
			};

			const store = defineStore({
				init: () => ({ selection: DEFAULT_ID, scheme: theme.getTheme().active.colorScheme }),
				actions: {
					sync: (draft, selection, scheme) => {
						if (draft.selection === selection && draft.scheme === scheme) return;
						draft.selection = selection;
						draft.scheme = scheme;
					},
				},
			});
			const injected = (actions) => {
				bound = actions;
				sync();
				return { pick: select };
			};
			ctx.effect(() => ctx.slots.inject('settings.section', () => ctx.slots.register({
				name: 'settings.section',
				id: 'theme-picker',
				order: 5,
				label: () => t('tab'),
				locale: NS,
				store,
				inject: injected,
			}, ThemePickerSection)), 'theme-picker: settings section');

			// Restore: the instant layer first, then the file (its absence, or a
			// selection of a theme that failed to register, means Default).
			const local = readLocal();
			if (local !== null && local.selection !== null) select(local.selection);
			else if (local === null) {
				void fetchDurable().then((durable) => {
					if (durable === null || durable.selection === null || saved !== null) return;
					writeLocal(durable);
					select(durable.selection);
				});
			}

			ctx.effect(() => () => {
				clearTimeout(putTimer);
				theme.setTheme = setTheme;
				for (const dispose of disposers) dispose();
				if (typeof document !== 'undefined') {
					const tag = document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG) + ']');
					if (tag !== null) tag.remove();
				}
			}, 'theme-picker: teardown');
		}

		exports.SKINS = SKINS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
