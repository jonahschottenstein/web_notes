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

/* const createStyledSpan = (backgroundColor) => {
	const span = document.createElement("span");
	span.classList.add("web-notes-highlight");
	span.style.backgroundColor = backgroundColor;
	return span;
}; */
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

/* const setHighlight = (range) => {
	let span = createStyledSpan("red");
	highlightText(span, range);
	insertHighlight(range, span);
}; */
const setHighlight = (range, spanClass) => {
	let span = createStyledSpan("red", spanClass);
	highlightText(span, range);
	insertHighlight(range, span);
};

let intersectingNodes = [];
const getIntersectingTextNodes = (node, initialRange) => {
	for (let i = 0; i < node.childNodes.length; i++) {
		let child = node.childNodes[i];
		if (
			child.nodeType === 1 &&
			window.getComputedStyle(child).display === "none"
		) {
			continue;
		}
		if (child.nodeType === 3 && initialRange.intersectsNode(child)) {
			intersectingNodes.push(child);
		} else {
			getIntersectingTextNodes(child, initialRange);
		}
	}
	return intersectingNodes;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	const initialSelection = getSelection();
	const initialRange = getRange(initialSelection)[0];
	const initialStartContainer = initialRange.startContainer;
	const initialEndContainer = initialRange.endContainer;

	let intersectingTextNodes = getIntersectingTextNodes(
		initialRange.commonAncestorContainer,
		initialRange
	);
	let startRange = createNewRange(
		initialStartContainer,
		initialRange.startOffset,
		initialStartContainer,
		initialStartContainer.textContent.length
	);
	let endRange = createNewRange(
		initialEndContainer,
		0,
		initialEndContainer,
		initialRange.endOffset
	);

	if (initialStartContainer === initialEndContainer) {
		setHighlight(initialRange);
	} else {
		console.log(intersectingTextNodes);

		intersectingTextNodes.forEach((textNode, index, array) => {
			if (index === 0) {
				setHighlight(startRange);
			} else if (index === array.length - 1) {
				setHighlight(endRange);
			} else {
				let newTextRange = document.createRange();
				newTextRange.selectNode(textNode);
				setHighlight(newTextRange);
			}
		});
	}
	initialSelection.removeAllRanges();
	intersectingTextNodes.length = 0;
});
