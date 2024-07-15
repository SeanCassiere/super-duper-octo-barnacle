import { act, cleanup, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { renderWithRouter } from "./renderWithTanstack";
import { LayoutComponent, LayoutWrapper } from "./LayoutComponent";

afterEach(() => {
	window.history.replaceState(null, "root", "/");
	cleanup();
});

describe("basic router test for Layout", () => {
	it("renders the layout and its child", async () => {
		await act(async () =>
			renderWithRouter({
				routes: {
					_layout: {
						type: "layout",
						component: () => <LayoutWrapper />,
						routes: {
							"/": {
								component: () => <LayoutComponent />,
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
			"I am a layout component"
		);
		expect(layoutComponentEl).toBeInTheDocument();
	});
});
