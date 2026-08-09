"use client";

import { RotateCwIcon, TargetIcon } from "lucide-react";
import {
	parseAsString,
	parseAsStringLiteral,
	throttle,
	useQueryStates
} from "nuqs";
import { useMemo } from "react";
import { Button } from "~/shadcn/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from "~/shadcn/ui/combobox";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";

const items = [
	{
		label: "All",
		value: "all"
	},
	{
		label: "Preparing",
		value: "preparing"
	},
	{
		label: "Not Preparing",
		value: "not-preparing"
	}
] as const;

type Item = (typeof items)[number];

export function ExaminationListFilters() {
	const [{ q, status }, setFilters] = useQueryStates(
		{
			q: parseAsString.withDefault(""),
			status: parseAsStringLiteral([
				"all",
				"preparing",
				"not-preparing"
			]).withDefault("all")
		},
		{
			limitUrlUpdates: throttle(500),
			shallow: false
		}
	);

	const selectedStatusItem = useMemo(
		() => items.find((item) => item.value === status) ?? items[0],
		[status]
	);

	return (
		<section className="m-6 flex flex-col gap-6 bg-card p-6 sm:flex-row sm:items-end">
			<Field className="w-full gap-0 sm:max-w-80">
				<FieldLabel>Search for Examination</FieldLabel>
				<InputGroup>
					<InputGroupInput
						type="text"
						placeholder="Search..."
						autoComplete="off"
						value={q}
						onChange={(event) =>
							setFilters({ q: event.target.value || null })
						}
					/>
				</InputGroup>
			</Field>

			<Field className="mr-auto w-full gap-0 sm:max-w-40">
				<FieldLabel>Current Status</FieldLabel>
				<Combobox
					items={items}
					value={selectedStatusItem}
					itemToStringValue={(i: Item) => i.value}
					onValueChange={(selected: Item | null) =>
						setFilters({ status: selected?.value ?? "all" })
					}
				>
					<ComboboxInput placeholder="All">
						<InputGroupAddon>
							<TargetIcon />
						</InputGroupAddon>
					</ComboboxInput>
					<ComboboxContent>
						<ComboboxList>
							{(item) => (
								<ComboboxItem
									key={item.value}
									value={item}
								>
									{item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			{(q || status !== "all") && (
				<Button
					type="reset"
					size="lg"
					variant="destructive"
					onClick={() => setFilters({ q: null, status: null })}
				>
					<RotateCwIcon />
					Reset
				</Button>
			)}
		</section>
	);
}
