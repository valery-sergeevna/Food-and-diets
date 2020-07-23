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
        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach( (item, i) => {
                //активировать функции 
                if(target == item) {
                    hideTabContent();
                    showTabContent(i);
                }

            });
        }
    });

    //timer
    const deadline = '2020-08-02';

    function getTimeRemaining(endtime){
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

    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        }else{
            return num;
        }
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
            days = document.querySelector("#days"),
            hours = document.querySelector("#hours"),
            minutes = document.querySelector("#minutes"),
            seconds = document.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock(){
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0){
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
        document.body.addEventListener('keydown', closeModal);
        clearInterval(modalTimerId);
    };

    //закрыть модальное окно
    const closeModal = event => {
        const target = event.target;

        if (target.classList.contains('modal__close') || 
        target === modal ||
        event.code === 'Escape') {
            modal.classList.remove('show');
            modal.classList.add('hide');
            document.body.style.overflow = '';
            modalSubmit.reset();
        }
    };
    
    modalButton.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', closeModal);
    //открыть модальное окно через 10 секунд
    const modalTimerId = setTimeout(openModal, 10000);

    //открыть модальное окно при скролле всей страницы сайта
    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= 
            document.documentElement.scrollHeight){
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
    }

    window.addEventListener('scroll', showModalByScroll);



    //использование классов для создания карточек меню
    class MenuCard {
        constructor (src, alt, title, descr, price, parentSelector){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
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
            card.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
        `;
            this.parent.append(card);
        }
    }

    //рендер новых карточек меню
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        "Фитнес",
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей.  Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        10,
        '.menu .container'
    ).renderCard();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elit",
        "Премиум",
        'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        17,
        '.menu .container'
    ).renderCard();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        "Постное",
        'Меню "Постное" - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        13,
        '.menu .container'
    ).renderCard();

});