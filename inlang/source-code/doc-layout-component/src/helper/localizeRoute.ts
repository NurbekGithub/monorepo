import type { LanguageTag } from "@inlang/sdk"

export const localizeRoute = (
	href: string,
	sourceLanguageTag: LanguageTag,
	languageTag: LanguageTag
): string => {
	let modifiedHref = href
	if (
		languageTag !== sourceLanguageTag &&
		!href?.includes("http") &&
		!href?.includes("mailto") &&
		!href?.includes("/documentation")
	) {
		modifiedHref = "/" + languageTag + href
	}
	if (modifiedHref?.endsWith("/")) {
		modifiedHref = modifiedHref.slice(0, -1)
	}
	if (modifiedHref?.length === 0) {
		modifiedHref = "/"
	}

	return modifiedHref
}
