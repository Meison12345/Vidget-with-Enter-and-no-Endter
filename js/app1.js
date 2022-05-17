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
const $shadowInp = $(`<input type="text" class="shadow-inp" name="searchField">`);
const masColor = ['#CCC8F7', '#DCECFF', '#FFF3B4', '#EBFFB5'];
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


let lastActiveNode;

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
            $('.shadow-inp').focus();
            // console.log(el, el.firstChild, frag, node, lastNode);
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
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function modifyInputs() {
    $('.modal-win-text-field').find('.li-elem').each((_, el) => {
        const $current = $(el);
        // const value = $current.attr('data-val');
        $current.css('width', 0);
        // $current.attr('value', value);
        // console.log($current.css('width'));
        console.log(el.scrollWidth);

        $current.css('width', (el.scrollWidth) + 'px');
    });
}
/**
 * @description Живой поиск принажатии на '[' 
 */
function liveSearch() {
    $textInsert.on('keydown', function (e) {
        let value = $('.shadow-inp').val();
        let list = $('.innerElem');
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

function addToDiv(event) {
    const emoji = $(event.target).text();
    const dataId = $(event.target).attr('data-id');
    const chatBox = document.querySelector(".modal-win-text-field");
    // chatBox.focus();
    pasteHtmlAtCaret(`<input disabled type="text" class="li-elem" data-id="${dataId}" value='${emoji}'></input>`);
}

function generateEmojiIcon(emoji) {
    const input = document.createElement('input');
    let liElem = document.createElement('li');
    liElem.classList.add('inp-wrapper');
    liElem.append(input);
    input.type = "button";
    input.value = emoji;
    input.innerText = emoji;
    input.classList.add('innerElem');
    input.addEventListener("click", addToDiv);
    return liElem;
}

$body.on('keydown', function (e) {
    if (e.key === 'Escape') {
        $('.dropMenu').addClass('active');
        $('.keyboardShortcut').removeClass('keyboardShortcut-active');
        $('.shadow-inp').remove();
    }
})

$textInsert.on('keydown', function (e) {
    modifyInputs(); // Не работает
    if (e.key === 'Enter') {
        // e.preventDefault();
    }
    if (e.key === '[') {
        e.preventDefault();
        $('.dropMenu').removeClass('active');
        if (($('.shadow-inp').length < 1)) {
            let sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();

                    const el = document.createElement("div");
                    // el.classList.add('shadow-inp');
                    el.type = "text";
                    el.innerHTML = `<input type="text" class="shadow-inp" name="searchField">`
                    let frag = document.createDocumentFragment(),
                        node,
                        lastNode;
                    //
                    // console.log(el);
                    // $('.shadow-inp').focus();

                    //

                    while ((node = el.firstChild)) {
                        if (node !== $('.shadow-inp')[0]) {
                            lastNode = frag.appendChild(node);
                        }
                    }
                    range.insertNode(frag);

                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    $('.shadow-inp').focus();
                    setTimeout(() => {
                        liveSearch();
                        resizeObserver.observe($shadowInp[0]);
                    }, 0);
                }
            } else if (document.selection && document.selection.type != "Control") {
                document.selection.createRange().pasteHTML(html);
            }

        }
    }
    // $('.shadow-inp').focus();
    // liveSearch();
});

$dropMenu.on('click', '.innerElem', function (e) {
    $dropMenu.addClass('active');
    $('.shadow-inp').remove();
    modifyInputs()
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
    if ($('.shadow-inp').is(":focus") === false) {
        $('.shadow-inp').remove();
        $dropMenu.addClass('active');
    }
});

for (const key in masDropMenu) {
    $('.dropMenu-nav').append(generateHeaderTitle(key));
    for (const value in masDropMenu[key]) {
        const val = value.replace('|', ' → ');

        $('.dropMenu-nav').append(generateEmojiIcon(val));
    }
}



function generateHeaderTitle(key) {
    let input = document.createElement('input');
    let liElem = document.createElement('li');
    liElem.classList.add('inp-wrapper', 'inp-wrapper-color');
    liElem.append(input);
    input.type = "text";
    input.value = key;
    input.innerText = key;
    input.classList.add('dropMenu-elem-color');
    input.classList.add('innerElem');
    return liElem;
}

//Подгон дроп меню к блоку с кареткой
let resizeObserver = new ResizeObserver(function (param) {
    try {
        let sizeSpace = $('.shadow-inp').css('top').slice(0, -2);
        $dropMenu.css('top', `${sizeSpace - 190}px`);
        $('.shadow-inp').css('position', 'sticky');
    } catch (error) {}
});