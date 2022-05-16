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

// | заменять на →
const masDropMenu2 = {
    lead: {
        'Сделка|Ответственный': '{{lead.responsible.name}}',
        'Сделка|Бюджет': '{{lead.price}}',
    },
    contact: {
        'Контакт|Ответственный': '{{contact.responsible.name}}',
        'Контакт|Имя': '{{contact.name}}',
        'Контакт|Почта': '{{contact.email}}',
        'Контакт|Телефон': '{{contact.phone}}'
    },
    company: {
        'Компания|Ответственный': '{{company.responsible.name}}',
        'Компания|Название': '{{company.name}}',
        'Компания|Почта': '{{company.email}}',
        'Компания|Телефон': '{{company.phone}}'
    },
    customer: {
        'Покупатель|Ответственный': '{{customer.responsible.name}}'
    }
}


function liveSearch() {
    $textInsert.on('keyup', function (e) {
        let value = searchField[0].value;
        let list = $('.dropMenu-elem');
        if (value != '') {
            list.each(function (par, elem) {
                if ($(elem).text().toLowerCase().search(value) == -1) {
                    $(elem).addClass('hide');
                } else {
                    $(elem).removeClass('hide');
                }
            });
        } else {
            list.each(function (par, elem) {
                $(elem).removeClass('hide');
            });
        }
    });
}

$body.on('keydown', function (e) {
    if (e.key === 'Escape') {
        $('.dropMenu').addClass('active');
        $('.keyboardShortcut').removeClass('keyboardShortcut-active');
    }
})

$textInsert.on('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
    if (e.key === '[') {
        e.preventDefault();
        $('.dropMenu').removeClass('active');
    }
});

$dropMenu.on('click', '.innerElem', function (e) {
    $dropMenu.addClass('active');  
})

function pasteHtmlAtCaret(html) {
    let sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            const el = document.createElement("div");
            el.innerHTML = html;
            console.log(el);
            let frag = document.createDocumentFragment(),
                node,
                lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        document.selection.createRange().pasteHTML(html);
    }
}

function addToDiv(event) {
    const emoji = $(event.target).text();
    const dataId = $(event.target).attr('data-id');
    const chatBox = document.querySelector('.modal-win-text-field');
    chatBox.focus();
    // liveSearch();
    pasteHtmlAtCaret(`<input disabled type="text" class="li-elem" data-id="${dataId}">${emoji}</input>`);

    chatBox.focus();
}

(function generateEmojiIcon(emoji) {
    for (const key in masDropMenu2) {
        //Убрать класс dropMenu-elem, если не нужно их искать в живой сортировке
        const liMain = $(`<li class="dropMenu-elem-color dropMenu-elem" data-id=${key}>  ${key}</li>`);
        const ulEl = $('<ul></ul>')
        for (const value in masDropMenu2[key]) {
            const val = value.replace('|', ' → ');
            var liInner = $(`<li class="dropMenu-elem dropMenu-elem-hover innerElem" data-id=${masDropMenu2[key][value]}>${val}</li>`);
            ulEl.append(liInner);
            liInner.on("click", addToDiv);
        }
        liMain.append(ulEl);
        $dropMenuNav.append(liMain);
    }
}());