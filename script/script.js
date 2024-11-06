document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const modalDialog = document.querySelector('.modal-dialog');

    let clientWidth = document.documentElement.clientWidth;
    let answersLog = [];

    if(clientWidth < 768) {
        burgerBtn.style.display = "flex";
    } else {
        burgerBtn.style.display='none';
    }

    const questions = [
        {
            question: "Какого цвета бургер?",
            answers: [
                { title: 'Стандарт', url: './image/burger.png' },
                { title: 'Чёрный', url: './image/burgerBlack.png' }
            ],
            type: 'radio'
        },
        {
            question: "Из какого мяса котлета?",
            answers: [
                { title: 'Курица', url: './image/chickenMeat.png' },
                { title: 'Говядина', url: './image/beefMeat.png' },
                { title: 'Свинина', url: './image/porkMeat.png' }
            ],
            type: 'radio'
        },
        {
            question: "Дополнительные ингредиенты?",
            answers: [
                { title: 'Помидор', url: './image/tomato.png' },
                { title: 'Огурец', url: './image/cucumber.png' },
                { title: 'Салат', url: './image/salad.png' },
                { title: 'Лук', url: './image/onion.png' }
            ],
            type: 'checkbox'
        },
        {
            question: "Добавить соус?",
            answers: [
                { title: 'Чесночный', url: './image/sauce1.png' },
                { title: 'Томатный', url: './image/sauce2.png' },
                { title: 'Горчичный', url: './image/sauce3.png' }
            ],
            type: 'radio'
        },
        {
            question: "Введите свой номер телефона",
            answers: [],
            type: 'text'
        }
    ];

    let count = -100;
    let interval;

    modalDialog.style.top='-100%';

    const animateModal = () => {
        modalDialog.style.top = count + '%';
        count+=4;
        if(count < 0) {
            requestAnimationFrame(animateModal);
        } else {
            count -= 100;
        }
    };

    window.addEventListener('resize', function () {
        clientWidth = document.documentElement.clientWidth;
        if (clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none';
        }
    });

    burgerBtn.addEventListener('click', function () {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    });

    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        playTest();
    });

    document.addEventListener('click', function(event) {
        if (
            !event.target.closest('.modal-dialog') &&
            !event.target.closest('.openModalButton') &&
            !event.target.closest('.burger')
        ) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
        }
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });

    const playTest = () => {
        let numberQuestion = 0;

        const renderAnswers = (index) => {
            formAnswers.innerHTML = '';

            if (questions[index].type === 'text') {
                formAnswers.innerHTML = `
                    <input type="tel" id="phoneNumber" name="phone" placeholder="Введите номер телефона" class="form-control mb-3">
                    <button id="submitPhone" class="btn btn-primary">Отправить</button>
                `;
                document.querySelector('#submitPhone').addEventListener('click', () => {
                    const phoneInput = document.querySelector('#phoneNumber').value;
                    if (phoneInput) {
                        answersLog.push({ question: questions[index].question, answer: phoneInput });
                        console.log("Финальный отчет:", answersLog);
                        modalBlock.classList.remove('d-block');
                        burgerBtn.classList.remove('active');
                    }
                });
            } else {
                questions[index].answers.forEach((answer) => {
                    const answerItem = document.createElement('div');
                    answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                    answerItem.innerHTML = `
                        <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none">
                        <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                            <img class="answerImg" src="${ answer.url }" alt="burger">
                            <span>${ answer.title }</span>
                        </label>
                    `;
                    formAnswers.appendChild(answerItem);
                });
            }
        };

        const renderQuestions = (indexQuestion) => {
            questionTitle.textContent = `${questions[indexQuestion].question}`;
            renderAnswers(indexQuestion);

            switch (indexQuestion) {
                case 0:
                    prevButton.classList.add('hidden');
                    nextButton.classList.remove('hidden');
                    break;
                case questions.length - 1:
                    nextButton.classList.add('hidden');
                    prevButton.classList.remove('hidden');
                    break;
                default:
                    prevButton.classList.remove('hidden');
                    nextButton.classList.remove('hidden');
                    break;
            }
        };

        renderQuestions(numberQuestion);

        nextButton.onclick = () => {
            const selectedAnswers = formAnswers.querySelectorAll('input:checked');
            const selectedValues = Array.from(selectedAnswers).map(input => input.id);

            if (selectedValues.length > 0 || questions[numberQuestion].type === 'text') {
                const answer = selectedValues.length > 0 ? selectedValues : "Не выбран ответ";
                const logEntry = { question: questions[numberQuestion].question, answer: answer };
                answersLog.push(logEntry);
                console.log("Выбор сохранен:", logEntry);
            }

            numberQuestion++;
            renderQuestions(numberQuestion);
        };

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        };
    };
});