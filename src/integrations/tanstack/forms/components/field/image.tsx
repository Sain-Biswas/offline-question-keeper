import { useCallback, useMemo, useRef } from "react";
import type { ChangeEvent } from "react";
import { ImageIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
import { Button } from "~/shadcn/ui/button";
import { Field, FieldError, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";
import { cn } from "~/lib/utils";
import {
	useFieldContext,
	useFormContext
} from "~/integrations/tanstack/forms/contexts";

interface ImageDataFieldProps {
	fieldClassName?: string;
	label: string;
	accept?: string;
}

export function ImageDataField({
	fieldClassName,
	label,
	accept = "image/*"
}: ImageDataFieldProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		state: { isSubmitted }
	} = useFormContext();

	const {
		state: {
			value,
			meta: { isTouched, errors }
		},
		name,
		handleBlur,
		handleChange
	} = useFieldContext<string>();

	const isInvalid = useMemo(() => {
		return (isTouched || isSubmitted) && errors.length > 0;
	}, [errors, isSubmitted, isTouched]);

	const handleImageChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				handleChange(base64String);
			};
			reader.readAsDataURL(file);
		},
		[handleChange]
	);

	const handleClearImage = useCallback(() => {
		handleChange("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [handleChange]);

	const fileInputId = `${name}-file-input`;

	return (
		<div className="flex items-start gap-4">
			<input
				type="hidden"
				name={name}
				value={value ?? ""}
			/>

			<div className="group relative shrink-0">
				<Avatar className="size-14 rounded-none bg-muted after:content-none">
					<AvatarImage
						src={value || undefined}
						alt="Selected preview"
						className="rounded object-cover"
					/>
					<AvatarFallback className="rounded-none bg-muted text-muted-foreground outline-0">
						<ImageIcon className="size-6" />
					</AvatarFallback>
				</Avatar>
			</div>

			<Field
				data-invalid={isInvalid}
				className={cn("w-full gap-0", fieldClassName)}
			>
				<FieldLabel htmlFor={fileInputId}>{label}</FieldLabel>

				<InputGroup>
					<InputGroupInput
						ref={fileInputRef}
						id={fileInputId}
						type="file"
						accept={accept}
						onChange={handleImageChange}
						onBlur={handleBlur}
						aria-invalid={isInvalid}
						className="cursor-pointer file:cursor-pointer"
					/>
					{!!value && (
						<InputGroupAddon align="inline-end">
							<Button
								variant="destructive"
								size="icon-sm"
								onClick={handleClearImage}
								title="Remove image"
							>
								<X className="size-3" />
								<span className="sr-only">Remove image</span>
							</Button>
						</InputGroupAddon>
					)}
				</InputGroup>

				{isInvalid && <FieldError errors={errors} />}
			</Field>
		</div>
	);
}
