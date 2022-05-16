'use strict';
// $(document).ready(function() {
const $textInsert = $('.modal-win-text-field');
const $dropMenu = $('.dropMenu');
const $dropMenuNav = $('.dropMenu-nav');
const $outData = $('#out-data');
const $keyboard = $('.keyboardShortcut');
const $body = $('body');
const $keyboardImg = $('.keyboard');
const $textField = ('<p class="text-field">&nbsp;</p>');
let focusElement = $('');

let masDropMenu = [{
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

$textInsert.append($textField);
/**
 * @description выполнение поиска из дроп меню
 */
function liveSearch() {
    $textInsert.on('keyup', function(e) {
        // try {
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
        // } catch (error) {}
    });
}

/**
 * @description Выведение категорий в список
 */
(function setDataDropMenu() {
    for (let key of masDropMenu) {
        const li = `<li class=\"dropMenu-elem\" data-id={{${key.id}}}>${key['name']}</li>`
        $dropMenuNav.append(li);
    }
})();
/**
 * @description Получение размеров инпута
 * @param {string} elem класс\id
 * @returns width размер инпута
 */
function getWidth(elem) {
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
            // console.log(`LEFT: '${caretLeftText}'  -  RIGHT: '${caretRightText}'`);
            if ($('.text-field')[0] !== window.getSelection().focusNode) {
                prevFocusedElem = focusBlock;
            }

            // console.log(prevFocusedElem);
            //Если ломается блок
            //1 Вариант
            // if (/\s{1,}{{/gmi.test(focusBlock.textContent.slice(0, window.getSelection().anchorOffset)) === true && $('.li-elem').length >= 1) {

            //     let block = $(`<span class=""></span>`);
            //     prevFocusedElem.append(searchField[0]);
            //     console.log(prevFocusedElem);
            // }
            //2 Вариант
            // if($('.text-field')[0] == window.getSelection().focusNode){

            // }

        }
        if (caretLeftText !== '' && caretRightText !== '' && prevFocusedElem === focusBlock) {
            let leftSpan = $(`<span data-id="${caretLeftText}">${caretLeftText}</span>`);
            let rightSpan = $(`<span data-id="${caretRightText}">${caretRightText}</span>`);
            focusBlock.before(leftSpan[0]);
            focusBlock.after(rightSpan[0]);
            focusBlock.remove();
            leftSpan[0].after(searchField[0]);
            searchField[0].focus();
            liveSearch();
        } else if (prevFocusedElem !== focusBlock) {
            // prevFocusedElem.append(searchField[0]);
            prevFocusedElem.after(searchField[0]);
            searchField[0].focus();
            liveSearch();

        } else if (caretLeftText === ' ' && caretRightText === '') {
            focusBlock.after(searchField[0]);
            searchField[0].focus();
            liveSearch();
        } else if (caretRightText === '') {
            focusBlock.parentElement.append(searchField[0]);
            searchField[0].focus();
            liveSearch();
        } else if (caretLeftText === '' && caretRightText === ' ') {
            focusBlock.after(searchField[0]);
            searchField[0].focus();
            liveSearch();
        } else if (caretLeftText === '') {
            focusBlock.parentElement.prepend(searchField[0]);
            searchField[0].focus();
            liveSearch();
        }
        resizeObserver.observe(searchField[0]);
    }

    //Проверка на удаление открытого поиска
    if ($('.shadow-inp')[0] !== undefined && $('.shadow-inp').val().length < 1 && param.key === 'Backspace') {
        $('.shadow-inp').remove();
        $dropMenu.addClass('active');
        $textInsert.focus();
    }
    //Отмена действия энтера
    if (param.key === 'Enter') {
        // param.preventDefault();
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
    // $shadowInp.attr('disabled', 'true');
    $shadowInp.prop('disabled', true);
    $shadowInp.val($current.textContent);
    let width = getWidth($('.shadow-inp')[0]);
    $('.shadow-inp').css('width', width + 10);
    let leftSpace = $(`<span>&nbsp;</span>`);
    let rightSpace = $(`<span>&nbsp;</span>`);
    // $('.shadow-inp').after("&nbsp;");
    // $('.shadow-inp').before("&nbsp;");

    $('.shadow-inp').after(leftSpace);
    $('.shadow-inp').before(rightSpace);

    $('.shadow-inp').attr('data-val', $($current).text());
    $('.shadow-inp').prepend($(`<span class="spanHide">${$($current).attr('data-id')}</span>`));
    $('.shadow-inp').attr('data-shadow', `<span class="spanHide">${$($current).attr('data-id')}</span>`);
    $shadowInp.removeClass('shadow-inp');
    $dropMenu.addClass('active');
});

//Проверка при вставке данных в инпут - СДЕЛАТЬ!!!
$('body').on('paste', function(e) {
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
});
$textInsert.on('copy', function(e) {
    // e.preventDefault();
    // console.log(e);
});


$textInsert.trigger('input');
let str;
let z;
//Выведение текста с маской в текстарею
$textInsert.on('input click mouseenter', (e) => {
    z = $('.text-field').text();
    $outData.text(z);
    //сохранение данных 
    // str = $outData.html().replaceAll('&nbsp;', ' ').trim();
    str = $('.modal-win-text-field').html().replaceAll('&nbsp;', ' ').trim();
    // console.log(str);
});
$('.dropMenu-nav').on('click mouseenter', function(e) {
    z = $('.text-field').text();
    $outData.text(z);
})


//Проверка на удаление текста
$textInsert.on('input', (e) => {
    let text = $(e.currentTarget)[0].innerText;
    if (text.length === 0) {
        $('.modal-win-text-field').html($textField);
    }
    // console.log(text.length);
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

let exitData = `asd  {{lead.responsible}} asd asd asd asd  {{lead.responsible}}  {{lead.status}} jkl `.split(' ');
$(exitData).each(function(_, el) {
    // console.log(el);
    // console.log(/\{\{[A-Za-z.1-9]+\}\}/gmi.test(el));
    const regTest = /\{\{[A-Za-z.1-9]+\}\}/gmi;
    $(masDropMenu).each(function(_, elem) {
        // console.log(el === `{{${elem.id}}}`);
        if (el === `{{${elem.id}}}`) {
            console.log(el.indexOf(elem.id));
            exitData[el.indexOf(elem.id)] = exitData[el.indexOf(elem.id)].replace(el);
            // console.log(el);
            console.log(exitData);
        }
    });
    // replaceAll('', '')
});
// /\{\{./gmi.test(el)
// $('#ccc').html(t);