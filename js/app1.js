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

function modifyInputs() {
    $('.modal-win-text-field').find('.li-elem').each((_, el) => {
        const $current = $(el);
        // const value = $current.attr('data-val');
        $current.css('width', 0);
        // $current.attr('value', value);
        $current.css('width', (el.scrollWidth) + 'px');
    });
}
/**
 * @description Живой поиск принажатии на '[' 
 */
function liveSearch() {
    $textInsert.on('keyup', function (e) {
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
    pasteHtmlAtCaret(`<input disabled type="text" class="li-elem" data-id="${dataId}" value='${emoji}'></input>`);
    // chatBox.focus();
}

function generateEmojiIcon(data, dataAttr) {
    const input = document.createElement('input');
    let liElem = document.createElement('li');
    liElem.classList.add('inp-wrapper');
    liElem.append(input);
    input.type = "button";
    $(input).attr('data-id', dataAttr);
    input.value = data;
    input.innerText = data;
    input.classList.add('innerElem');
    input.addEventListener("click", addToDiv);
    return liElem;
}

$body.on('keydown', function (e) {
    if (e.key === 'Escape') {
        $dropMenu.addClass('active');
        $('.keyboardShortcut').removeClass('keyboardShortcut-active');
        $('.shadow-inp').remove();
    }
})

$textInsert.on('keydown', function (e) {
    modifyInputs();
    if ((e.key === 'Backspace' || e.key === 'Delete') && $('.shadow-inp').length >= 1 && $('.shadow-inp').val().length < 1) {
        e.preventDefault();
        $('.shadow-inp').remove();
        $dropMenu.addClass('active');
        $textInsert.focus();
    }
    if (e.key === 'Enter') {
        e.preventDefault();
    }
    if (e.key === '[') {
        e.preventDefault();
        $dropMenu.removeClass('active');
        if (($('.shadow-inp').length < 1)) {
            let sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    const el = document.createElement("div");
                    el.type = "text";
                    el.innerHTML = `<input type="text" class="shadow-inp" name="searchField" style="position:absolute;">`
                    let frag = document.createDocumentFragment(),
                        node,
                        lastNode;
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
                    // setTimeout(() => {
                    liveSearch();
                    resizeObserver.observe($('.shadow-inp')[0]);
                    // }, 0);
                }
            } else if (document.selection && document.selection.type != "Control") {
                document.selection.createRange().pasteHTML(html);
            }
        }
    }
});

$dropMenu.on('click', '.innerElem', function (e) {
    const $current = e.currentTarget;
    $dropMenu.addClass('active');
    $('.shadow-inp').before($(`<span class="spanHide" style="display:none" contenteditable="false">${$($current).attr('data-id')}</span>`));
    $('.shadow-inp').remove();
    modifyInputs();
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
    $dropMenuNav.append(generateHeaderTitle(key));
    for (const value in masDropMenu[key]) {
        const val = value.replace('|', ' → ');
        const dataAttr = (masDropMenu[key][value]);
        $dropMenuNav.append(generateEmojiIcon(val, dataAttr));
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

$textInsert.trigger('input');
$('.modal-win-text-field').on('input', () => {
    $('.spanHide').each((_, el) => {
        const $current = $(el);
        if (!$current.next().hasClass('li-elem')) {
            $current.remove();
        }
    });

    $dropMenuNav.on('click mouseenter', function (e) {
        setTimeout(() => {
            const val = $('.modal-win-text-field').text();
            $('textarea[name="out-data-final"]').val(val);
        }, 0);

    });

    $('.li-elem').each((_, el) => {
        const $current = $(el);

        if (!$current.prev().hasClass('spanHide')) {
            const id = $current.attr('data-id');
            // $current.before(`<span class="spanHide" style="display:none" contenteditable="true">{{${id}}}</span>`);
            $current.before(`<span class="spanHide" style="display:none" contenteditable="true">${id}</span>`);
        }
    });
    setTimeout(() => {
        const val = $('.modal-win-text-field').text();
        $('textarea[name="out-data-final"]').val(val);

        modifyInputs();
    }, 0);

});

let i = 0;

(function setColor() {
    $('.inp-wrapper-color input').each((_, el) => {
        $(el).css('background', masColor[i]);
        i++;
    });
})();






// TODO:
// const exitData = 'asd {{lead.responsible.name}} asd asd {{contact.phone}} {{contact.phone}} {{contact.phone}} asd asd {{contact.responsible.name}} jkl '.split(' ');
const exitData = ''.split(' ');
const reg = /\{\{[A-Za-z.1-9]+\}\}/mi;
const values = {
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
let item, name;
const res = '<p class="text-field">&nbsp;' + exitData.map(el => {
    if (!reg.test(el)) {
        return el;
    }
    const id = el.replace(/\{\{|\}\}/g, '');
    for (let el in values) {
        for (let key in values[el]) {
            item = values[el][key];
        }
    }
    if (!item) return el;
    for (let elem in values) {
        for (let key in values[elem]) {
            // key = key.replace('|', ' → ');
            if (el == values[elem][key]) {
                name = key.replace('|', ' → ');;
            }
        }
    }
    return createInput(id, name);
}).join(' ') + '</p>';

$('.modal-win-text-field').html(res);
modifyInputs();

$textInsert.trigger('input');
//


function createInput(id, name) {
    return `<span class="spanHide" style="display:none" contenteditable="true">{{${id}}}</span><input type="text" class="li-elem" name="searchField" data-id="{{${id}}}" value="${name}" disabled data-val="${name}">`;
}

// function modifyInputs() {
//     $('.modal-win-text-field').find('input').each((_, el) => {
//         const $current = $(el);
//         const value = $current.attr('data-val');

//         $current.attr('value', value);
//         $current.css('width', (el.scrollWidth) + 'px');
//     });
// }