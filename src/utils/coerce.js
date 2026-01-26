/**
 * Convert attribute strings into usable values. It supports
 * booleans, numbers, JSON, and falls back to the raw string
 * when no safe conversion applies.
 *
 * @param {string} value The raw attribute value
 * @return {any} The coerced boolean, number, object, or string
 */
export default function coerce(value) {
	//
	// Handle blank values.
	//
	if(value === "") {
		return true;
	}

	//
	// Handle false string.
	//
	if(value === "false") {
		return false;
	}
	
	//
	// Handle true string.
	//
	if(value === "true") {
		return true;
	}
	
	//
	// Handle numbers.
	//
	if(isNaN(value) == false && value.trim() !== "") {
		return Number(value);
	}

	//
	// Handle JSON.
	//
    try { return JSON.parse(value); } catch {}

	//
	// Return value.
	//
    return value;
}
