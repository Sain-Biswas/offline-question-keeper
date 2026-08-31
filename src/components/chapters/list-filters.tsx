"use client";

import { ComponentIcon, XIcon } from "lucide-react";
import { parseAsString, throttle, useQueryStates } from "nuqs";
import { useMemo } from "react";
import type { FetchChapterListType } from "~/server/fetchers/fetch-chapter-list";
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

interface ChapterListFiltersProps {
	subjects: FetchChapterListType["subjects"];
}

export function ChapterListFilters({ subjects }: ChapterListFiltersProps) {
	const [{ bySubject, chapterQ }, setFilters] = useQueryStates(
		{
			chapterQ: parseAsString.withDefault(""),
			bySubject: parseAsString.withDefault("")
		},
		{
			limitUrlUpdates: throttle(200),
			shallow: false
		}
	);

	const selectedValue = useMemo(
		() => subjects.findLast((s) => s.value === bySubject),
		[bySubject, subjects]
	);

	return (
		<>
			<Field
				className="w-full gap-0 md:max-w-80"
				key="examination-paper-search"
			>
				<FieldLabel>Search for Chapter</FieldLabel>
				<InputGroup>
					<InputGroupInput
						type="text"
						placeholder="Search..."
						key="examination-subject-search-input"
						autoComplete="off"
						value={chapterQ}
						onChange={(event) =>
							setFilters({ chapterQ: event.target.value || null })
						}
					/>
				</InputGroup>
			</Field>

			<Field className="mr-auto w-full gap-0 md:max-w-72">
				<FieldLabel>Filter By Subject</FieldLabel>
				<Combobox
					items={[
						{ label: "All", value: "", description: "All Entries" },
						...subjects
					]}
					value={selectedValue}
					key="examination-subject-combobox"
					itemToStringValue={(i) => i.value}
					onValueChange={(selected) =>
						setFilters({ bySubject: selected?.value ?? "" })
					}
				>
					<ComboboxInput placeholder="All">
						<InputGroupAddon>
							<ComponentIcon />
						</InputGroupAddon>
					</ComboboxInput>
					<ComboboxContent>
						<ComboboxList>
							{(item) => (
								<ComboboxItem
									key={`by-paper-${item.value}`}
									value={item}
									className="flex-col items-start gap-0"
								>
									<h1 className="text-sm font-extrabold">
										{item.label}
									</h1>
									<p className="text-xs text-muted-foreground">
										{item.description}
									</p>
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			{(bySubject || chapterQ) && (
				<Button
					variant="destructive"
					size="lg"
					className="w-full md:w-fit"
					onClick={() =>
						setFilters({ bySubject: null, chapterQ: null })
					}
				>
					<XIcon />
					Reset
				</Button>
			)}
		</>
	);
}
