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

const getEndOffset = (node) => {
	const endOffset =
		node.nodeType === Node.TEXT_NODE ||
		node.nodeType === Node.COMMENT_NODE ||
		node.nodeType === Node.CDATA_SECTION_NODE
			? node.textContent.length
			: node.childNodes.length;
	return endOffset;
};

const getLastNodeFirstRange = (initialRange, initialStartContainer) => {
	const lastNodeParent = [
		...initialRange.commonAncestorContainer.childNodes,
	].find((node) => node.contains(initialStartContainer));
	return lastNodeParent.childNodes[lastNodeParent.childNodes.length - 1];
};

const createFirstRange = (initialStartContainer, initialRange) => {
	let firstRange = createNewRange(
		initialStartContainer,
		initialRange.startOffset,
		getLastNodeFirstRange(initialRange, initialStartContainer),
		getEndOffset(getLastNodeFirstRange(initialRange, initialStartContainer))
	);
	return firstRange;
};

const inSameParagraph = (commonAncestor, startContainer, endContainer) => {
	if (startContainer === endContainer) return true;
	if (
		startContainer.parentNode === commonAncestor ||
		endContainer.parentNode === commonAncestor
	)
		return true;

	if (
		startContainer.parentNode.closest("p") ===
		endContainer.parentNode.closest("p")
	)
		return true;

	return false;
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

	if (
		inSameParagraph(
			initialRange.commonAncestorContainer,
			initialStartContainer,
			initialEndContainer
		)
	) {
		let span = createStyledSpan("red");
		highlightText(span, initialRange);
		insertHighlight(initialRange, span);
	}
});
