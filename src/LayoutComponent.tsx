import { Outlet } from "@tanstack/react-router";

export function LayoutWrapper() {
	return (
		<div>
			<p>LayoutWrapper</p>
			<Outlet />
		</div>
	);
}

export function LayoutIndexComponent() {
	return <p>I am a layout index component</p>;
}

export function LayoutAboutComponent() {
	return <p>I am a layout about component</p>;
}
