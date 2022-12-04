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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(message, sender, sendResponse);

	const initialSelection = getSelection();
	const initialRange = getRange(initialSelection)[0];
	const initialStartContainer = initialRange.startContainer;
	const initialEndContainer = initialRange.endContainer;
});
