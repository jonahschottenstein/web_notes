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

const getNumberedClass = (highlight) => {
	return highlight.className
		.split(" ")
		.find((className) => /web-notes-highlight-/.test(className));
};

const getNumbersArray = (highlights) => {
	let numbersArray = [];
	highlights.forEach((highlight) => {
		let numberedClass = getNumberedClass(highlight);
		console.log("numberedClass", numberedClass);
		numbersArray.push(numberedClass[numberedClass.length - 1]);
	});
	return numbersArray;
};

const getMaxArrayNumber = (numbersArray) => {
	return numbersArray.reduce((a, b) => Math.max(a, b), -Infinity);
};

const createNumberedClass = (highlights, number) => {
	return highlights.length === 0
		? "web-notes-highlight-1"
		: `web-notes-highlight-${number}`;
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

	let highlights = getHighlights();
	console.log("highlights", highlights);
	let numbersArray = getNumbersArray(highlights);
	console.log("numbersArray", numbersArray);
	let maxArrayNumber = getMaxArrayNumber(numbersArray);
	console.log("reduce", getMaxArrayNumber(numbersArray));
	let numberedClass = createNumberedClass(highlights, maxArrayNumber + 1);
	console.log("numberedClass", numberedClass);

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
		setHighlight(initialRange, numberedClass);
	} else {
		console.log(intersectingTextNodes);

		intersectingTextNodes.forEach((textNode, index, array) => {
			if (index === 0) {
				setHighlight(startRange, numberedClass);
			} else if (index === array.length - 1) {
				setHighlight(endRange, numberedClass);
			} else {
				let newTextRange = document.createRange();
				newTextRange.selectNode(textNode);
				setHighlight(newTextRange, numberedClass);
			}
		});
	}
	initialSelection.removeAllRanges();
	intersectingTextNodes.length = 0;
});
