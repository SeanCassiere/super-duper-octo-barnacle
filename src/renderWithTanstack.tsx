import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRouteWithContext,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
	type ReactNode,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

type RouteConfigOptions = {
	component?: undefined | (() => ReactNode);
};

type RouteOption = RouteConfigOptions & {
	routes?: Record<string, RouteOption>;
};

const recurseRoute = (
	parent: any,
	path: string,
	routeOptions?: RouteConfigOptions,
	routes?: Record<string, RouteOption>
) => {
	const internalCollection: any[] = [];

	const createdRoute = createRoute({
		getParentRoute: () => parent,
		path: path,
		...routeOptions,
	});

	if (routes) {
		[...Object.entries(routes)].forEach(
			([childPath, { routes: childRoutes, ...childRouteConfigOptions }]) => {
				const result = recurseRoute(
					createdRoute,
					childPath,
					childRouteConfigOptions,
					childRoutes
				);

				internalCollection.push(result);
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

	const rootRouteChildren: any[] = [];

	[...Object.entries(options.routes)].forEach(
		([path, { routes, ...configOptions }]) => {
			const result = recurseRoute(rootRoute, path, configOptions, routes);
			rootRouteChildren.push(result);
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
