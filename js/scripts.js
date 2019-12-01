function hasClass(element, c) {
    return element.classList.contains(c);
}

function removeClass(element, c) {
    // check if element has class
    if(hasClass(element, c)) {
        element.classList.remove(c);
    } else { // already moved
        return;
    }
}

function addClass(element, c) {
    // check if element has class already
    if(hasClass(element, c)) {
        return;
    } else {
        element.classList.add(c);
    }
}

function isTextEmpty(cb) {
    if(cb.value.length === 0) {
        return true;
    } else {
        return false;
    }
}

function swapRow(row1, row2) {
    row1.parentElement.insertBefore(row2, row1);
}

function getNextEntry(cb) {
    let nextRow = cb.closest("div.rowwrapper").nextElementSibling;
    if(nextRow === null) {
        return null;
    } else {
        return nextRow.getElementsByClassName("tasktext")[0];
    }
}

function getPrevEntry(cb) {
    let prevRow = cb.closest("div.rowwrapper").previousElementSibling;
    if(prevRow === null) {
        return null;
    } else {
        return prevRow.getElementsByClassName("tasktext")[0];
    }
}

function getFocusItem() {
    let lines = document.getElementsByClassName("rowwrapper");
    for(let i = 0; i < lines.length; i ++) {
        if(hasClass(lines[i], "focus")) {
            return lines[i];
        }
    }
    return null;
}

function moveFocus(targetEntry) {
    let lines = document.getElementsByClassName("tasktext");
    for(let j = 0; j < lines.length; j ++) {
        removeClass(lines[j].closest("div.rowwrapper"), "focus");
    }
    addClass(targetEntry.closest("div.rowwrapper"), "focus");
    targetEntry.focus();
}

function moveUp(targetEntry) {
    let prevEntry = getPrevEntry(targetEntry);
    if(prevEntry !== null) {
        let prevRow = prevEntry.closest("div.rowwrapper");
        let curRow = targetEntry.closest("div.rowwrapper");
        swapRow(prevRow, curRow);
        targetEntry.focus();
    }
}

function moveDown(targetEntry) {
    let nextEntry = getNextEntry(targetEntry);
    if(nextEntry !== null) {
        let nextRow = nextEntry.closest("div.rowwrapper");
        let curRow = targetEntry.closest("div.rowwrapper");
        swapRow(curRow, nextRow);
    }
}

function insertRow(rowBefore) {
    let rowWrapperBefore = rowBefore.closest("div.rowwrapper");
    let newItemHtml = '<div class="rowwrapper focus"> <label class="rowhandle"><input type="checkbox" class="rowchecker"></input></label> <input type="text" class="tasktext"></input></div>';
    rowWrapperBefore.insertAdjacentHTML('afterend', newItemHtml);
    let nextEntry = getNextEntry(rowBefore);
    if(nextEntry !== null) { // shouldn't be null here.
        addElementKBAction(nextEntry);
        addCheckBoxAction(nextEntry);
        addFocusAction(nextEntry);
        moveFocus(nextEntry);
    }
}

function deleteRow(targetRow) {
    let prevEntry = getPrevEntry(targetRow);
    if(prevEntry !== null) {
        targetRow.closest("div.rowwrapper").remove();
        moveFocus(prevEntry);
        // move cursor to the end of previous row
        prevEntry.selectionStart = prevEntry.selectionEnd = prevEntry.value.length;
    }
}

// Add keyboard navigation actions to an element
function addElementKBAction(txt) {
    txt.addEventListener("keydown", event => {
        if(event.ctrlKey && event.keyCode === 38) { // 'Ctrl+Up'
            moveUp(txt);
        } else if(event.ctrlKey && event.keyCode === 40) { // 'Ctrl+Down'
            moveDown(txt);
        } else if(event.keyCode === 40) { // 'Down'
            // get the down neighbor of txt, could be empty
            let nextEntry = getNextEntry(txt);
            if(nextEntry !== null) { // Move focus to the next entry
                moveFocus(nextEntry);
            }
        } else if(event.keyCode === 38) { // 'Up'
            // get the up neighbor of txt, could be empty
            let prevEntry = getPrevEntry(txt);
            if(prevEntry !== null) { // Move focus to the previous entry
                moveFocus(prevEntry);
            }
        } else if(event.keyCode === 13) { // 'Enter'
            // create a new entry and bind the events
            insertRow(txt);
        } else if(event.keyCode === 8 && isTextEmpty(txt)) {
            // remove the entry
            deleteRow(txt);
            event.preventDefault(); // Don't delete the last char on the previous row
        } else if(event.shiftKey && event.keyCode === 9) { // TODO: 'Shift + Tab'
            moveLeft(txt);
            event.preventDefault();
        } else if(event.keyCode === 9) { // TODO: 'Tab'
            moveRight(txt);
            event.preventDefault();
        }
    });
}

// Add actions to checkboxes
function addCheckBoxAction(cb) {
    let taskText = cb.closest("div.rowwrapper").getElementsByClassName("tasktext")[0];
    if(cb.checked) {
        addClass(taskText, "jobdone");
    } else {
        removeClass(taskText, "jobdone");
    }
    cb.onclick = function() {
        if(cb.checked) {
            addClass(taskText, "jobdone");
        } else {
            removeClass(taskText, "jobdone");
        }
    }
}

function addFocusAction(cb) {
    cb.onclick = function() {
        moveFocus(cb);
    };
}

function checkBoxAction() {
    let boxes = document.getElementsByClassName("rowchecker");
    for(let i = 0; i < boxes.length; i ++) {
        let item = boxes[i];
        addCheckBoxAction(item);
    }
}

function focusAction() {
    let textLines = document.getElementsByClassName("tasktext");
    for(let i = 0; i < textLines.length; i ++) {
        let item = textLines[i];
        addFocusAction(item);
    }
}

function textKBAction() {
    let textLines = document.getElementsByClassName("tasktext");
    for(let i = 0; i < textLines.length; i ++) {
        addElementKBAction(textLines[i]);
    }
}

function initButtons() {
    let newList = document.getElementById("newlist");
    let newItem = document.getElementById("newitem");
    let upBtn = document.getElementById("moveup");
    let downBtn = document.getElementById("movedown");
    let leftBtn = document.getElementById("moveleft");
    let rightBtn = document.getElementById("moveright");
    
    // newItem Button
    newItem.onclick = function() {
        let cur = getFocusItem();
        if(cur !== null) {
            insertRow(cur);
        }
    };

    // MoveUp Button
    upBtn.onclick = function() {
        let cur = getFocusItem();
        if(cur !== null) {
            moveUp(cur); 
        }
    };

    // MoveDown Button
    downBtn.onclick = function() {
        let cur = getFocusItem();
        if(cur !== null) {
            moveDown(cur);
        }
    };
}

function init() {
    let taskRows = document.getElementsByClassName("taskrows")[0];
    let childCount = taskRows.childElementCount;
    if(childCount !== 0) { // has at least one child
        let firstTask = taskRows.children[0].getElementsByClassName("tasktext")[0];
        firstTask.focus();
    }
    initButtons();
}

function main() {
    checkBoxAction();
    focusAction();
    textKBAction();
    init();
}

main();
