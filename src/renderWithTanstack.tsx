import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRouteWithContext,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
	type Route,
	type RouteOptions,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

type RouteConfigOptions = Omit<RouteOptions, "getParentRoute" | "path"> & {
	type?: "layout" | "route";
};

type RouteOption = RouteConfigOptions & {
	routes?: Record<string, RouteOption>;
};

const recurseRoute = (
	parent: Route,
	path: string,
	routeOptions?: RouteConfigOptions,
	routes?: Record<string, RouteOption>
) => {
	const internalCollection: Array<Route> = [];

	const availableRouteOptions = routeOptions || {};

	const createdRoute = createRoute({
		getParentRoute: () => parent as unknown as Route,
		...(availableRouteOptions.type === "layout"
			? { id: path }
			: { path: path }),
		...availableRouteOptions,
	});

	if (routes) {
		Object.entries(routes).forEach(
			([childPath, { routes: childRoutes, ...childRouteConfigOptions }]) => {
				const result = recurseRoute(
					createdRoute as unknown as Route,
					childPath,
					childRouteConfigOptions,
					childRoutes
				);

				internalCollection.push(result as unknown as Route);
			}
		);

		return createdRoute.addChildren(internalCollection);
	}

	return createdRoute;
};

export function renderWithRouter(options: {
	initialHistory?: string[];
	routes: Record<string, RouteOption>;
}) {
	const rootRoute = createRootRouteWithContext()({
		component: () => {
			return (
				<QueryClientProvider client={queryClient}>
					<p>root</p>
					<Outlet />
				</QueryClientProvider>
			);
		},
	});

	const rootRouteChildren: Array<Route> = [];

	Object.entries(options.routes).forEach(
		([path, { routes, ...configOptions }]) => {
			const result = recurseRoute(
				rootRoute as unknown as Route,
				path,
				configOptions,
				routes
			);
			rootRouteChildren.push(result as unknown as Route);
		}
	);

	const routeTree = rootRoute.addChildren(rootRouteChildren);

	let history;

	if (options.initialHistory) {
		history = createMemoryHistory({
			initialEntries: options.initialHistory,
		});
	}

	const router = createRouter({
		routeTree,
		history,
	});

	return render(<RouterProvider router={router} />);
}
