"use client";

import { NotepadTextIcon, XIcon } from "lucide-react";
import { parseAsString, throttle, useQueryStates } from "nuqs";
import { useMemo } from "react";
import type { FetchSubjectListType } from "~/server/fetchers/fetch-subject-list";
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

interface SubjectListFiltersProps {
	papers: FetchSubjectListType["paperEntries"];
}

export function SubjectListFilters({ papers }: SubjectListFiltersProps) {
	const [{ byPaper, subjectQ }, setFilters] = useQueryStates(
		{
			subjectQ: parseAsString.withDefault(""),
			byPaper: parseAsString.withDefault("")
		},
		{
			limitUrlUpdates: throttle(200),
			shallow: false
		}
	);

	const selectedValue = useMemo(
		() =>
			papers.findLast((p) => p.value === byPaper) || {
				label: "All",
				value: ""
			},
		[byPaper, papers]
	);

	return (
		<>
			<Field
				className="w-full gap-0 md:max-w-80"
				key="examination-paper-search"
			>
				<FieldLabel>Search for Subject</FieldLabel>
				<InputGroup>
					<InputGroupInput
						type="text"
						placeholder="Search..."
						key="examination-subject-search-input"
						autoComplete="off"
						value={subjectQ}
						onChange={(event) =>
							setFilters({ subjectQ: event.target.value || null })
						}
					/>
				</InputGroup>
			</Field>

			<Field className="mr-auto w-full gap-0 md:max-w-72">
				<FieldLabel>By Paper</FieldLabel>
				<Combobox
					items={[{ label: "All", value: "" }, ...papers]}
					value={selectedValue}
					key="examination-subject-combobox"
					itemToStringValue={(i) => i.value}
					onValueChange={(selected) =>
						setFilters({ byPaper: selected?.value ?? "" })
					}
				>
					<ComboboxInput placeholder="All">
						<InputGroupAddon>
							<NotepadTextIcon />
						</InputGroupAddon>
					</ComboboxInput>
					<ComboboxContent>
						<ComboboxList>
							{(item) => (
								<ComboboxItem
									key={`by-paper-${item.value}`}
									value={item}
								>
									{item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			{(byPaper || subjectQ) && (
				<Button
					variant="destructive"
					size="lg"
					className="w-full md:w-fit"
					onClick={() =>
						setFilters({ byPaper: null, subjectQ: null })
					}
				>
					<XIcon />
					Reset
				</Button>
			)}
		</>
	);
}
