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
const $shadowInp = $(`<input type="text" class="shadow-inp" name="searchField" style="position: sticky; width: 77px;">`);
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

            console.log(frag, node, lastNode);
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function modifyInputs() {
    $('.modal-win-text-field').find('input').each((_, el) => {
        const $current = $(el);
        const value = $current.attr('data-val');

        $current.attr('value', value);
        $current.css('width', (el.scrollWidth) + 'px');
    });
}

function addToDiv(event) {
    const emoji = $(event.target).text();
    const dataId = $(event.target).attr('data-id');
    const chatBox = document.querySelector(".modal-win-text-field");
    chatBox.focus();
    pasteHtmlAtCaret(`<input disabled type="text" class="li-elem" data-id="${dataId}" value='${emoji}'></input>`);
}

function generateEmojiIcon(emoji, key) {
    const input = document.createElement('input');
    input.type = "button";
    input.value = emoji;
    input.innerText = emoji;
    input.classList.add('innerElem');
    input.addEventListener("click", addToDiv);
    return input;
}

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
    setTimeout(() => {
        modifyInputs();
    }, 0);
});

$keyboardImg.on('click', function () {
    if ($($keyboard).hasClass('keyboardShortcut-active')) {
        $($keyboard).removeClass('keyboardShortcut-active');
    } else {
        $($keyboard).addClass('keyboardShortcut-active');
    }
});

$(document).on('click', function (e) {
    if (!$keyboardImg.is(e.target) && !$body.is(e.target) && $body.has(e.target).length === 0) {
        $keyboard.removeClass('keyboardShortcut-active');
    };
});

for (const key in masDropMenu) {
    for (const value in masDropMenu[key]) {
        const val = value.replace('|', ' → ');
        $('.dropMenu-nav').append(generateEmojiIcon(val, key));
    }
}

//Подгон дроп меню к блоку с кареткой
// let resizeObserver = new ResizeObserver(function (param) {
//     try {
//         let sizeSpace = $('.shadow-inp').css('top').slice(0, -2);
//         $dropMenu.css('top', `${sizeSpace - 190}px`);
//         $('.shadow-inp').css('position', 'sticky');
//     } catch (error) {}
// });