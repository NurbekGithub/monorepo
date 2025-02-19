import { createLocaliseHref } from "./localiseHref"
import {
	redirect as NextRedirect,
	permanentRedirect as NextPermanentRedirect,
} from "next/navigation"
import type { RoutingStragey } from "./routing/interface"

export function createRedirects<T extends string>(
	languageTag: () => T,
	strategy: RoutingStragey<T>
) {
	const localiseHref = createLocaliseHref(strategy)

	/**
	 * When used in a streaming context, this will insert a meta tag to redirect the user to the target page.
	 * When used in a custom app route, it will serve a 307/303 to the caller.
	 *
	 *  @param url the url to redirect to
	 */
	const redirect: typeof NextRedirect = (...args) => {
		args[0] = localiseHref(args[0], languageTag())
		NextRedirect(...args)
	}

	/**
	 * When used in a streaming context, this will insert a meta tag to redirect the user to the target page.
	 * When used in a custom app route, it will serve a 308/303 to the caller.
	 *
	 * @param url the url to redirect to
	 */
	const permanentRedirect: typeof NextPermanentRedirect = (...args) => {
		args[0] = localiseHref(args[0], languageTag())
		NextPermanentRedirect(...args)
	}

	return { redirect, permanentRedirect }
}
