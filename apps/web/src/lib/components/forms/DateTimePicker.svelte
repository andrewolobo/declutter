<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	export let value: Date | null = null;
	export let minDate: Date | undefined = undefined;
	export let maxDate: Date | undefined = undefined;
	export let label: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let showTime: boolean = false;

	const dispatch = createEventDispatcher();

	let isOpen = false;
	let pickerElement: HTMLDivElement;
	let currentMonth: Date = value ? new Date(value) : new Date();
	let selectedHour = value ? value.getHours() : 12;
	let selectedMinute = value ? value.getMinutes() : 0;

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function togglePicker() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (pickerElement && !pickerElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	function getDaysInMonth(date: Date): Date[] {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days: Date[] = [];

		// Add previous month's days to fill the week
		for (let i = 0; i < startingDayOfWeek; i++) {
			const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
			days.push(prevDate);
		}

		// Add current month's days
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(new Date(year, month, i));
		}

		// Add next month's days to fill the grid
		const remainingDays = 42 - days.length; // 6 weeks * 7 days
		for (let i = 1; i <= remainingDays; i++) {
			days.push(new Date(year, month + 1, i));
		}

		return days;
	}

	function selectDate(date: Date) {
		if (isDateDisabled(date)) return;

		if (showTime) {
			value = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				selectedHour,
				selectedMinute
			);
		} else {
			value = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			isOpen = false;
		}

		dispatch('change', value);
	}

	function isDateDisabled(date: Date): boolean {
		if (minDate && date < minDate) return true;
		if (maxDate && date > maxDate) return true;
		return false;
	}

	function isToday(date: Date): boolean {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	}

	function isSelected(date: Date): boolean {
		if (!value) return false;
		return (
			date.getDate() === value.getDate() &&
			date.getMonth() === value.getMonth() &&
			date.getFullYear() === value.getFullYear()
		);
	}

	function isCurrentMonth(date: Date): boolean {
		return date.getMonth() === currentMonth.getMonth();
	}

	function previousMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
	}

	function updateTime() {
		if (value) {
			value = new Date(
				value.getFullYear(),
				value.getMonth(),
				value.getDate(),
				selectedHour,
				selectedMinute
			);
			dispatch('change', value);
		}
	}

	function formatDisplayValue(): string {
		if (!value) return '';

		const dateStr = value.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		if (showTime) {
			const timeStr = value.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit'
			});
			return `${dateStr} ${timeStr}`;
		}

		return dateStr;
	}

	$: days = getDaysInMonth(currentMonth);
	$: displayValue = formatDisplayValue();
	$: hasError = !!error;
</script>

<svelte:window on:click={handleClickOutside} />

<div class="datetime-picker-wrapper">
	{#if label}
		<label for="datetime-{label}">{label}</label>
	{/if}

	<div bind:this={pickerElement} class="picker-container" class:error={hasError}>
		<button type="button" id="datetime-{label}" class="picker-trigger" on:click={togglePicker} class:placeholder={!value}>
			<span>{value ? displayValue : 'Select date'}</span>
			<Icon name="calendar" size={20} />
		</button>

		{#if isOpen}
			<div class="picker-dropdown">
				<div class="calendar">
					<div class="calendar-header">
						<button type="button" class="nav-button" on:click={previousMonth}>
							<Icon name="chevron-left" size={20} />
						</button>
						<span class="month-year">
							{monthNames[currentMonth.getMonth()]}
							{currentMonth.getFullYear()}
						</span>
						<button type="button" class="nav-button" on:click={nextMonth}>
							<Icon name="chevron-right" size={20} />
						</button>
					</div>

					<div class="calendar-grid">
						{#each dayNames as dayName}
							<div class="day-name">{dayName}</div>
						{/each}

						{#each days as day}
							<button
								type="button"
								class="day"
								class:other-month={!isCurrentMonth(day)}
								class:today={isToday(day)}
								class:selected={isSelected(day)}
								class:disabled={isDateDisabled(day)}
								on:click={() => selectDate(day)}
								disabled={isDateDisabled(day)}
							>
								{day.getDate()}
							</button>
						{/each}
					</div>
				</div>

				{#if showTime}
					<div class="time-picker">
						<div class="time-inputs">
							<div class="time-input-group">
								<label for="hour">Hour</label>
								<input
									id="hour"
									type="number"
									min="0"
									max="23"
									bind:value={selectedHour}
									on:change={updateTime}
								/>
							</div>
							<span class="time-separator">:</span>
							<div class="time-input-group">
								<label for="minute">Minute</label>
								<input
									id="minute"
									type="number"
									min="0"
									max="59"
									bind:value={selectedMinute}
									on:change={updateTime}
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.datetime-picker-wrapper {
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

	.picker-container {
		position: relative;
	}

	.picker-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		outline: none;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.picker-trigger:hover {
		border-color: var(--border-hover);
	}

	.picker-trigger.placeholder {
		color: var(--text-tertiary);
	}

	.picker-container.error .picker-trigger {
		border-color: var(--error-color);
	}

	.picker-dropdown {
		position: absolute;
		top: calc(100% + 0.25rem);
		left: 0;
		background-color: var(--dropdown-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 300px;
		overflow: hidden;
	}

	.calendar {
		padding: 1rem;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.nav-button {
		padding: 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-button:hover {
		background-color: var(--hover-bg);
	}

	.month-year {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
	}

	.day-name {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-tertiary);
		text-align: center;
		padding: 0.5rem;
	}

	.day {
		aspect-ratio: 1;
		padding: 0.5rem;
		font-size: 0.875rem;
		background: transparent;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.day:hover:not(:disabled) {
		background-color: var(--hover-bg);
	}

	.day.other-month {
		color: var(--text-tertiary);
		opacity: 0.5;
	}

	.day.today {
		font-weight: 600;
		color: var(--primary-color);
	}

	.day.selected {
		background-color: var(--primary-color);
		color: white;
	}

	.day.disabled {
		color: var(--text-disabled);
		cursor: not-allowed;
		opacity: 0.3;
	}

	.time-picker {
		padding: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.time-inputs {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.time-input-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.time-input-group label {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin: 0;
	}

	.time-input-group input {
		width: 60px;
		padding: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary);
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		text-align: center;
	}

	.time-separator {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 1.25rem;
	}

	.error-message {
		font-size: 0.8125rem;
		color: var(--error-color);
		margin-top: -0.25rem;
	}

	/* Dark mode adjustments */
	:global(.dark) .picker-trigger {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
		color: var(--dark-text-primary);
	}

	:global(.dark) .picker-dropdown {
		background-color: var(--dark-dropdown-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .time-picker {
		border-color: var(--dark-border-color);
	}

	:global(.dark) .time-input-group input {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
		color: var(--dark-text-primary);
	}
</style>
