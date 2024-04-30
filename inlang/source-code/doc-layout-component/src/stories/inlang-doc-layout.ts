import { html, LitElement, css } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { baseStyling } from "../styling/base.js"
import type { MarketplaceManifest } from "@inlang/marketplace-manifest"
import overridePrimitiveColors from "./../helper/overridePrimitiveColors.js"

import "./inlang-doc-navigation.ts"
import "./inlang-doc-in-page-navigation.ts"

import SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer.component.js"
import SlButton from "@shoelace-style/shoelace/dist/components/button/button.component.js"

// in case an app defines it's own set of shoelace components, prevent double registering
if (!customElements.get("sl-drawer")) customElements.define("sl-drawer", SlDrawer)
if (!customElements.get("sl-button")) customElements.define("sl-button", SlButton)

@customElement("inlang-doc-layout")
export default class InlangDocLayout extends LitElement {
	static override styles = [
		baseStyling,
		css`
			.container {
				display: flex;
				width: 100%;
				height: 100%;
				position: relative;
			}
			.right-column {
				width: 230px;
				height: 100%;
				display: block;
				margin-top: 16px;
				position: sticky;
				top: 124px;
			}
			.main-column {
				width: calc(100% - 460px - 80px);
				display: block;
				height: 100%;
				padding: 0 40px;
				overflow: hidden;
			}
			@media (max-width: 1280px) {
				.main-column {
					padding: 0 20px;
					width: calc(100% - 230px - 40px);
				}
			}
			@media (max-width: 768px) {
				.main-column {
					padding: 0;
					width: 100%;
				}
			}
			.left-column {
				width: 230px;
				height: 100%;
				display: block;
				margin-top: 16px;
				position: sticky;
				top: 124px;
			}
			.open-menu-button {
				display: none;
				width: 52px;
				height: 52px;
				border-radius: 50%;
				background-color: #fff;
				box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
				justify-content: center;
				align-items: center;
				border: 1px solid var(--sl-color-neutral-200);
			}
			@media (max-width: 1280px) {
				.right-column {
					display: none;
				}
			}
			@media (max-width: 768px) {
				.left-column {
					display: none;
				}
				.open-menu-button {
					display: flex;
					position: fixed;
					bottom: 16px;
					right: 16px;
				}
			}
			sl-drawer::part(header) {
				padding-top: 114px;
			}
			@media (max-width: 768px) {
				sl-drawer::part(header) {
					padding-top: 124px;
				}
			}
			sl-drawer::part(body) {
				padding-top: 0;
			}
			.test {
				height: 100px;
				width: 100px;
			}
		`,
	]

	@property({ type: Object })
	manifest: MarketplaceManifest & { uniqueID: string } = {} as MarketplaceManifest & {
		uniqueID: string
	}

	@property({ type: Object })
	currentRoute: string = "/"

	@state()
	private _drawerIsOpen: boolean = false

	override async firstUpdated() {
		await this.updateComplete

		//override primitive colors to match the design system
		overridePrimitiveColors()
	}

	override render() {
		return html`<div class="container" part="base">
			<div class="left-column">
				<inlang-doc-navigation
					.manifest=${this.manifest}
					.currentRoute=${this.currentRoute}
				></inlang-doc-navigation>
			</div>
			<div class="main-column">
				<div class="open-menu-button" @click=${() => (this._drawerIsOpen = true)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
						/>
					</svg>
				</div>
				<slot></slot>
			</div>
			<div class="right-column">
				<inlang-doc-in-page-navigation
					.contentInHtml=${this.children}
				></inlang-doc-in-page-navigation>
			</div>
			<sl-drawer
				.open=${this._drawerIsOpen}
				@sl-after-hide=${() => {
					this._drawerIsOpen = false
				}}
			>
				<inlang-doc-navigation .manifest=${this.manifest}></inlang-doc-navigation>
			</sl-drawer>
		</div>`
	}
}

// add types
declare global {
	interface HTMLElementTagNameMap {
		"inlang-doc-layout": InlangDocLayout
	}
}
