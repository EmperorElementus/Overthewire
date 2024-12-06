document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.querySelector(".button-auth");
    const logoutButton = document.querySelector(".button-out");
    const modalAuth = document.querySelector(".modal-auth");
    const closeAuthButton = document.querySelector(".close-auth");
    const loginForm = document.getElementById("logInForm");
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    const userNameSpan = document.querySelector(".user-name");
    const cardsContainer = document.querySelector(".cards.cards-restaurants");

    const restaurants = [
        {
            name: "Піца плюс",
            time: "50 хвилин",
            rating: 4.5,
            price: "від 200 ₴",
            category: "Піца",
            image: "img/pizza-plus/preview.jpg"
        },
        {
            name: "Танукі",
            time: "60 хвилин",
            rating: 4.5,
            price: "От 1 200 ₴",
            category: "Суші, роли",
            image: "img/tanuki/preview.jpg"
        },
        {
            name: "FoodBand",
            time: "40 хвилин",
            rating: 4.5,
            price: "От 150 ₴",
            category: "Піца",
            image: "img/food-band/preview.jpg"
        },
        {
            name: "Ikigai",
            time: "55 хвилин",
            rating: 4.5,
            price: "От 250 ₴",
            category: "Піца",
            image: "img/palki-skalki/preview.jpg"
        },
        {
            name: "Пузата хата",
            time: "75 хвилин",
            rating: 4.5,
            price: "От 300 ₴",
            category: "Українські страви",
            image: "img/gusi-lebedi/preview.jpg"
        },
        {
            name: "PizzaBurger",
            time: "45 хвилин",
            rating: 4.5,
            price: "От 700 ₴",
            category: "Піца",
            image: "img/pizza-burger/preview.jpg"
        }
    ];

    function generateRestaurantCards() {
        restaurants.forEach(restaurant => {
            const cardHTML = `
                <a href="#" class="card card-restaurant">
                    <img src="${restaurant.image}" alt="image" class="card-image" />
                    <div class="card-text">
                        <div class="card-heading">
                            <h3 class="card-title">${restaurant.name}</h3>
                            <span class="card-tag tag">${restaurant.time}</span>
                        </div>
                        <div class="card-info">
                            <div class="rating">${restaurant.rating}</div>
                            <div class="price">${restaurant.price}</div>
                            <div class="category">${restaurant.category}</div>
                        </div>
                    </div>
                </a>
            `;
            cardsContainer.insertAdjacentHTML("beforeend", cardHTML);
        });
    }

    cardsContainer.addEventListener("click", function (event) {
        const card = event.target.closest(".card-restaurant");

        if (!card) return;

        if (!localStorage.getItem("login")) {
            modalAuth.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    });

    authButton.addEventListener("click", () => {
        modalAuth.style.display = "flex";
        document.body.style.overflow = "hidden";
        resetInputBorders();
    });

    closeAuthButton.addEventListener("click", () => {
        closeModal();
    });

    modalAuth.addEventListener("click", (event) => {
        if (event.target === modalAuth) {
            closeModal();
        }
    });

    if (localStorage.getItem("login")) {
        displayLoggedIn(localStorage.getItem("login"));
    } else {
        displayLoggedOut();
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        if (!login || !password) {
            if (!login) loginInput.style.borderColor = "red";
            if (!password) passwordInput.style.borderColor = "red";
            alert("Будь ласка, заповніть усі поля.");
        } else {
            localStorage.setItem("login", login);
            displayLoggedIn(login);
            closeModal();
        }
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("login");
        displayLoggedOut();
    });

    function displayLoggedIn(login) {
        authButton.style.display = "none";
        logoutButton.style.display = "inline-block";
        userNameSpan.textContent = login;
        userNameSpan.style.display = "inline";
        loginInput.style.borderColor = "";
        passwordInput.style.borderColor = "";
    }

    function displayLoggedOut() {
        authButton.style.display = "inline-block";
        logoutButton.style.display = "none";
        userNameSpan.textContent = "";
        userNameSpan.style.display = "none";
        loginInput.value = "";
        passwordInput.value = "";
    }

    function closeModal() {
        modalAuth.style.display = "none";
        document.body.style.overflow = "";
        resetInputBorders();
    }

    function resetInputBorders() {
        loginInput.style.borderColor = "";
        passwordInput.style.borderColor = "";
    }

    generateRestaurantCards();
	
	const swiper = new Swiper('.swiper', {
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});
});
