import { guessThemeTypeFromEditorColors, resolveVSCodeWorkbenchColors, VSCodeThemeType, VSCodeWorkbenchColors } from '../internal/vscode-colors'
import stripJsonComments from 'strip-json-comments'
import type { IShikiTheme } from 'shiki'

export class ExpressiveCodeTheme implements Omit<IShikiTheme, 'type' | 'colors'> {
	name: string
	type: VSCodeThemeType
	colors: VSCodeWorkbenchColors
	fg: string
	bg: string
	settings: IShikiTheme['settings']

	/**
	 * Loads the given theme for use with Expressive Code. Supports both Shiki and VS Code themes.
	 *
	 * Note: To save on bundle size, this constructor does not support loading themes
	 * bundled with Shiki by name (e.g. `dracula`). Instead, import Shiki's `loadTheme`
	 * function yourself, use it to load its bundled theme (e.g. `themes/dracula.json`),
	 * and pass the result to this constructor.
	 */
	constructor(theme: Partial<ExpressiveCodeTheme> | Partial<IShikiTheme>) {
		if (theme.type === 'css') throw new Error('Theme type "css" is not supported.')

		this.name = theme.name || ''
		this.type = theme.type || guessThemeTypeFromEditorColors(theme.colors)
		this.colors = resolveVSCodeWorkbenchColors(theme.colors, this.type)
		this.fg = theme.fg || this.colors['editor.foreground']
		this.bg = theme.bg || this.colors['editor.background']
		this.settings = theme.settings || []
	}

	/**
	 * Attempts to parse the given JSON string as a theme.
	 *
	 * As some themes follow the JSONC format and may contain comments and trailing commas,
	 * this method will attempt to strip them before parsing the result.
	 */
	static fromJSONString(json: string) {
		return new ExpressiveCodeTheme(JSON.parse(stripJsonComments(json, { trailingCommas: true })) as Partial<ExpressiveCodeTheme>)
	}
}