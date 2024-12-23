document.addEventListener('DOMContentLoaded', function () {
    
    fetch('db/partners.json')
        .then(response => response.json())
        .then(restaurantsData => {
            const menuContainer = document.getElementById('menuContainer');
            const menuSearchInput = document.getElementById('menuSearchInput');
            const restaurantInfo = document.querySelector('.restaurant-info');
            const searchInput = document.querySelector('.input-search');
            const authModal = document.getElementById('authModal');
            const authButton = document.getElementById('authButton');
            const restaurantTitle = document.querySelector('.restaurant-title');
            const logoutButton = document.getElementById('logoutButton');
            const clearMenuSearch = document.getElementById('clearMenuSearch');
            const logInForm = document.getElementById('logInForm');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const clearSearchButton = document.getElementById('clearSearch');
            const userLogin = document.getElementById('userLogin');
            const loginName = document.getElementById('loginName');
            const closeAuthButton = document.getElementById('closeAuth');
            
            function resetInputStyles() {
                usernameInput.style.borderColor = '';
                passwordInput.style.borderColor = '';
            }

            function renderMenu(menuData = []) {
                if (!menuContainer) {
                    console.error('menuContainer не найден!');
                    return;
                }

                menuContainer.innerHTML = '';
                menuData.forEach(item => {
                    const menuCard = `
                        <div class="card">
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

            function showAuthModal() {
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                authModal.style.display = 'none';
                document.body.style.overflow = '';
                resetInputStyles();
                resetInputFields();
            }

            function resetInputFields() {
                usernameInput.value = '';
                passwordInput.value = '';
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

            if (logInForm) {
                logInForm.addEventListener('submit', function (event) {
                    event.preventDefault();

                    let hasError = false;

                    if (usernameInput.value.length < 4 || usernameInput.value.length > 16) {
                        usernameInput.style.borderColor = 'red';
                        hasError = true;
                    } else {
                        usernameInput.style.borderColor = '';
                    }

                    if (passwordInput.value.length < 6 || passwordInput.value.length > 20) {
                        passwordInput.style.borderColor = 'red';
                        hasError = true;
                    } else {
                        passwordInput.style.borderColor = '';
                    }

                    if (hasError) {
                        return;
                    }

                    localStorage.setItem('username', usernameInput.value);

                    authButton.style.display = 'none';
                    logoutButton.style.display = 'block';
                    userLogin.style.display = 'block';
                    loginName.textContent = usernameInput.value;

                    closeModal();
                });
            } else {
                console.error('logInForm не найден!');
            }

            if (logoutButton) {
                logoutButton.addEventListener('click', function () {
                    localStorage.removeItem('username');
                    authButton.style.display = 'block';
                    logoutButton.style.display = 'none';
                    userLogin.style.display = 'none';
                });
            } else {
                console.error('logoutButton не найден!');
            }

            const username = localStorage.getItem('username');
            if (username) {
                authButton.style.display = 'none';
                logoutButton.style.display = 'block';
                userLogin.style.display = 'block';
                loginName.textContent = username;
            }

            renderRestaurants();

            if (window.location.pathname.includes("restaurant.html")) {
                loadMenu();
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных ресторанов:', error);
        });
});
