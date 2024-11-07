import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
  
document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    const modalDialog = document.querySelector('.modal-dialog');

const firebaseConfig = {
    apiKey: "AIzaSyDy0I_tnG2RBPimnH_yx-EdOgnkkaOaFxU",
    authDomain: "saas-2f22e.firebaseapp.com",
    databaseURL: "https://saas-2f22e-default-rtdb.firebaseio.com",
    projectId: "saas-2f22e",
    storageBucket: "saas-2f22e.firebasestorage.app",
    messagingSenderId: "823201297704",
    appId: "1:823201297704:web:8893e37436119406344c1d",
	measurementId: "G-DPL331J5MJ"
};

  const app = initializeApp(firebaseConfig);
    
    const getData = () => {
        formAnswers.textContent = 'LOAD';

        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');

        setTimeout(() => {
            const db = getDatabase();
            get(ref(db, 'questions'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    playTest(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        }, 500)
    }


    let clientWidth = document.documentElement.clientWidth;

    if(clientWidth < 768) {
        burgerBtn.style.display = "flex";
    } else {
        burgerBtn.style.display='none';
    }

    const questions = [{
        question: "Какого цвета бургер?",
        answers: [{
                title: 'Стандарт',
                url: './image/burger.png'
            },
            {
                title: 'Тёмный',
                url: './image/burgerBlack.png'
            }
        ],
        type: 'radio'
    },
    {
        question: "Из какого мяса котлета?",
        answers: [{
                title: 'Курица',
                url: './image/chickenMeat.png'
            },
            {
                title: 'Говядина',
                url: './image/beefMeat.png'
            },
            {
                title: 'Свинина',
                url: './image/porkMeat.png'
            }
        ],
        type: 'radio'
    },
    {
        question: "Дополнительные ингредиенты?",
        answers: [{
                title: 'Помидор',
                url: './image/tomato.png'
            },
            {
                title: 'Огурец',
                url: './image/cucumber.png'
            },
            {
                title: 'Салат',
                url: './image/salad.png'
            },
            {
                title: 'Лук',
                url: './image/onion.png'
            }
        ],
        type: 'checkbox'
    },
    {
        question: "Добавить соус?",
        answers: [{
                title: 'Чесночный',
                url: './image/sauce1.png'
            },
            {
                title: 'Томатный',
                url: './image/sauce2.png'
            },
            {
                title: 'Горчичный',
                url: './image/sauce3.png'
            }
        ],
        type: 'radio'
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
    })


    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        getData();
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

    const playTest = (questions) => {
        const finalAnswers = [];
        let numberQuestion = 0;

        const renderAnswers = (index) => {
            

            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                <img class="answerImg" src="${ answer.url }" alt="burger">
                <span>${ answer.title }</span>
                </label>
                `;

                formAnswers.appendChild(answerItem);
            })
        }

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
        
            switch (true) {
                case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
                    questionTitle.textContent = `${questions[indexQuestion].question}`;
                    renderAnswers(indexQuestion);
                    nextButton.classList.remove('d-none');
                    prevButton.classList.remove('d-none');
                    sendButton.classList.add('d-none');
                    break;
        
                case (numberQuestion === 0):
                    prevButton.classList.add('d-none');
                    break;
        
                case (numberQuestion === questions.length):
                    questionTitle.textContent = '';
                    nextButton.classList.add('d-none');
                    prevButton.classList.add('d-none');
                    sendButton.classList.remove('d-none');
                    formAnswers.innerHTML = `
                        <div class="form-group">
                            <label for="numberPhone">Enter your number</label>
                            <input type="phone" class="form-control" id="numberPhone">
                        </div>
                    `;
                    break;
        
                case (numberQuestion === questions.length + 1):
                    questionTitle.textContent = '';
                    formAnswers.textContent = 'Спасибо за пройденний тест!';
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block');
                    }, 2000);
                    break;
            }
        };
        
        
        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');

            inputs.forEach((input, index) => {
                if(numberQuestion >= 0 && numberQuestion <= questions.length - 1){
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if(numberQuestion === questions.length){
                    obj['Номер телефона'] = input.value;
                }
            })

            finalAnswers.push(obj);
        }

        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            const db = getDatabase();
            push(ref(db, 'contacts'), finalAnswers)
                .then(() => {
                    console.log("Data saved successfully!");
                })
                .catch((error) => {
                    console.error("Error saving data:", error);
                });
        }
    };
});
