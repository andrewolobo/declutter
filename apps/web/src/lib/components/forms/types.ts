/**
 * Shared prop types for form components
 * These interfaces ensure consistency across all form components in the application
 */

/**
 * Base props that all form components should support
 */
export interface BaseFormProps {
	/** Label text displayed above the form element */
	label?: string;
	/** Error message to display below the form element */
	error?: string;
	/** Whether the form element is disabled */
	disabled?: boolean;
	/** Whether the form element is required */
	required?: boolean;
}

/**
 * Extended props for input-style form components
 */
export interface BaseInputProps extends BaseFormProps {
	/** Placeholder text shown when the input is empty */
	placeholder?: string;
}

/**
 * Common option structure for select-like components
 */
export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}
