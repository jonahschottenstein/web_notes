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

const getContainerParent = (initialRange, container) =>
	[...initialRange.commonAncestorContainer.childNodes].find((node) =>
		node.contains(container)
	);

const getNodeRange = (initialRange, container) => {
	let nodeParent = [...initialRange.commonAncestorContainer.childNodes].find(
		(node) => node.contains(container)
	);
	return container === initialRange.startContainer
		? nodeParent.childNodes[nodeParent.childNodes.length - 1]
		: nodeParent.childNodes[0];
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
	} else {
		console.log(getNodeRange(initialRange, initialStartContainer));
		console.log(getNodeRange(initialRange, initialEndContainer));
		console.log(
			"firstRange2",
			createNewRange(
				initialStartContainer,
				initialRange.startOffset,
				getNodeRange(initialRange, initialStartContainer),
				getEndOffset(getNodeRange(initialRange, initialStartContainer))
			).toString()
		);
		console.log(
			"lastRange",
			createNewRange(
				getNodeRange(initialRange, initialEndContainer),
				0,
				initialEndContainer,
				initialRange.endOffset
			).toString()
		);
	}
});
