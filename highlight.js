const createStyledSpan = (backgroundColor, spanClass) => {
	const span = document.createElement("span");
	span.classList.add("web-notes-highlight", spanClass);
	span.style.backgroundColor = backgroundColor;
	return span;
};

const highlightText = (span, range) => {
	span.appendChild(range.extractContents());
	return span;
};

const insertHighlight = (range, span) => range.insertNode(span);

const setHighlight = (range, spanClass) => {
	let span = createStyledSpan("red", spanClass);
	highlightText(span, range);
	insertHighlight(range, span);
};

const getHighlights = () => {
	return document.querySelectorAll(".web-notes-highlight");
};

export { setHighlight, getHighlights };
