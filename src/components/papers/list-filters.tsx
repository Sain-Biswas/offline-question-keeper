"use client";

import { XIcon } from "lucide-react";
import { throttle, useQueryState } from "nuqs";
import { Button } from "~/shadcn/ui/button";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import { InputGroup, InputGroupInput } from "~/shadcn/ui/input-group";

export function PaperListFilters() {
	const [paperQ, setPaperQ] = useQueryState("paperQ", {
		shallow: false,
		limitUrlUpdates: throttle(200),
		defaultValue: ""
	});

	return (
		<>
			<Field
				className="mr-auto w-full gap-0 md:max-w-80"
				key="examination-paper-search"
			>
				<FieldLabel>Search for Paper</FieldLabel>
				<InputGroup>
					<InputGroupInput
						type="text"
						placeholder="Search..."
						key="examination-paper-search-input"
						autoComplete="off"
						value={paperQ ?? undefined}
						onChange={(event) =>
							setPaperQ(event.target.value || null)
						}
					/>
				</InputGroup>
			</Field>

			{paperQ && (
				<Button
					variant="destructive"
					size="lg"
					className="w-full md:w-fit"
					onClick={() => setPaperQ(null)}
				>
					<XIcon />
					Reset
				</Button>
			)}
		</>
	);
}
