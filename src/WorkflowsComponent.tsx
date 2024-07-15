import { useParams } from "@tanstack/react-router";

export function Workflows() {
	const params: Record<string, string | undefined> = useParams({
		strict: false,
	});
	// console.log('params', params);
	return <div>Workflow ID is {params?.workflowId}</div>;
}
