import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    fetch('db/partners.json')
        .then(response => response.json())
        .then(restaurantsData => {
            const restaurantsContainer = document.getElementById('restaurantsContainer');
            const menuContainer = document.getElementById('menuContainer');
            const menuSearchInput = document.getElementById('menuSearchInput');
            const restaurantTitle = document.querySelector('.restaurant-title');
            const restaurantInfo = document.querySelector('.restaurant-info');
            const searchInput = document.querySelector('.input-search');
            const clearSearchButton = document.getElementById('clearSearch');
            const clearMenuSearch = document.getElementById('clearMenuSearch');
            const authModal = document.getElementById('authModal');
            const authButton = document.getElementById('authButton');
            const logoutButton = document.getElementById('logoutButton');
            const closeAuthButton = document.getElementById('closeAuth');
            const logInForm = document.getElementById('logInForm');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const loginName = document.getElementById('loginName');
            const userLogin = document.getElementById('userLogin');
            const phoneModal = document.getElementById('phoneModal');
            const phoneNumberInput = document.getElementById('phoneNumberInput');
            const submitPhoneNumberButton = document.getElementById('submitPhoneNumber');
            const closePhoneModalButton = document.getElementById('closePhoneModal');

            const firebaseConfig = {
                apiKey: "AIzaSyBxlN0D_2uRU6o04HmD76mKjeNGP_TIek4",
                authDomain: "test-41536.firebaseapp.com",
                databaseURL: "https://test-41536-default-rtdb.firebaseio.com",
                projectId: "test-41536",
                storageBucket: "test-41536.appspot.com",
                messagingSenderId: "562560501749",
                appId: "1:562560501749:web:d264bd429fd14510c902bc",
                measurementId: "G-1E1GFS4JRW"
            };

            const app = initializeApp(firebaseConfig);
            const db = getDatabase(app);

            function closeModal() {
                authModal.style.display = 'none';
                document.body.style.overflow = '';
                resetInputStyles();
                resetInputFields();
            }

            function showAuthModal() {
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }

            function closePhoneModalFunction() {
                phoneModal.style.display = 'none';
                document.body.style.overflow = '';
            }

            function showPhoneModal() {
                phoneModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }

            function renderRestaurants(filteredData = restaurantsData) {
                if (!restaurantsContainer) {
                    console.error('restaurantsContainer не найден!');
                    return;
                }

                restaurantsContainer.innerHTML = '';
                filteredData.forEach((restaurant) => {
                    const restaurantCard = `
                        <div class="card" data-name="${restaurant.name}" data-link="${restaurant.products}">
                            <img src="${restaurant.image}" alt="${restaurant.name}" class="card-image" />
                            <div class="card-text">
                                <div class="card-heading">
                                    <h3 class="card-title">${restaurant.name}</h3>
                                </div>
                                <div class="card-info">
                                    <div class="card-info-row">
                                        <span class="card-info-label">Час доставки:</span>
                                        <span class="card-info-value">${restaurant.time_of_delivery} хвилин</span>
                                    </div>
                                    <div class="card-info-row">
                                        <span class="card-info-label">Рейтинг:</span>
                                        <span class="card-info-value">${restaurant.stars} ★</span>
                                    </div>
                                    <div class="card-info-row">
                                        <span class="card-info-label">Ціна:</span>
                                        <span class="card-info-value">від ${restaurant.price} ₴</span>
                                    </div>
                                    <div class="card-info-row">
                                        <span class="card-info-label">Кухня:</span>
                                        <span class="card-info-value">${restaurant.kitchen}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    restaurantsContainer.innerHTML += restaurantCard;
                });

                document.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('click', function () {
                        if (!localStorage.getItem('username')) {
                            showAuthModal();
                        } else {
                            const restaurantName = card.dataset.name;
                            localStorage.setItem('selectedRestaurant', restaurantName);
                            window.location.href = "restaurant.html";
                        }
                    });
                });
            }

            function renderMenu(menuData = []) {
                if (!menuContainer) {
                    console.error('menuContainer не найден!');
                    return;
                }

                menuContainer.innerHTML = '';
                menuData.forEach(item => {
                    const menuCard = `
                        <div class="card" data-id="${item.id}">
                            <img src="${item.image}" alt="${item.name}" class="card-image" />
                            <div class="card-text">
                                <div class="card-heading">
                                    <h3 class="card-title">${item.name}</h3>  
                                </div>
                                <div class="card-info">
                                    <div class="ingredients">${item.description}</div>  
                                </div>
                                <div class="card-buttons">
                                    <button class="button button-primary button-add-cart">
                                        <span class="button-card-text">У кошик</span>
                                    </button>
                                    <strong class="card-price-bold">${item.price} ₴</strong>  
                                </div>
                            </div>
                        </div>`;
                    menuContainer.innerHTML += menuCard;
                });

                function requestPhoneNumber() {
                    let phoneNumber = localStorage.getItem('userPhoneNumber');
            
                    if (!phoneNumber) {
                        phoneNumber = prompt('Введіть будь ласка ваш номер телефона для підтверження:', '');
                        if (phoneNumber) {
                            localStorage.setItem('userPhoneNumber', phoneNumber);
                        }
                    }
                    return phoneNumber;
                }

                 document.querySelectorAll('.button-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const phoneNumber = requestPhoneNumber();
            if (phoneNumber) {
                const card = button.closest('.card');
                const itemId = card.getAttribute('data-id');
                const itemName = card.querySelector('.card-title').textContent;
                const itemPrice = parseFloat(card.querySelector('.card-price-bold').textContent);

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItemIndex = cart.findIndex(item => item.id === itemId);

                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity += 1;
                } else {
                    cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));

                const dbRef = ref(db, 'orders');
                push(dbRef, {
                    user: localStorage.getItem('username'),
                    itemId: itemId,
                    itemName: itemName,
                    itemPrice: itemPrice,
                    quantity: 1,
                    orderDate: new Date().toISOString(),
                    phoneNumber: phoneNumber,
                }).then(() => {
                    console.log('Товар добавлен в Firebase');
                }).catch(error => {
                    console.error('Ошибка добавления товара в Firebase:', error);
                });

                button.innerHTML = '<span class="button-card-text">Додано до кошика</span>';
                const goToCartButton = document.createElement('button');
                goToCartButton.classList.add('button', 'button-primary', 'button-go-to-cart');
                goToCartButton.textContent = '🛒';
                button.parentElement.appendChild(goToCartButton);

                goToCartButton.addEventListener('click', () => {
                    window.location.href = 'cart.html';
                });
            }
        });
    });
            }

            function loadMenu() {
                const restaurantName = localStorage.getItem('selectedRestaurant');
                if (restaurantName && restaurantTitle) {
                    restaurantTitle.textContent = restaurantName;  
                }

                const restaurant = restaurantsData.find(r => r.name === restaurantName);
                if (restaurant) {
                    if (restaurantInfo) {
                        restaurantInfo.innerHTML = `
                            <div><strong>Час доставки:</strong> ${restaurant.time_of_delivery} хвилин</div>
                            <div><strong>Ціна:</strong> від ${restaurant.price} ₴</div>
                            <div><strong>Категорія:</strong> ${restaurant.kitchen}</div>
                        `;
                    }

                    const menuFile = restaurant.products;
                    if (menuFile) {
                        fetch(menuFile)
                            .then(response => response.json())
                            .then(menuData => {
                                renderMenu(menuData);

                                if (menuSearchInput) {
                                    menuSearchInput.addEventListener('keypress', function (event) {
                                        if (event.key === 'Enter') {  
                                            const query = menuSearchInput.value.trim().toLowerCase();
                                            if (query) {
                                                const filteredMenu = menuData.filter(item => 
                                                    item.name.toLowerCase().includes(query) ||
                                                    item.description.toLowerCase().includes(query)
                                                );
                                                renderMenu(filteredMenu); 
                                            } else {
                                                renderMenu(menuData);  
                                            }
                                        }
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Ошибка загрузки меню:', error);
                            });
                    }
                }
            }

            function resetInputStyles() {
                usernameInput.style.borderColor = '';
                passwordInput.style.borderColor = '';
            }

            function resetInputFields() {
                usernameInput.value = '';
                passwordInput.value = '';
            }

            function searchRestaurants(query) {
                if (!query.trim()) return;

                const filteredRestaurants = restaurantsData.filter(restaurant => {
                    return restaurant.name.toLowerCase().includes(query.toLowerCase());
                });

                renderRestaurants(filteredRestaurants);
            }

            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    const query = searchInput.value.trim();
          
                    if (query) {
                        clearSearchButton.style.display = 'block';
                    } else {
                        clearSearchButton.style.display = 'none';
                    }

                    if (query === '' || /^\s*$/.test(query)) {  
                        searchInput.style.borderColor = 'red';
                        searchInput.setAttribute('placeholder', 'Введіть будь ласка назву ресторану');
                        setTimeout(() => { 
                            searchInput.style.borderColor = ''; 
                            searchInput.setAttribute('placeholder', 'Пошук ресторанів'); 
                        }, 1000); 
                    } else {
                        searchRestaurants(query);
                    }
                });
            } else {
                console.error('searchInput не найден!');
            }

            if (clearSearchButton) {
                clearSearchButton.addEventListener('click', function () {
                    if (searchInput) {
                        searchInput.value = '';
                        searchInput.style.borderColor = '';  
                        searchInput.setAttribute('placeholder', 'Пошук ресторанів');
                        renderRestaurants();
                        clearSearchButton.style.display = 'none'; 
                    }
                });
            } else {
                console.error('clearSearchButton не найден!');
            }

            if (clearMenuSearch) {
                clearMenuSearch.addEventListener('click', function () {
                    if (menuSearchInput) {
                        menuSearchInput.value = '';  
                        menuSearchInput.style.borderColor = '';  
                        menuSearchInput.style.backgroundColor = '';  

                        const restaurantName = localStorage.getItem('selectedRestaurant');
                        if (restaurantName) {
                            const restaurant = restaurantsData.find(r => r.name === restaurantName);
                            if (restaurant) {
                                const menuFile = restaurant.products;
                                if (menuFile) {
                                    fetch(menuFile)
                                        .then(response => response.json())
                                        .then(menuData => {
                                            renderMenu(menuData);  
                                        })
                                        .catch(error => {
                                            console.error('Ошибка загрузки меню:', error);
                                        });
                                }
                            }
                        }
                    }
                });
            } else {
                console.error('clearMenuSearch не найден!');
            }

            if (menuSearchInput) {
                menuSearchInput.addEventListener('blur', function () {
                    if (menuSearchInput.value.trim() === '') {
                        menuSearchInput.style.borderColor = 'red';
                        menuSearchInput.style.backgroundColor = '#f8d7da'; 
                    }
                });
        
                menuSearchInput.addEventListener('input', function () {
                    if (menuSearchInput.value.trim() !== '') {
                        menuSearchInput.style.borderColor = '';
                        menuSearchInput.style.backgroundColor = ''; 
                    }
                });
            }

            if (authButton) {
                authButton.addEventListener('click', function () {
                    if (!localStorage.getItem('username')) {
                        showAuthModal();
                    }
                });
            } else {
                console.error('authButton не найден!');
            }

            if (closeAuthButton) {
                closeAuthButton.addEventListener('click', closeModal);
            } else {
                console.error('closeAuthButton не найден!');
            }

            window.addEventListener('click', function (event) {
                if (event.target === authModal) {
                    closeModal();
                }
            });

            if (logoutButton) {
                logoutButton.addEventListener('click', function () {
                    localStorage.removeItem('username');
                    localStorage.removeItem('userPhoneNumber');
                    loginName.textContent = '';
                    userLogin.style.display = 'none';
                    authButton.style.display = 'block';
                });
            } else {
                console.error('logoutButton не найден!');
            }

            if (logInForm) {
                logInForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    const username = usernameInput.value.trim();
                    const password = passwordInput.value.trim();

                    if (!username || !password) {
                        alert('Введіть ім\'я користувача та пароль');
                        return;
                    }

                    localStorage.setItem('username', username);
                    loginName.textContent = username;
                    closeModal();
                    userLogin.style.display = 'block';
                    authButton.style.display = 'none';
                    showPhoneModal();
                });
            } else {
                console.error('logInForm не найден!');
            }

            if (submitPhoneNumberButton) {
                submitPhoneNumberButton.addEventListener('click', function () {
                    const phoneNumber = phoneNumberInput.value.trim();
                    if (!phoneNumber) {
                        phoneNumberInput.style.borderColor = 'red';
                        phoneNumberInput.setAttribute('placeholder', 'Будь ласка, введіть номер телефону');
                        setTimeout(() => { 
                            phoneNumberInput.style.borderColor = ''; 
                            phoneNumberInput.setAttribute('placeholder', 'Ваш номер телефону'); 
                        }, 1000); 
                        return;
                    }
                    localStorage.setItem('userPhoneNumber', phoneNumber);
                    closePhoneModalFunction();
                });
            } else {
                console.error('submitPhoneNumberButton не найден!');
            }

            if (closePhoneModalButton) {
                closePhoneModalButton.addEventListener('click', closePhoneModalFunction);
            } else {
                console.error('closePhoneModalButton не найден!');
            }

            loadMenu();
            renderRestaurants();
        })
        .catch(error => {
            console.error('Ошибка загрузки данных ресторанов:', error);
        });
});
