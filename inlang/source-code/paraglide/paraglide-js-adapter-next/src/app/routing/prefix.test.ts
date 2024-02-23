import { it, expect, describe } from "vitest"
import { prefixStrategy } from "./prefix"

const {
	getLocaleFromLocalisedPath,
	translatePath,
	getCanonicalPath,
	getLocalisedPath,
	localiseHref,
} = prefixStrategy({
	availableLanguageTags: ["en", "de", "de-CH"],
	defaultLanguage: "en",
	exclude: (path) => path.startsWith("/api/"),
})

describe("getLocaleFromLocalisedPath", () => {
	it("returns the locale if there is one", () => {
		expect(getLocaleFromLocalisedPath("/de/some/path")).toBe("de")
		expect(getLocaleFromLocalisedPath("/en/some/path")).toBe("en")
		expect(getLocaleFromLocalisedPath("/de-CH/some/path")).toBe("de-CH")
	})

	it("returns the undefined if there is no locale", () => {
		expect(getLocaleFromLocalisedPath("/some/path")).toBe(undefined)
	})
})

describe("getCanonicalPath", () => {
	it("removes the language prefix if there is one", () => {
		expect(getCanonicalPath("/de/some/path")).toBe("/some/path")
		expect(getCanonicalPath("/en/some/path")).toBe("/some/path")
		expect(getCanonicalPath("/de-CH/some/path")).toBe("/some/path")
	})

	it("returns the path if there is no language prefix", () => {
		expect(getCanonicalPath("/some/path")).toBe("/some/path")
	})
})

describe("getLocalisedPath", () => {
	it("adds a language prefix if there isn't one", () => {
		expect(getLocalisedPath("/some/path", "de")).toBe("/de/some/path")
		expect(getLocalisedPath("/some/path", "de-CH")).toBe("/de-CH/some/path")
	})

	it("does not add a language prefix if the new locale is the source language tag", () => {
		expect(getLocalisedPath("/some/path", "en")).toBe("/some/path")
	})

	it("does not localise excluded paths", () => {
		expect(getLocalisedPath("/api/some/path", "de")).toBe("/api/some/path")
	})
})

describe("translatePath", () => {
	it("adds a language prefix if there isn't one", () => {
		expect(translatePath("/some/path", "de")).toBe("/de/some/path")
		expect(translatePath("/some/path", "de-CH")).toBe("/de-CH/some/path")
	})

	it("replaces the language prefix if there is one", () => {
		expect(translatePath("/en/some/path", "de")).toBe("/de/some/path")
		expect(translatePath("/en/some/path", "de-CH")).toBe("/de-CH/some/path")

		// valid language tag, but not in availableLanguageTags
		expect(translatePath("/fr/some/path", "de")).toBe("/de/fr/some/path")
	})

	it("removes the language prefix if the new locale is the source language tag", () => {
		expect(translatePath("/en/some/path", "en")).toBe("/some/path")
		expect(translatePath("/de/some/path", "en")).toBe("/some/path")
		expect(translatePath("/de-CH/some/path", "en")).toBe("/some/path")
	})

	it("does not add a language prefix if the new locale is the source language tag", () => {
		expect(translatePath("/some/path", "en")).toBe("/some/path")
	})

	it("returns an empty string if the path is empty", () => {
		expect(translatePath("", "en")).toBe("")
	})

	it("keeps search params and hash", () => {
		expect(translatePath("/some/path?foo=bar#hash", "de")).toBe("/de/some/path?foo=bar#hash")
		expect(translatePath("/some/path?foo=bar#hash", "de-CH")).toBe("/de-CH/some/path?foo=bar#hash")
		expect(translatePath("/some/path?foo=bar#hash", "en")).toBe("/some/path?foo=bar#hash")
	})

	it("leaves excluded paths alone", () => {
		expect(translatePath("/api/some/path", "de")).toBe("/api/some/path")
	})
})

describe("localiseHref", () => {
	it("translates absolute paths (string)", () => {
		expect(localiseHref("/some/path", "de")).toBe("/de/some/path")
		expect(localiseHref("/some/path", "de-CH")).toBe("/de-CH/some/path")
		expect(localiseHref("/some/path", "en")).toBe("/some/path")
	})

	it("translates absolute paths (object)", () => {
		expect(localiseHref({ pathname: "/some/path" }, "de")).toEqual({ pathname: "/de/some/path" })
		expect(localiseHref({ pathname: "/some/path" }, "de-CH")).toEqual({
			pathname: "/de-CH/some/path",
		})
		expect(localiseHref({ pathname: "/some/path" }, "en")).toEqual({ pathname: "/some/path" })
	})

	it("keeps search params and hash (string)", () => {
		expect(localiseHref("/some/path?foo=bar#hash", "de")).toBe("/de/some/path?foo=bar#hash")
		expect(localiseHref("/some/path?foo=bar#hash", "de-CH")).toBe("/de-CH/some/path?foo=bar#hash")
		expect(localiseHref("/some/path?foo=bar#hash", "en")).toBe("/some/path?foo=bar#hash")
	})

	it("keeps search params and hash (object)", () => {
		expect(
			localiseHref({ pathname: "/some/path", search: "?foo=bar", hash: "#hash" }, "de")
		).toEqual({
			pathname: "/de/some/path",
			search: "?foo=bar",
			hash: "#hash",
		})

		expect(
			localiseHref({ pathname: "/some/path", search: "?foo=bar", hash: "#hash" }, "de-CH")
		).toEqual({
			pathname: "/de-CH/some/path",
			search: "?foo=bar",
			hash: "#hash",
		})

		expect(
			localiseHref({ pathname: "/some/path", search: "?foo=bar", hash: "#hash" }, "en")
		).toEqual({
			pathname: "/some/path",
			search: "?foo=bar",
			hash: "#hash",
		})
	})

	it("does not translate relative paths (string)", () => {
		expect(localiseHref("some/path", "de")).toBe("some/path")
		expect(localiseHref("some/path", "de-CH")).toBe("some/path")
		expect(localiseHref("some/path", "en")).toBe("some/path")
	})

	it("does not translate relative paths (object)", () => {
		expect(localiseHref({ pathname: "some/path" }, "de")).toEqual({ pathname: "some/path" })
		expect(localiseHref({ pathname: "some/path" }, "de-CH")).toEqual({ pathname: "some/path" })
		expect(localiseHref({ pathname: "some/path" }, "en")).toEqual({ pathname: "some/path" })
	})

	it("does not translate external links (string)", () => {
		expect(localiseHref("https://some/path", "de")).toBe("https://some/path")
		expect(localiseHref("https://some/path", "de-CH")).toBe("https://some/path")
		expect(localiseHref("https://some/path", "en")).toBe("https://some/path")
	})

	it("does not translate external links (object)", () => {
		expect(localiseHref({ host: "some", pathname: "path" }, "de")).toEqual({
			host: "some",
			pathname: "path",
		})
		expect(localiseHref({ host: "some", pathname: "path" }, "de-CH")).toEqual({
			host: "some",
			pathname: "path",
		})
		expect(localiseHref({ host: "some", pathname: "path" }, "en")).toEqual({
			host: "some",
			pathname: "path",
		})
	})
})

