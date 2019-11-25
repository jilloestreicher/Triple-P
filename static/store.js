/*
 * File: server.js
 * Authors: TripleP (Alex Smith, Herbert Glaser, Kaitlyn Dominguez)
 * Version: 1.2
 *
 * Main store javascript with stripe and cart functionality
 */

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
function CheckBrowser() {
    if ('localStorage' in window && window['localStorage'] !== null) {
        // We can use localStorage object to store data.
        return true;
    } else {
            return false;
    }
}
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        console.log("Button Added")
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

var stripeHandler = StripeCheckout.configure({

    key: stripePublicKey,
    locale: 'en',
    token: function(token) {

        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity = quantityElement.value
            var id = cartRow.dataset.itemId

            items.push({
                id: id,
                quantity: quantity
            })

        }

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
           // alert(data.message)
           console.log("Reached")
           document.forms["payment"].submit();
            var cartItems = document.getElementsByClassName('cart-items')[0]
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal()
        }).catch(function(error) {
            console.error(error)
        })
    }
})

function purchaseClicked() {
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerHTML.replace('$', '')) * 100
    console.log(price)
    stripeHandler.open({
        amount: price

    })
}

function removeCartItem(event) {
    var buttonClicked = event.target
    var key = buttonClicked.parentElement.parentElement.id;

    var deleteItem = localStorage.removeItem(key)
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target

    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    console.log("Adding to Cart")
    var button = event.target
    var shopItem = button.parentElement.parentElement.parentElement.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var id = shopItem.dataset.itemId
    var pageCheck = document.getElementsByClassName("page-title")[0].innerText;
     if(pageCheck == "POST A LISTING"){
     id=9999
     var full = {
                 "title": title,
                 "price": price,
                 "imageSrc": imageSrc,
                 "id": id
             }
             addItemToCart(title, price, imageSrc, id)
                 updateCartTotal()
     }
else{
    var full = {
            "title": title,
            "price": price,
            "imageSrc": imageSrc,
            "id": id
        }
    localStorage.setItem(id, JSON.stringify(full))
    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
}

}

function addItemToCart(title, price, imageSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
     var pageCheck = document.getElementsByClassName("page-title")[0].innerText;
    

         if(pageCheck == "POST A LISTING"){
              var chekr = document.getElementById("carto").value
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" style="width:0px;height:0px;">
            <span class="cart-item-title" style="font-size:0px">${title}</span>
        </div>
        <span class="cart-price cart-column" style="font-size:0px">${price}</span>
        <div class="cart-quantity cart-column" style="width:0px;height:0px;">
            <input class="cart-quantity-input" type="number" id="invisibleQuant" value="0" style="width:0px;height:0px;">
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    document.getElementById("invisibleQuant").value = chekr;
    }

    else{
    var cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>`
        cartRow.innerHTML = cartRowContents
        cartItems.append(cartRow)
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)

    }

     
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price cart-column')[0]
        console.log(priceElement.innerHTML)
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        console.log(quantityElement)
        var price = parseInt(priceElement.innerHTML.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
        console.log("cart total price"+ price + "  " + quantity );
    }
    total = Math.round(total * 100)/100
    document.getElementsByClassName('cart-total-price')[0].innerHTML = '$' + total
    var numItems = $('.cart-row').length;
    var pageCheck = document.getElementsByClassName("page-title")[0].innerText;
    if (pageCheck == "CART"){}
    else if(pageCheck == "POST A LISTING"){
     var total = 0
        var quantityElement = document.getElementById('carto').value

        total = (500 * quantityElement)
        displayTotal = Math.round(total)/100
        document.getElementsByClassName('cart-total-price')[0].innerHTML = '$' + displayTotal
        console.log("total= "+ displayTotal)
    }
    else{
    document.getElementsByClassName("cart-quantity")[0].innerHTML = "("+ (numItems-1) +")";
    }
}

function populateCart() {
    if (CheckBrowser()) {
        var key = "";

        var i = 0;
        //For a more advanced feature, you can set a cap on max items in the cart.
        for (i = 0; i <= localStorage.length-1; i++) {
            key = localStorage.key(i);
            if (key == "lsid"){


            }
            else{
            keyer = localStorage.getItem(key);
            var parser = JSON.parse(keyer);
            console.log(parser.title+"  "+parser.price);
            var cartRow = document.createElement('div')
            cartRow.setAttribute("id", key);
                cartRow.classList.add('cart-row')
                cartRow.dataset.itemId = parser.id;
                var cartItems = document.getElementsByClassName('cart-items')[0]
                var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
               /* for (var i = 0; i < cartItemNames.length; i++) {
                     if (cartItemNames[i].innerText == key[0]) {
                        alert('This item is already added to the cart')
                     return;
                     }
                 }
                 */
                 var cartRowContents = `
                         <div class="cart-item cart-column">
                             <img class="cart-item-image" src="${parser.imageSrc}" width="100" height="100">
                             <span class="cart-item-title">${parser.title}</span>
                         </div>
                         <span class="cart-price cart-column">${parser.price}</span>
                         <div class="cart-quantity cart-column">
                             <input class="cart-quantity-input" type="number" value="1">
                             <button class="btn btn-danger" type="button">REMOVE</button>
                         </div>`
                     cartRow.innerHTML = cartRowContents
                     cartItems.append(cartRow)
                     cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
                     cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
                     updateCartTotal();

}
        }

    } else {
        alert('Cannot save shopping list as your browser does not support HTML 5');
    }
}

function allOnloads(){
    populateCart();
    fetch('/checkSession');
    fetch('/changeLoginButton');
}

function ClearAll() {
    localStorage.clear();
    location.reload();
}
