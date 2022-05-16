'use strict';
// $(document).ready(function() {
// const $wrap = $(`makeroi-contenteditable-input-{{ id }}`);
const $textInsert = $('.modal-win-text-field');
const $dropMenu = $('.dropMenu');
const $dropMenuNav = $('.dropMenu-nav');
const $outData = $('#out-data');
const $keyboard = $('.keyboardShortcut');
const $body = $('body');
const $keyboardImg = $('.keyboard');
const $textField = ('<p class="text-field">&nbsp;</p>');
let focusElement = $('');

$body.on('keydown', function (e) {
    if (e.key === 'Escape') {
        $('.dropMenu').addClass('active');
        $('.keyboardShortcut').removeClass('keyboardShortcut-active');
    }
})

$textInsert.on('keydown', function (e) {
    if (e.key === 'Enter') {
        // e.preventDefault();
    }
    if (e.key === '[') {
        e.preventDefault();
        $('.dropMenu').removeClass('active');
    }
});

$dropMenu.on('click', '.innerElem', function (e) {
    $dropMenu.addClass('active');
});

function pasteHtmlAtCaret(html) {
    let sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            const el = document.createElement("div");
            el.innerHTML = html;
            let frag = document.createDocumentFragment(),
                node,
                lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function addToDiv(event) {
    const emoji = $(event.target).text();
    const dataId = $(event.target).attr('data-id');
    const chatBox = document.querySelector(".modal-win-text-field");
    chatBox.focus();
    pasteHtmlAtCaret(`<input disabled type="text" class="li-elem" data-id="${dataId}" value='${emoji}'></input>`);
}

function generateEmojiIcon(emoji) {
    // const input = $(`<input type='button' value='${emoji}' class='dropMenu-elem'>${emoji}</input>`)[0];
    const input = document.createElement("input");
    input.type = "button";
    input.value = emoji;
    input.innerText = emoji;
    // dropMenu-elem dropMenu-elem-hover innerElem
    input.addEventListener("click", addToDiv);
    return input;
}
const masDropMenu = {
    Сделка: {
        'Сделка|Ответственный': '{{lead.responsible.name}}',
        'Сделка|Бюджет': '{{lead.price}}',
    },
    Контакт: {
        'Контакт|Ответственный': '{{contact.responsible.name}}',
        'Контакт|Имя': '{{contact.name}}',
        'Контакт|Почта': '{{contact.email}}',
        'Контакт|Телефон': '{{contact.phone}}'
    },
    Компания: {
        'Компания|Ответственный': '{{company.responsible.name}}',
        'Компания|Название': '{{company.name}}',
        'Компания|Почта': '{{company.email}}',
        'Компания|Телефон': '{{company.phone}}'
    },
    Системное: {
        'Покупатель|Ответственный': '{{customer.responsible.name}}'
    }
}


for (const key in masDropMenu) {
    //Убрать класс dropMenu-elem, если не нужно их искать в живой сортировке
    // const liMain = $(`<li class="dropMenu-elem-color dropMenu-elem" data-id=${key}>  ${key}</li>`);
    // const ulEl = $('<ul></ul>')
    for (const value in masDropMenu[key]) {
        const val = value.replace('|', ' → ');
        // var liInner = $(`<li class="dropMenu-elem dropMenu-elem-hover innerElem" data-id=${masDropMenu[key][value]}>${val}</li>`);
        // ulEl.append(liInner);
        // liInner.on("click", addToDiv);
        document.querySelector(".dropMenu-nav").appendChild(generateEmojiIcon(val));
    }
    // liMain.append(ulEl);
    // $dropMenuNav.append(liMain);
}