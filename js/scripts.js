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

function checkBoxAction() {
    let boxes = document.getElementsByClassName("rowchecker");
    for(let i = 0; i < boxes.length; i ++) {
        let item = boxes[i];
        let taskText = item.closest("div.rowwrapper").getElementsByClassName("tasktext")[0];
        if(item.checked) {
            addClass(taskText, "jobdone");
        } else {
            removeClass(taskText, "jobdone");
        }
        item.onclick = function() {
            if(item.checked) {
                addClass(taskText, "jobdone");
            } else {
                removeClass(taskText, "jobdone");
            }
        }
    }
}

function focusAction() {
    let textLines = document.getElementsByClassName("tasktext");
    for(let i = 0; i < textLines.length; i ++) {
        let item = textLines[i];
        item.onclick = function() {
            let lines = document.getElementsByClassName("tasktext");
            for(let j = 0; j < lines.length; j ++) {
                removeClass(lines[j].closest("div.rowwrapper"), "focus");
            }
            addClass(item.closest("div.rowwrapper"), "focus");
        }
    }
}

function main() {
    checkBoxAction();
    focusAction();
}

main();
