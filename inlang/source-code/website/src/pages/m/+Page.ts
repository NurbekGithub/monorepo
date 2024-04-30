import type { MarketplaceManifest } from "@inlang/marketplace-manifest"
import { html, LitElement } from "lit"

class Page extends LitElement {
	override render() {
		html`<div class="blablabla">
			test
			<!-- <inlang-doc-layout .manifest=${props.manifest} .currentRoute=${props.pagePath}>
				<div class="w-full">
					<article class="max-w-[740px] mx-auto" .innerHTML=${props.markdown} />
				</div>
			</inlang-doc-layout> -->
		</div>`
	}
}

export default Page

/**
 * The page props are undefined if an error occurred during parsing of the markdown.
 */
export type PageProps = {
	markdown: Awaited<ReturnType<any>>
	pages: Record<string, string> | undefined
	pageData: Record<string, unknown>
	pagePath: string
	tableOfContents: Record<string, string[]>
	manifest: MarketplaceManifest & { uniqueID: string }
	recommends?: MarketplaceManifest[]
	isLit?: boolean
}

// export function Page(props: PageProps) {
// 	// mapping translatable types
// 	const displayName = () =>
// 		typeof props.manifest.displayName === "object"
// 			? props.manifest.displayName.en
// 			: props.manifest.displayName

// 	const description = () =>
// 		typeof props.manifest.description === "object"
// 			? props.manifest.description.en
// 			: props.manifest.description

// 	const pageTitle = () => {
// 		if (props.pageData?.title && props.manifest) {
// 			return `${props.pageData.title} | ${displayName()} | inlang`
// 		} else if (props.manifest) {
// 			return `${displayName()} ${
// 				props.manifest.publisherName === "inlang"
// 					? "| inlang"
// 					: `from ${props.manifest.publisherName} | inlang`
// 			}`
// 		} else {
// 			return "Product page | inlang"
// 		}
// 	}

// 	const metaDescription = () => {
// 		if (props.pageData?.description) {
// 			return props.pageData.description as string
// 		} else if (props.manifest) {
// 			return description()
// 		} else {
// 			return "Here comes an inlang product."
// 		}
// 	}

// 	return (
// 		<>
// 			<MarketplaceLayout>
// 				<div class="min-h-screen">
// 					<Show when={props.markdown && props.manifest}>
// 						<inlang-doc-layout prop:manifest={props.manifest} prop:currentRoute={props.pagePath}>
// 							<div class="w-full">
// 								<article class="max-w-[740px] mx-auto" innerHTML={props.markdown} />
// 							</div>
// 						</inlang-doc-layout>
// 					</Show>
// 				</div>
// 			</MarketplaceLayout>
// 		</>
// 	)
// }
