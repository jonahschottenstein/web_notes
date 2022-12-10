const getRangeArray = (selection) => {
	let rangeArray = [];

	for (let i = 0; i < selection.rangeCount; i++) {
		rangeArray[i] = selection.getRangeAt(i);
	}

	return rangeArray;
};

const createRange = (startNode, startOffset, endNode, endOffset) => {
	const newRange = document.createRange();
	newRange.setStart(startNode, startOffset);
	newRange.setEnd(endNode, endOffset);
	return newRange;
};

export { getRangeArray, createRange };
