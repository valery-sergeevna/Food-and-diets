window.addEventListener('DOMContentLoaded', () => {
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    //спрятать контент табов
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
            item.classList.remove('fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }
    //показать контент нажатого таба
    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    //вызов функций
    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        //делегирование события
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                //активировать функции 
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }

            });
        }
    });

    //timer
    const deadline = '2020-08-30';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            "hours": hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = document.querySelector("#days"),
            hours = document.querySelector("#hours"),
            minutes = document.querySelector("#minutes"),
            seconds = document.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);

    //modal window

    const modalButton = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalSubmit = document.querySelector('.modal__submit');

    //открыть модальное окно
    const openModal = () => {
        modal.classList.remove('hide');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    };

    //закрыть модальное окно
    const closeModal = () => {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    modalButton.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });
    //открыть модальное окно через 10 секунд
    const modalTimerId = setTimeout(openModal, 300000);

    //открыть модальное окно при скролле всей страницы сайта
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //использование классов для создания карточек меню
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }
        //преобразовать цену в соответствии с официальным курсом
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        //рендерить карточки
        renderCard() {
            const card = document.createElement('div');

            if (this.classes.length === 0) {
                this.card = 'menu__item';
                card.classList.add(this.card);
            } else {
                this.classes.forEach(className => card.classList.add(className));
            }

            card.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `;
            this.parent.append(card);
        }
    }

    const getResources = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResources('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').renderCard();
            });
        });

    //forms
    const forms = document.querySelectorAll('form');


    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, мы скоро свяжемся с Вами!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data,
        });

        return await res.json();
    };


    // function postData(form){
    //     form.addEventListener('submit', event => {
    //         event.preventDefault();

    //         const statusMessage = document.createElement('img');
    //         statusMessage.src = message.loading;
    //         statusMessage.style.cssText =  `
    //             display:block;
    //             margin:0 auto;
    //         `;
    //         form.insertAdjacentElement('afterend', statusMessage);

    //         const r = new XMLHttpRequest();
    //         r.open('POST', 'server.php');
    //         // r.setRequestHeader('Content-type', 'multipart/form-data');

    //         const formData = new FormData(form);

    //         const object = {};

    //         formData.forEach(function(value, key){
    //             object[key] = value;
    //         });

    //         const json = JSON.stringify(object);
    //         r.send(json);
    //         r.addEventListener('load', () => {
    //             if (r.status === 200){
    //                 console.log(r.response);
    //                 showThanksModal(message.success);
    //                 form.reset();
    //                 statusMessage.remove();
    //             }else{
    //                 showThanksModal(message.failure);
    //             }
    //         });
    //     });
    // }
    //fetch API
    function bindPostData(form) {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display:block;
                margin:0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify((Object.fromEntries(formData.entries())));

            const object = {};

            formData.forEach(function (value, key) {
                object[key] = value;
            });

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 3000);
    }


    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));

});