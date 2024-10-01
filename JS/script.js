const menu_cards = document.querySelectorAll('.menu_card');

const menu_container = document.querySelector('#menu_container');

const cart_title = document.querySelector("#cart_title span");
const cart_list = document.querySelector("#cart_list");
const cart_list_default = document.querySelector("#cart_list_default");
const cart_empty_icon = document.querySelector("#cart_empty_icon");
const text = document.querySelector("#text");
const cart_ul = document.querySelector('#cart_ul');

const nav_cart_title = document.querySelector("#nav_cart_title span");
const nav_cart_list = document.querySelector("#nav_cart_list");
const nav_cart_list_default = document.querySelector("#nav_cart_list_default");
const nav_cart_empty_icon = document.querySelector("#nav_cart_empty_icon");
const nav_text = document.querySelector("#nav_text");
const nav_cart_ul = document.querySelector('#nav_cart_ul');

const orderConfirm_dialog = document.querySelector("#orderConfirm_dialog");
const nav_Cartmodal_dialog = document.querySelector("#nav_Cartmodal_dialog");

const confirm_menu_list_container = document.querySelector('#confirm_menu_list_container');

const nav_cart_close = document.querySelector("#nav_cart_close");

const cart_data = [];

const nav_item = document.querySelector(".nav_item");

const getMenu = async () => {
    try {
        // Fetch local JSON data
        const res = await fetch("./DATA/data.json");
        const data = await res.json();

        // Iterate over the data array from JSON
        data.forEach(item => {
            // Create the menu card container
            const menu_card = document.createElement("div");
            menu_card.classList.add("menu_card");

            // Create the image container and add image
            const img_container = document.createElement("div");
            img_container.classList.add("img_container");
            const menu_img = document.createElement("img");
            menu_img.classList.add("menu_img");

            // Set the image source (desktop version for this case)
            menu_img.src = item.image.desktop; // Fetch desktop image from the JSON

            img_container.appendChild(menu_img);
            menu_card.appendChild(img_container);

            // Create the menu button container
            const menu_button = document.createElement("div");
            menu_button.classList.add("menu_Button");
            menu_button.innerHTML =
                `
                    <img id="icon" src="./DATA/assets/images/icon-add-to-cart.svg" alt="Add to Cart">
                    <p id="text">Add to Cart</p>
                `;
            menu_card.appendChild(menu_button);

            // Add click event to menu button
            menu_button.addEventListener("click", () => {

                menu_button.style.pointerEvents = "none";
                menu_button.style.cursor = "default";

                addToCart(item, null);

                const result = cart_data.find(cart_item => (cart_item.menuItem.name.toLowerCase().replace(/\s/g, '') === item.name.toLowerCase().replace(/\s/g, '')));

                menu_button.style.backgroundColor = "rgb(197, 60, 16)";

                menu_button.innerHTML =
                    `
                        <div class="qty_container">         
                            <div class="circle_decrease_container">
                                <img id="decrease_qty" src="./DATA/assets/images/icon-decrement-quantity.svg" alt="decrease qty">                                                
                            </div>                                  
                            <span class="qty_value">${result.menuQty}</span>
                            <div class="circle_increase_container">
                                <img id="increase_qty" src="./DATA/assets/images/icon-increment-quantity.svg" alt="increase qty">                                                
                            </div>                        
                        </div>                    
                    `;

                const circle_decrease_container = menu_button.querySelector(".circle_decrease_container");
                const circle_increase_container = menu_button.querySelector(".circle_increase_container");
                const qty_value = menu_button.querySelector(".qty_value");

                circle_decrease_container.addEventListener("click", () => {
                    if (result.menuQty > 1) {
                        addCartItem(item, -1);
                    }
                });

                circle_increase_container.addEventListener("click", () => {
                    addCartItem(item, 1);
                });
            });

            // Optionally add description container
            const description_container = document.createElement("div");
            description_container.classList.add("description_container");
            description_container.innerHTML =
                `
                    <p id ="menu_title">${item.name}</p>
                    <p id ="menu_category">${item.category}</p>
                    <p id ="menu_price">$${item.price}</p>
                `;
            menu_card.appendChild(description_container);

            // Append each menu card to the grid container
            menu_container.appendChild(menu_card);
        });
    } catch (error) {
        console.error("Error loading API data", error);
    }
};

function menuCardIncreaseDecreaseBtn(item, menu_button) {
    const result = cart_data.find(cart_item => (cart_item.menuItem.name.toLowerCase().replace(/\s/g, '') === item.name.toLowerCase().replace(/\s/g, '')));

    menu_button.style.backgroundColor = "rgb(197, 60, 16)";

    menu_button.innerHTML =
        `
            <div class="qty_container">         
                <div class="circle_decrease_container">
                    <img id="decrease_qty" src="./DATA/assets/images/icon-decrement-quantity.svg" alt="decrease qty">                                                
                </div>                                  
                <span class="qty_value">${result.menuQty}</span>
                <div class="circle_increase_container">
                    <img id="increase_qty" src="./DATA/assets/images/icon-increment-quantity.svg" alt="increase qty">                                                
                </div>                        
            </div>                    
        `;

    const circle_decrease_container = menu_button.querySelector(".circle_decrease_container");
    const circle_increase_container = menu_button.querySelector(".circle_increase_container");
    const qty_value = menu_button.querySelector(".qty_value");

    circle_decrease_container.addEventListener("click", () => {
        if (result.menuQty > 1) {
            qty_value.textContent = result.menuQty - 1;
        }
    });

    circle_increase_container.addEventListener("click", () => {
        qty_value.textContent = result.menuQty;
    });
}

//confirm order Button
function confirmOrderBtn(itemTotalCartPrice) {

    //just call one time  confirm order Button    
    if (!document.getElementById("confirm_order_btn")) {
        const cart_total = document.createElement("div");
        cart_total.innerHTML =
            `
            <div class="cart_total">
                <p>Order Total</p>
                <div class="cart_total_price">$${itemTotalCartPrice}</div>
            </div>
            <div id="confirm_order_btn">Confirm Order</div>
        `;
        cart_ul.appendChild(cart_total);
    } else {
        //update Cart Total Price
        const cartTotalPriceElement = document.querySelector('.cart_total_price');

        if (cartTotalPriceElement) {
            cartTotalPriceElement.textContent = `$${itemTotalCartPrice}`;
        }
    }

    const confirm_order_btn = document.querySelector("#confirm_order_btn");
    confirm_order_btn.addEventListener("click", () => {

        orderConfirm_dialog.showModal();

        showDataModal(itemTotalCartPrice);

        //clear all cart data   
        cart_data.length = 0;

        // for Reset Cart Item UI
        CartItemUI();

        // for Reset Menu Cart Button UI
        ResetMenuCardBtn();
    });
}

//Add to Cart 
function addToCart(item, action) {

    //clear previous modal cart UI
    confirm_menu_list_container.innerHTML = '';

    // Add or update the cart data
    addCartItem(item, action);

    // show Cart UI;
    CartItemUI();
}

//Add Data to Array 
function addCartItem(item, action) {
    const existingItem = cart_data.find(data => data.menuItem.name === item.name);

    if (existingItem) {
        if (action === -1) {
            existingItem.menuQty -= 1;
        } else if (action === 1) {
            existingItem.menuQty += 1;
        }
        existingItem.menuTotalPrice = parseFloat(item.price) * existingItem.menuQty;
    } else {
        let qty = 1;

        const itemTotalPrice = parseFloat(item.price) * qty;
        cart_data.push({ menuItem: item, menuQty: qty, menuTotalPrice: itemTotalPrice });
    }
}

//Remove Data from Array 
function deleteCartItem(index, data) {
    //Remove data from local Cart_Data Array
    cart_data.splice(index, 1);

    //Update CartItem UI;
    CartItemUI();

    //Update NavCarItem UI;   
    navCartItemUI();

    //Reset Menu Card to default UI
    ResetMenuCardBtn(data);
}

function ResetMenuCardBtn(data) {

    const menu_card = document.querySelectorAll('.menu_card');

    menu_card.forEach((menu_card) => {
        const menuTitle = menu_card.querySelector('#menu_title');

        const menu_button = menu_card.querySelector('.menu_Button');
        menu_button.style.pointerEvents = "auto";
        menu_button.style.cursor = "pointer";

        if (data) {
            if (menuTitle.textContent.toLowerCase().replace(/\s/g, '') == data.menuItem.name.toLowerCase().replace(/\s/g, '')) {

                menu_button.style.backgroundColor = '';
                menu_button.innerHTML =
                    `
                     <img id="icon" src="./DATA/assets/images/icon-add-to-cart.svg" alt="Add to Cart">
                     <p id="text">Add to Cart</p>
                 `;
                menu_card.appendChild(menu_button);
            }
        } else {
            menu_button.style.backgroundColor = '';
            menu_button.innerHTML =
                `
                 <img id="icon" src="./DATA/assets/images/icon-add-to-cart.svg" alt="Add to Cart">
                 <p id="text">Add to Cart</p>
             `;
            menu_card.appendChild(menu_button);
        }
    })
}

// show Cart UI 
function CartItemUI() {

    let itemTotalCartPrice = 0;

    // Update the cart title
    cart_title.textContent = cart_data.length;

    // Clear the existing cart items in the UI
    cart_list.innerHTML = '';

    if (cart_data.length > 0) {

        cart_list_default.style.display = 'none';

        cart_data.forEach((data, index) => {
            const cart_item = document.createElement("li");
            cart_item.style.listStyleType = 'none';
            cart_item.innerHTML =
                `
                    <div class="cart_item">                
                        <div class="cart_item_info">
                            <div class="cart_item_title">${data.menuItem.name}</div>
                            <div class="cart_price_qty">
                                <div class="cart_item_qty">${data.menuQty}</div>                        
                                <div class="cart_result">x</div>                        
                                <div class="cart_item_price">$${data.menuItem.price}</div>
                                <div class="cart_result">=</div>
                                <div class="cart_item_total_price">$${data.menuTotalPrice}</div>
                            </div>
                            </div>  
                        <div class="circle_cart_item_delete_container">
                           <img id="cart_delete" src="./DATA/assets/images/icon-remove-item.svg" alt="Delete">
                        </div>                                                                                         
                    </div>            
                    <hr>           
                `;
            cart_list.appendChild(cart_item);

            itemTotalCartPrice += data.menuTotalPrice;

            // Add event listener to the parent container        
            const deleteBtn = cart_item.querySelector('.circle_cart_item_delete_container');
            deleteBtn.addEventListener('click', () => {
                deleteCartItem(index, data);
            });

        });

        //show confirm order button
        confirmOrderBtn(itemTotalCartPrice);
    } else {
        cart_list_default.style.display = 'flex';

        const cart_total = document.querySelector('.cart_total');
        const confirm_order_btn = document.querySelector('#confirm_order_btn');

        if (cart_total && confirm_order_btn) {
            cart_total.remove();
            confirm_order_btn.remove();
        }
    }
}

//confirm order Button
function nav_confirmOrderBtn(itemTotalCartPrice) {

    //just call one time  confirm order Button    
    if (!document.getElementById("nav_confirm_order_btn")) {
        const nav_cart_total = document.createElement("div");
        nav_cart_total.innerHTML =
            `
            <div class="nav_cart_total">
                <p>Order Total</p>
                <div class="nav_cart_total_price">$${itemTotalCartPrice}</div>
            </div>
            <div id="nav_confirm_order_btn">Confirm Order</div>
        `;
        nav_cart_ul.appendChild(nav_cart_total);
    } else {
        //update Cart Total Price
        const cartTotalPriceElement = document.querySelector('.nav_cart_total_price');
        if (cartTotalPriceElement) {
            cartTotalPriceElement.textContent = `$${itemTotalCartPrice}`;
        }
    }

    const nav_confirm_order_btn = document.querySelector("#nav_confirm_order_btn");
    nav_confirm_order_btn.addEventListener("click", () => {

        nav_Cartmodal_dialog.close();

        orderConfirm_dialog.showModal();

        showDataModal(itemTotalCartPrice);

        //clear all cart data   
        cart_data.length = 0;

        // for Reset Cart Item UI
        navCartItemUI();

        // for Reset Menu Cart Button UI
        ResetMenuCardBtn();

    });
}

// show nav Cart UI 
function navCartItemUI() {

    let itemTotalCartPrice = 0;

    // Update the cart title
    nav_cart_title.textContent = cart_data.length;

    // Clear the existing cart items in the UI
    nav_cart_list.innerHTML = '';

    if (cart_data.length > 0) {

        nav_cart_list_default.style.display = 'none';

        cart_data.forEach((data, index) => {
            const nav_cart_item = document.createElement("li");
            nav_cart_item.style.listStyleType = 'none';
            nav_cart_item.innerHTML =
                `
                    <div class="nav_cart_item">                
                        <div class="nav_cart_item_info">
                            <div class="nav_cart_item_title">${data.menuItem.name}</div>
                            <div class="nav_cart_price_qty">
                                <div class="nav_cart_item_qty">${data.menuQty}</div>                        
                                <div class="nav_cart_result">x</div>                        
                                <div class="nav_cart_item_price">$${data.menuItem.price}</div>
                                <div class="nav_cart_result">=</div>
                                <div class="nav_cart_item_total_price">$${data.menuTotalPrice}</div>
                            </div>
                            </div>  
                        <div class="nav_circle_cart_item_delete_container">
                           <img id="nav_cart_delete" src="./DATA/assets/images/icon-remove-item.svg" alt="Delete">
                        </div>                                                                                         
                    </div>            
                    <hr>           
                `;
            nav_cart_list.appendChild(nav_cart_item);

            itemTotalCartPrice += data.menuTotalPrice;

            // Add event listener to the parent container        
            const nav_deleteBtn = nav_cart_item.querySelector('.nav_circle_cart_item_delete_container');
            nav_deleteBtn.addEventListener('click', () => {
                deleteCartItem(index, data);
            });

        });

        //show confirm order button
        nav_confirmOrderBtn(itemTotalCartPrice);
    } else {
        nav_cart_list_default.style.display = 'flex';

        const nav_cart_total = document.querySelector('.nav_cart_total');
        const nav_confirm_order_btn = document.querySelector('#nav_confirm_order_btn');

        if (nav_cart_total && nav_confirm_order_btn) {
            nav_cart_total.remove();
            nav_confirm_order_btn.remove();
        }
    }
}

//Show data on Modal 
function showDataModal(itemTotalCartPrice) {    

    cart_data.forEach((item) => {

        const cart_item = document.createElement("div");
        cart_item.classList.add("cart_item");
        cart_item.innerHTML =
            `                                                                                 
                <div class="modal_item">
                    <img class ="modal_item_img" src="${item.menuItem.image.desktop}" alt="menu item"/>
                    <div class="modal_item_info_container">
                        <div class="modal_item_title">${item.menuItem.name}</div>
                        <div class="modal_item_price_qty">
                            <div class="modal_item_price">$${item.menuItem.price}</div>                                 
                            <div class="modal_item_qty">x ${item.menuQty}</div>    
                        </div>
                    </div>
                    <div class="modal_item_total_price_container">
                        <div class="modal_item_TotalPrice">$${item.menuTotalPrice}</div>                    
                    </div>
                </div>
            `;
        confirm_menu_list_container.appendChild(cart_item);
    });

    if (!document.getElementById("modal_total_price")) {        
        const cart_total = document.createElement("div");
        cart_total.classList.add("cart_total");
        cart_total.innerHTML =
            `                                  
                    <hr>                                               
                    <div class="modal_total_price_container">
                        <p>Order Total</p>
                        <div id="modal_total_price">$${itemTotalCartPrice}</div>
                    </div>
                `;
        confirm_menu_list_container.appendChild(cart_total);
    } else {        
        const modaltotalprice = document.querySelector('#modal_total_price');
        if (modaltotalprice) {
            modaltotalprice.textContent = `$${itemTotalCartPrice}`;
        }
    }
};

nav_item.addEventListener("click", () => {

    //clear previous modal cart UI
    confirm_menu_list_container.innerHTML = '';

    navCartItemUI();

    //show modal
    nav_Cartmodal_dialog.showModal();
});

nav_cart_close.addEventListener("click", () => {
    nav_Cartmodal_dialog.close();
});

// Main call for everythings! :)
getMenu();