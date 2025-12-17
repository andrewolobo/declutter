<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	export let value: string = '';
	export let countryCode: string = '+256'; // Default: Uganda
	export let label: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let placeholder: string = '700 123 456';

	const dispatch = createEventDispatcher();

	let focused = false;
	let isCountryDropdownOpen = false;
	let dropdownElement: HTMLDivElement;

	const countryCodes = [
		{ code: '+256', country: 'Uganda', flag: '🇺🇬' },
		{ code: '+254', country: 'Kenya', flag: '🇰🇪' },
		{ code: '+255', country: 'Tanzania', flag: '🇹🇿' },
		{ code: '+250', country: 'Rwanda', flag: '🇷🇼' },
		{ code: '+257', country: 'Burundi', flag: '🇧🇮' },
		{ code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
		{ code: '+44', country: 'UK', flag: '🇬🇧' }
	];

	function formatPhoneNumber(phone: string): string {
		// Remove all non-digits
		const digits = phone.replace(/\D/g, '');

		// Format based on length (Uganda format: 700 123 456)
		if (digits.length <= 3) return digits;
		if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
		return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const rawValue = target.value.replace(/\D/g, '');

		// Limit to 9 digits for Uganda
		const limitedValue = rawValue.slice(0, 9);
		value = limitedValue;

		// Update display with formatting
		target.value = formatPhoneNumber(limitedValue);

		dispatch('change', countryCode + limitedValue);
	}

	function handleFocus() {
		focused = true;
	}

	function handleBlur() {
		focused = false;
	}

	function toggleCountryDropdown() {
		isCountryDropdownOpen = !isCountryDropdownOpen;
	}

	function selectCountry(code: string) {
		countryCode = code;
		isCountryDropdownOpen = false;
		dispatch('change', countryCode + value);
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			isCountryDropdownOpen = false;
		}
	}

	function validatePhone(): boolean {
		if (!value) return true;

		// Uganda phone numbers should be 9 digits
		if (countryCode === '+256') {
			return /^[0-9]{9}$/.test(value);
		}

		// Basic validation for other countries
		return value.length >= 7;
	}

	$: hasError = !!error || (value && !validatePhone());
	$: selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];
	$: formattedDisplay = value ? formatPhoneNumber(value) : '';
</script>

<svelte:window on:click={handleClickOutside} />

<div class="phone-input-wrapper">
	{#if label}
		<label for={label}>
			{label}
		</label>
	{/if}

	<div class="phone-input-container" class:focused class:error={hasError}>
		<div bind:this={dropdownElement} class="country-selector">
			<button type="button" class="country-button" on:click={toggleCountryDropdown}>
				<span class="flag">{selectedCountry.flag}</span>
				<span class="code">{countryCode}</span>
				<Icon name={isCountryDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} />
			</button>

			{#if isCountryDropdownOpen}
				<div class="country-dropdown">
					{#each countryCodes as country}
						<button
							type="button"
							class="country-option"
							class:selected={country.code === countryCode}
							on:click={() => selectCountry(country.code)}
						>
							<span class="flag">{country.flag}</span>
							<span class="country-info">
								<span class="country-name">{country.country}</span>
								<span class="country-code">{country.code}</span>
							</span>
							{#if country.code === countryCode}
								<Icon name="check" size={16} />
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<input
			type="tel"
			{placeholder}
			value={formattedDisplay}
			id={label}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:keydown
		/>
	</div>

	{#if error}
		<span class="error-message">{error}</span>
	{:else if value && !validatePhone()}
		<span class="error-message">Invalid phone number format</span>
	{:else}
		<span class="hint-text">
			{#if countryCode === '+256'}
				Enter 9-digit number (e.g., 700 123 456)
			{:else}
				Enter phone number
			{/if}
		</span>
	{/if}
</div>

<style>
	.phone-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.phone-input-container {
		position: relative;
		display: flex;
		align-items: center;
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.phone-input-container:hover {
		border-color: var(--border-hover);
	}

	.phone-input-container.focused {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.phone-input-container.error {
		border-color: var(--error-color);
	}

	.phone-input-container.error.focused {
		box-shadow: 0 0 0 3px var(--error-color-alpha);
	}

	.country-selector {
		position: relative;
		border-right: 1px solid var(--border-color);
	}

	.country-button {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.75rem 0.625rem;
		background: transparent;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9375rem;
	}

	.country-button:hover {
		background-color: var(--hover-bg);
	}

	.flag {
		font-size: 1.25rem;
		line-height: 1;
	}

	.code {
		font-weight: 500;
		min-width: 2.5rem;
	}

	.country-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		background-color: var(--dropdown-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 200px;
		overflow: hidden;
	}

	.country-option {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: transparent;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.country-option:hover {
		background-color: var(--hover-bg);
	}

	.country-option.selected {
		background-color: var(--primary-color-alpha);
		color: var(--primary-color);
	}

	.country-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.country-name {
		font-size: 0.875rem;
		font-weight: 500;
	}

	.country-code {
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	input {
		flex: 1;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background: transparent;
		border: none;
		outline: none;
	}

	input::placeholder {
		color: var(--text-tertiary);
	}

	.error-message {
		font-size: 0.8125rem;
		color: var(--error-color);
		margin-top: -0.25rem;
	}

	.hint-text {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin-top: -0.25rem;
	}

	/* Dark mode adjustments */
	:global(.dark) .phone-input-container {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .phone-input-container:hover {
		border-color: var(--dark-border-hover);
	}

	:global(.dark) .country-selector {
		border-right-color: var(--dark-border-color);
	}

	:global(.dark) .country-button:hover {
		background-color: var(--dark-hover-bg);
	}

	:global(.dark) .country-dropdown {
		background-color: var(--dark-dropdown-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .country-option:hover {
		background-color: var(--dark-hover-bg);
	}

	:global(.dark) input {
		color: var(--dark-text-primary);
	}

	:global(.dark) input::placeholder {
		color: var(--dark-text-tertiary);
	}
</style>
