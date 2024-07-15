import { act, cleanup, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Workflows } from "./WorkflowsComponent";
import { renderWithRouter } from "./renderWithTanstack";

afterEach(() => {
	window.history.replaceState(null, "root", "/");
	cleanup();
});

describe("basic router test for Workflows", () => {
	it("renders the workflow ID on the page", async () => {
		await act(async () =>
			renderWithRouter({
				initialHistory: ["/workflows/4"],
				routes: {
					workflows: {
						component: undefined,
						routes: {
							$workflowId: {
								component: Workflows,
							},
						},
					},
				},
			})
		);

		const rootEl = await screen.findByText("root");
		expect(rootEl).toBeInTheDocument();

		const workflowIdEl = await screen.findByText("Workflow ID is 4");
		expect(workflowIdEl).toBeInTheDocument();
	});
});
