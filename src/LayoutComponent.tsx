import { Outlet } from "@tanstack/react-router";

export function LayoutWrapper() {
	return (
		<div>
			<p>LayoutWrapper</p>
			<Outlet />
		</div>
	);
}

export function LayoutComponent() {
	return <p>I am a layout component</p>;
}
