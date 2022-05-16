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

// let masDropMenu = [{
//         id: 'lead.id',
//         name: 'ID'
//     },
//     {
//         id: 'lead.name',
//         name: 'Название сделки',
//     },
//     {
//         id: 'lead.money',
//         name: 'Бюджет',
//     },
//     {
//         id: 'lead.status',
//         name: 'Статус',
//     },
//     {
//         id: 'lead.responsible',
//         name: 'Ответственный',
//     },
//     {
//         id: 'lead.clear',
//         name: 'Чёткий',
//     },
// ];


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
$textInsert.append($textField);
/**
 * @description выполнение поиска из дроп меню
 */
function liveSearch() {
    $textInsert.on('keyup', function(e) {
        let value = searchField[0].value;
        let list = $('.dropMenu-elem');
        if (value != '') {
            list.each(function(par, elem) {
                if ($(elem).text().toLowerCase().search(value) == -1) {
                    $(elem).addClass('hide');
                } else {
                    $(elem).removeClass('hide');
                }
            });
        } else {
            list.each(function(par, elem) {
                $(elem).removeClass('hide');
            });
        }
    });
}

(function setDataDropMenu() {
    for (const key in masDropMenu2) {
        //Убрать класс dropMenu-elem, если не нужно их искать в живой сортировке
        const liMain = $(`<li class="dropMenu-elem-color dropMenu-elem" data-id=${key}>  ${key}</li>`);
        const ulEl = $('<ul></ul>')
        for (const value in masDropMenu2[key]) {
            const val = value.replace('|', '→');
            var liInner = $(`<li class="dropMenu-elem dropMenu-elem-hover innerElem" data-id=${masDropMenu2[key][value]}>${val}</li>`);
            ulEl.append(liInner);
        }
        liMain.append(ulEl);
        $dropMenuNav.append(liMain);
    }
})();


/**
 * @description Получение размеров инпута
 * @param {string} elem класс\id
 * @returns width размер инпута
 */
function getWidth(elem) {
    try {
        let fontSize = getComputedStyle(elem);
        let newSpan = document.createElement('span');
        newSpan.style.fontSize = fontSize;
        newSpan.style.margin = '0px';
        newSpan.style.padding = '0px';
        newSpan.innerHTML = elem.value || elem.getAttribute('placeholder');
        document.body.appendChild(newSpan);
        let width = newSpan.offsetWidth;
        newSpan.remove()
        return width;
    } catch (error) {}
}

/**
 * @description Закртытие модального окна через Esc
 */
$body.on('keydown', function(param) {
    if (param.key === 'Escape') {
        $('.keyboardShortcut').removeClass('keyboardShortcut-active');
    }
});

$keyboardImg.on('click', function() {
    if ($($keyboard).hasClass('keyboardShortcut-active')) {
        $($keyboard).removeClass('keyboardShortcut-active');
        $keyboard.slideUp();
    } else {
        $($keyboard).addClass('keyboardShortcut-active');
        $keyboard.slideDown();
    }
});

$(document).on('click', function(e) {
    if (!$keyboardImg.is(e.target) && !$body.is(e.target) && $body.has(e.target).length === 0) {
        $keyboard.removeClass('keyboardShortcut-active');
    };
    if ($('.shadow-inp').is(":focus") === false) {
        $('.shadow-inp').remove();
        $dropMenu.addClass('active');
    }
});

//Получение позиции каретки
$textInsert.on('click mousedown keydown keyup', function(e) {
    focusElement = window.getSelection().focusNode;
    $('.li-elem').css('position', 'unset');
    // if ($('.text-field')[0] !== window.getSelection().focusNode) {
    if ($('.text-field')[0] !== $('.text-field')[0]) {
        prevFocusedElem = focusBlock;
    }
});
let caretLeftText;
let caretRightText;
let letfSpan;
let RightSpan;
let focusBlock;
let searchField;
let prevFocusedElem;
let testPrevEl;
const regInp = /\{?\{?[A-Za-z.]{0,}\}?\}?/gmi;
$textInsert.on('keydown', function(param) {
    if ($('.text-field')[0] !== window.getSelection().focusNode) {
        prevFocusedElem = focusBlock;
        if (prevFocusedElem === $('.text-field')[0]) {

        }
    }
    if (param.key !== 'Backspace' || param.key !== 'Delete') {
        $('.li-elem').attr('contenteditable', 'false');
    }
    if (param.key === 'Backspace' || param.key === 'Delete' || param.key !== 'ArrowLeft' || param.key !== 'ArrowRight') {
        $('.li-elem').removeAttr('contenteditable');
    }
    if (param.key === '[') {
        param.preventDefault();

        if ($dropMenu.hasClass('active') === false) {
            return false;
        }
        if ($('.shadow-inp')) {
            $('.shadow-inp').remove();
        }
        if ($keyboard.hasClass('keyboardShortcut-active')) {
            $keyboard.removeClass('keyboardShortcut-active');
        }
        $dropMenu.removeClass('active');
        searchField = $('<input type="text" class="shadow-inp" name="searchField">');
        focusBlock = window.getSelection().focusNode;
        if (param.target === $textInsert[0]) {
            caretLeftText = focusBlock.textContent.slice(0, window.getSelection().anchorOffset);
            caretRightText = focusBlock.textContent.slice(window.getSelection().anchorOffset);
            if ($('.text-field')[0] !== window.getSelection().focusNode) {
                prevFocusedElem = focusBlock;
            }
            // if (focusBlock !== $('.text-field')[0] && focusBlock !== $('.modal-win-text-field')[0]) {
            //     testPrevEl = focusBlock;
            // }
            // if (/\{?\{?[A-Za-z.]{1,}\}?\}/.test(caretRightText) || /\{?\{?[A-Za-z.]{1,}\}?\}/.test(caretLeftText)) {
            //     console.log(testPrevEl);
            //     caretLeftText = testPrevEl.textContent.slice(0, window.getSelection().anchorOffset);
            //     caretRightText = testPrevEl.textContent.slice(window.getSelection().anchorOffset);
            //     testPrevEl.after(searchField[0]);
            //     searchField[0].focus();
            //     liveSearch();
            // }
        }
        if (caretLeftText !== '' && caretRightText !== '' && prevFocusedElem === focusBlock) {
            let leftSpan = $(`<span data-id="${caretLeftText}">${caretLeftText}</span>`);
            let rightSpan = $(`<span data-id="${caretRightText}">${caretRightText}</span>`);
            // if (regInp.test(caretRightText) === false && regInp.test(caretLeftText) === false) {
            focusBlock.before(leftSpan[0]);
            focusBlock.after(rightSpan[0]);
            focusBlock.remove();
            leftSpan[0].after(searchField[0]);
            // }
        } else if (prevFocusedElem !== focusBlock) {
            // prevFocusedElem.append(searchField[0]);
            prevFocusedElem.after(searchField[0]);
        } else if (caretLeftText === ' ' && caretRightText === '') {
            focusBlock.after(searchField[0]);
        } else if (caretRightText === '') {
            focusBlock.parentElement.append(searchField[0]);
        } else if (caretLeftText === '' && caretRightText === ' ') {
            focusBlock.after(searchField[0]);
        } else if (caretLeftText === '') {
            focusBlock.parentElement.prepend(searchField[0]);
        }
        searchField[0].focus();
        liveSearch();
        resizeObserver.observe(searchField[0]);
    }

    //Проверка на удаление открытого поиска
    if ($('.shadow-inp')[0] !== undefined && $('.shadow-inp').val().length < 1 && param.key === 'Backspace') {
        $('.shadow-inp').before(' ');
        $('.shadow-inp').remove();
        $dropMenu.addClass('active');
        $textInsert.focus();
    }
    //Отмена действия энтера
    if (param.key === 'Enter') {
        param.preventDefault();
        // let enter = $(`<span contenteditable="false" style="display: none;">\\n</span>`);
        // setTimeout(() => {
        //     if (window.getSelection().extentNode.parentNode !== $('.modal-win-text-field')[0]) {
        //         window.getSelection().extentNode.parentNode.before(enter[0]);
        //     } else {
        //         window.getSelection().extentNode.before(enter[0]);
        //     }
        // }, 0);
    }
});

$textInsert.on('click', function(param) {
    focusElement = window.getSelection().focusNode;
    if ($dropMenu.hasClass('active') === true && $('.shadow-inp')) {
        $('.shadow-inp').remove();
    }
    $('.li-elem').attr('contenteditable', 'false');
});

$dropMenuNav.on('click', '.dropMenu-elem', function(e) {
    const $current = e.currentTarget;
    const $shadowInp = $('.shadow-inp');
    $shadowInp.addClass('li-elem')
    $shadowInp.attr('data-id', $($current).attr('data-id'));
    $shadowInp.prop('disabled', true);
    $shadowInp.val($current.textContent);
    let width = getWidth($('.shadow-inp')[0]);
    let shadowInp = $('.shadow-inp');
    shadowInp.css('width', width + 10);
    let leftSpace = $(`<span>&nbsp;</span>`);
    let rightSpace = $(`<span>&nbsp;</span>`);
    shadowInp.after(leftSpace);
    shadowInp.before(rightSpace);
    shadowInp.attr('data-val', $($current).text());
    shadowInp.before($(`<span class="spanHide" style="display:none" contenteditable="false">${$($current).attr('data-id')}</span>`));
    shadowInp.attr('data-shadow', `<span class="spanHide">${$($current).attr('data-id')}</span>`);
    $shadowInp.removeClass('shadow-inp');
    $dropMenu.addClass('active');
});

$textInsert.trigger('input');
$('.modal-win-text-field').on('input', () => {
    $('.spanHide').each((_, el) => {
        const $current = $(el);
        if (!$current.next().hasClass('li-elem')) {
            $current.remove();
        }
    })

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

})

$('.dropMenu-nav').on('click mouseenter', function(e) {
    $('.modal-win-text-field').trigger('input');
})


//Проверка на удаление текста
$textInsert.on('input', (e) => {
    let text = $(e.currentTarget)[0].innerText;
    if (text.length === 0) {
        $('.modal-win-text-field').html($textField);
    }
    if (text.length <= 1) {
        $('br').after(' ');
        $('br').remove();
    }
});

//Подгон дроп меню к блоку с кареткой
let resizeObserver = new ResizeObserver(function(param) {
    try {
        let sizeSpace = $('.shadow-inp').css('top').slice(0, -2);
        $dropMenu.css('top', `${sizeSpace - 190}px`);
        $('.shadow-inp').css('position', 'sticky');
    } catch (error) {}
});















// TODO:
// const exitData = 'asd {{lead.responsible}} asd asd asd asd {{lead.responsible}} {{lead.status}} jkl '.split(' ');
const exitData = ' '.split(' ');
const reg = /\{\{[A-Za-z.1-9]+\}\}/mi;
const values = [{
        id: 'lead.id',
        name: 'ID'
    },
    {
        id: 'lead.name',
        name: 'Название сделки',
    },
    {
        id: 'lead.money',
        name: 'Бюджет',
    },
    {
        id: 'lead.status',
        name: 'Статус',
    },
    {
        id: 'lead.responsible',
        name: 'Ответственный',
    },
    {
        id: 'lead.clear',
        name: 'Чёткий',
    },
];
const res = '<p class="text-field">&nbsp;' + exitData.map(el => {
    if (!reg.test(el)) {
        return el;
    }

    const id = el.replace(/\{\{|\}\}/g, '');
    const item = values.find(el => {
        return el.id == id;
    });

    if (!item) return el;

    const name = item.name;
    return createInput(id, name);
}).join(' ') + '</p>';


$('.modal-win-text-field').html(res);
modifyInputs();


$('.modal-win-text-field').trigger('input');
//



















function createInput(id, name) {
    return `<span class="spanHide" style="display:none" contenteditable="true">{{${id}}}</span><input type="text" class="li-elem" name="searchField" data-id="${id}" value="${name}" disabled="" data-val="${name}" style="position: unset; width: 53px;">`;
}

function modifyInputs() {
    $('.modal-win-text-field').find('input').each((_, el) => {
        const $current = $(el);
        const value = $current.attr('data-val');

        $current.attr('value', value);
        $current.css('width', (el.scrollWidth) + 'px');
    });
}