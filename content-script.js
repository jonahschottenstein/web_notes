const getSelection = () => window.getSelection();

const getRange = (selection) => {
	let rangeArray = [];

	for (let i = 0; i < selection.rangeCount; i++) {
		rangeArray[i] = selection.getRangeAt(i);
	}

	return rangeArray;
};

const createNewRange = (startNode, startOffset, endNode, endOffset) => {
	const newRange = document.createRange();
	newRange.setStart(startNode, startOffset);
	newRange.setEnd(endNode, endOffset);
	return newRange;
};

const getEndOffset = (initialRange) => {
	const endOffset =
		initialRange.startContainer.nodeType === Node.TEXT_NODE ||
		initialRange.startContainer.nodeType === Node.COMMENT_NODE ||
		initialRange.startContainer.nodeType === Node.CDATA_SECTION_NODE
			? initialRange.startContainer.textContent.length
			: initialRange.startContainer.childNodes.length;
	return endOffset;
};

const createStyledSpan = (backgroundColor) => {
	const span = document.createElement("span");
	span.style.backgroundColor = backgroundColor;
	return span;
};

const highlightText = (span, range) => {
	span.appendChild(range.extractContents());
	return span;
};

const insertHighlight = (range, span) => range.insertNode(span);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(message, sender, sendResponse);

	const initialSelection = getSelection();
	const initialRange = getRange(initialSelection)[0];
	const initialStartContainer = initialRange.startContainer;
	const initialEndContainer = initialRange.endContainer;

	let span = createStyledSpan("red");
	highlightText(span, initialRange);
	insertHighlight(initialRange, span);
});
