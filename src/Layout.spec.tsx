import { act, cleanup, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { renderWithRouter } from "./renderWithTanstack";
import {
	LayoutAboutComponent,
	LayoutIndexComponent,
	LayoutWrapper,
} from "./LayoutComponent";

afterEach(() => {
	window.history.replaceState(null, "root", "/");
	cleanup();
});

describe("basic router test for Layout", () => {
	it("renders the layout and its child index route", async () => {
		await act(async () =>
			renderWithRouter({
				routes: {
					_layout: {
						type: "layout",
						component: LayoutWrapper,
						routes: {
							"/": {
								component: LayoutIndexComponent,
							},
						},
					},
				},
			})
		);

		const rootEl = await screen.findByText("root");
		expect(rootEl).toBeInTheDocument();

		const layoutWrapperEl = await screen.findByText("LayoutWrapper");
		expect(layoutWrapperEl).toBeInTheDocument();

		const layoutComponentEl = await screen.findByText(
			"I am a layout index component"
		);
		expect(layoutComponentEl).toBeInTheDocument();
	});

	it("renders the layout and its child about route", async () => {
		await act(async () =>
			renderWithRouter({
				initialHistory: ["/about"],
				routes: {
					_layout: {
						type: "layout",
						component: LayoutWrapper,
						routes: {
							"/": {
								component: LayoutIndexComponent,
							},
							about: {
								component: LayoutAboutComponent,
							},
						},
					},
				},
			})
		);

		const rootEl = await screen.findByText("root");
		expect(rootEl).toBeInTheDocument();

		const layoutWrapperEl = await screen.findByText("LayoutWrapper");
		expect(layoutWrapperEl).toBeInTheDocument();

		const layoutComponentEl = await screen.findByText(
			"I am a layout about component"
		);
		expect(layoutComponentEl).toBeInTheDocument();
	});
});
