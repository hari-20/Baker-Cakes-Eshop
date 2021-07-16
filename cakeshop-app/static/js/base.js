
  let products;
  // Fetching Product data from API
  $.ajax({url: "http://127.0.0.1:8000/productlist/", success: function(response){
    let resp = JSON.parse(JSON.stringify(response));
    products = resp.result;
    renderProducts();
    getOrders();
  }
});

// Rendering products in home and special page

 function renderProducts(){
    $("#menu-items").html('');
    let menu_content = $("#menu-items").html(); 

    Object.values(products).map(item => {
    if(item.type != "Special")
    menu_content += `
    <div class="col-md-5 col-lg-4 col-xl-3 mb-5">
          <div class="card rounded">
              <div class="card-image">
                  <span class="card-notify-badge">${item.type}</span>
                  <span class="card-notify-year">new</span>
                  <img class="img-fluid" src="./static/images/${item.id}.png" alt="Alternate Text" />
              </div>

              <div class="card-body">
                  <div class="row mx-0">
                      <h6 class="font-weight-bold">${item.name}</h6>
                      <p class="ml-auto font-italic">${item.weight}</p>
                  </div>

                  <div class="row mx-0">
                    <h6 class="card-text font-weight-bold pb-2"> &#8377; ${item.s_price} </h6>
                    <small class="card-text ml-2"><s>&#8377; ${item.mr_price} </s></small>
                    <small class="card-text ml-4 font-weight-bold" style="color:green"> ${item.discount}</small>
                    <p class="card-text ml-auto font-weight-bold star-rating">
                      ${item.rating}
                        <i class="fa fa-star-half-o" aria-hidden="true"></i>
                    </p>
                  </div> 

                  <a class="card-btn add-cart" onclick= "addCart('${item.id}',event);" href="#">Order</a>
              </div>
          </div>
      </div>
    `;
    
    });

    $("#menu-items").html(menu_content);

    // Special Menu Items
    $("#special-items").html('');
    let special_content = $("#special-items").html(); 
    
    Object.values(products).map(item => {

        if(item.type == "Special")
        special_content += `
        <div class="col-md-5 col-lg-4 col-xl-3 mb-5">
              <div class="card rounded">
                  <div class="card-image">
                      <span class="card-notify-badge">${item.type}</span>
                      <span class="card-notify-year">new</span>
                      <img class="img-fluid" src="./static/images/${item.id}.png" alt="Alternate Text" />
                  </div>
    
                  <div class="card-body">
                  
                    <div class="row mx-0">
                        <h6 class="font-weight-bold">${item.name}</h6>
                         <p class="ml-auto font-italic">${item.weight}</p>
                    </div>
    
                      <div class="row mx-0">
                        <h6 class="card-text font-weight-bold pb-2"> &#8377; ${item.s_price} </h6>
                        <small class="card-text ml-2"><s>&#8377; ${item.mr_price} </s></small>
                        <small class="card-text ml-4 font-weight-bold" style="color:green"> ${item.discount}</small>
                        <p class="card-text ml-auto font-weight-bold star-rating">
                          ${item.rating}
                            <i class="fa fa-star-half-o" aria-hidden="true"></i>
                        </p>
                      </div> 
    
                      <a class="card-btn add-cart" onclick="addCart('${item.id}',event);" href="#">Order</a>
                  </div>
              </div>
          </div>
        `;
        
        });
    
        $("#special-items").html(special_content);
   

}


 function renderOrders(ordersJson){
     $("#product-orders").html('');
     let order_content = $("#product-orders").html();
     
     Object.values(ordersJson).map( item=> {
        let cname = item.name;
        let date = item.odate;
        let pname = item.product_desc.name;
        let qty = item.product_desc.qty;
        let price = item.product_desc.price;
        let ostatus = item.ostatus;

        order_content += `
        <tr class="table_row border-top">
                  <th scope="row" class="border-0">
                    <div class="p-2">
                      <img src="./static/images/${item.product_desc.id}.png" alt="" width="70" class="img-fluid rounded shadow-sm">
                      <div class="ml-3 d-inline-block align-middle">
                        <small class="text-muted font-weight-normal d-block">${item.oid}</small>
                        <h5 class="mb-0"> <a href="#" class="text-dark d-inline-block align-middle">${item.product_desc.name}</a></h5><span class="text-muted font-weight-normal font-italic d-block">Weight: ${item.product_desc.weight}</span>    
                      </div>
                    </div>
                  </th>
                  <td class="border-0 align-middle"><strong>&#8377;${item.product_desc.price}</strong></td>
                  <td class="border-0 align-middle">

 
                     <div id="item-qty">
                     ${item.product_desc.qty}
                     </div>
                  
                </td>
                  <td class="border-0 align-middle"><strong>&#8377;${item.product_desc.price * item.product_desc.qty}</strong></td>
                  <td class="border-0 align-middle"><button type="button" class="btn btn-primary launch" onclick="trackOrder('${cname}','${date}','${pname}','${qty}','${price}','${ostatus}')" data-toggle="modal" data-target="#staticBackdrop"> <i class="fa fa-truck"></i> Track Order
                  </button></td>
                </tr>

        `;
     
    }

     );

     $("#product-orders").html(order_content);
 }

 function countdownTimer() {
    const difference = +new Date("2021-05-05") - +new Date();
    let remaining = "0 Seconds";

    if (difference > 0) {
       const parts = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
       };

       remaining = Object.keys(parts).map(part => {
       return `${parts[part]} ${part}`;
       }).join(" ");
    }

    $(".sale-timer").html(remaining);
 }

 countdownTimer();
 setInterval(countdownTimer, 1000);

 function trackOrder(cname,date,pname,qty,price,ostatus){

    $('.order-cname').html(cname);
    $('.order-date').html(date.slice(0,10));
    $('.order-pname').html(`${pname}(Qty:${qty})`);
    $('.order-stotal').html(`&#8377;${parseInt(qty)*parseInt(price)}`);
    $('.order-total').html(`&#8377;${parseInt(qty)*parseInt(price)}`);

    if(ostatus == "ordered"){
        if(!$("#step1").hasClass("active")) $("#step1").addClass("active");
        if( $("#step2").hasClass("active")) $("#step2").removeClass("active");
        if($("#step3").hasClass("active")) $("#step3").removeClass("active");
        if($("#step4").hasClass("active")) $("#step4").removeClass("active");
    }

    else if(ostatus == "prepared") {
        if(!$("#step1").hasClass("active")) $("#step1").addClass("active");
        if(!$("#step2").hasClass("active")) $("#step2").addClass("active");
        if($("#step3").hasClass("active")) $("#step3").removeClass("active");
        if($("#step4").hasClass("active")) $("#step4").removeClass("active");
    }
    else if(ostatus == "on the way"){
        if(!$("#step1").hasClass("active")) $("#step1").addClass("active");
        if(!$("#step2").hasClass("active")) $("#step2").addClass("active");
        if(!$("#step3").hasClass("active")) $("#step3").addClass("active");
        if($("#step4").hasClass("active")) $("#step4").removeClass("active");
    }
    else if(ostatus == "delivered"){
        if(!$("#step1").hasClass("active")) $("#step1").addClass("active");
        if(!$("#step2").hasClass("active")) $("#step2").addClass("active");
        if(!$("#step3").hasClass("active")) $("#step3").addClass("active");
        if(!$("#step4").hasClass("active")) $("#step4").addClass("active");
    }
 }



// const spl_products = products.filter(item => item.type === 'Special');
// const norm_products = products.filter(item => item.type != 'Special');

function getOrders(){
    let userState = localStorage.getItem('userState');
  userState = JSON.parse(userState);
  

  if (userState) {
    let post_url = 'http://127.0.0.1:8000/get-customer-orders/';
    $.ajax({
        url: post_url,
        contentType: 'application/json',
        dataType: "json",
        type: "POST",
        data: JSON.stringify({ email: userState['user']['id']}),
        success: function (response) {
            let resp = JSON.parse(JSON.stringify(response));
            if (resp.result == "error" ) {
                $('.order-text').html("Something Went Wrong, Please try Again Later!");
            
            }
            else if(resp.result == "no orders"){
                $('.order-text').html("Your Orders is Empty!");
            }
            else{
                $('.order-text').html('');
                 renderOrders(resp.result);
            }

        },
        error: function (xhr) {
            //Do Something to handle error
             $('.order-text').html("Something Went Wrong, Please try Again Later!");
        }
    });

  }
   else{
        $(".order-text").html('Your Orders is Empty!');
   }

}



function addCart(prd_id,event){ 
            event.preventDefault();
            showAdd2Cart();
            const product = products.filter(item => item.id === prd_id);
            setItems(product[0]);  // adding selected Product description to local storage
            //cartNumbers(products[i]);
            totalCost(product[0],1);
    
}
    
    
    
    function onLoadcartNumbers(){
        let productNumbers = localStorage.getItem('cartNumbers');
        if(productNumbers){
            $('.cart-badge').attr("data-count", productNumbers);
        }else{
            $('.cart-badge').attr("data-count", "0");
        }
    }
    
    //local storage functions
    function cartNumbers (){
    
        let productNumbers = localStorage.getItem('cartNumbers');
        productNumbers = parseInt(productNumbers);
    
        if(productNumbers){
            localStorage.setItem('cartNumbers', productNumbers + 1);
            $('.cart-badge').attr("data-count", productNumbers + 1);
    
        } else {
            localStorage.setItem('cartNumbers', 1);
            $(".cart-badge").attr("data-count","1");
        }
    
    
    }
    
    //cart items updation
function setItems(product){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let qty = 1;

    prd = {
        name : '',
        id : '',
        price : 0,
        qty : 0,
        weight : '',
        subtotal : 0
    }

    // size = size.slice(5, size.length).toUpperCase(); // Actual size is available after a space in string
    

    // prd.size = size; // assigning user selected size 

    id = product.id;
    
    
    if(cartItems != null) {

        if(cartItems[id] == undefined){

            prd.name = product.name;
            prd.id = id;
            prd.weight = product.weight;
            prd.price = product.s_price;
            prd.subtotal = product.s_price;
            cartItems = {
                ...cartItems,
                [id] : prd
            }

            cartNumbers();

         }
        
         cartItems[id].qty += qty;
        
        }

        else{
            
        //product_temp.id = product_temp.id + '-' + size; // unique product id for different sizes    
        //console.log('LocalStorage Not available' + id);
        cartNumbers();
        prd.name = product.name;
        prd.id = id;
        prd.price = product.s_price;
        prd.weight = product.weight;
        prd.subtotal = product.s_price;

        prd.qty = qty;
        cartItems = {
            [id]: prd
        }
        
    }
    
    localStorage.setItem("productsInCart", JSON.stringify (cartItems));
}

//updation of product price 
function totalCost(product, qty) {
    let cartCost = localStorage.getItem('totalCost');

    if (cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + (product.s_price * qty));
    } else{
        localStorage.setItem("totalCost", product.s_price * qty);
    }

    
    }


//Displaying in Cart
function displayCart(){
    let cartItems = localStorage.getItem("productsInCart");
    let totalPrice = localStorage.getItem("totalCost");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.getElementById("product-cart");
    //let menucartcontainer = document.getElementById("right-menu-cart");
    
    if (cartItems && productContainer){
        document.getElementById("sub-total").innerHTML = "&#8377; "+ totalPrice;
        document.getElementById("cart-total").innerHTML = "&#8377; "+ totalPrice;
        document.getElementById("cart-total-1").innerHTML = "&#8377; "+ totalPrice;
        productContainer.innerHTML = '';
       
        Object.values(cartItems).map(item => {
            $(".cart-text").html('');
            //Item's Updating in Cart Page
            productContainer.innerHTML += 
                             `
                             <tr class="table_row border-top">
                             <th scope="row" class="border-0">
                               <div class="p-2">
                                 <img src="./static/images/${item.id}.png" alt="" width="70" class="img-fluid rounded shadow-sm">
                                 <div class="ml-3 d-inline-block align-middle">
                                   <h5 class="mb-0"> <a href="#" class="text-dark d-inline-block align-middle">${item.name}</a></h5><span class="text-muted font-weight-normal font-italic d-block">Weight: ${item.weight}</span>
                                 </div>
                               </div>
                             </th>
                             <td class="border-0 align-middle"><strong>&#8377;${item.price}</strong></td>
                             <td class="border-0 align-middle">

            
                                <div class="input-group plus-minus-input">
                                    <div class="input-group-button minus-btn" onclick="cart_qty_change(this,'${String(item.id)}',false);">
                                        <button type="button" class="button circle" data-quantity="minus" data-field="quantity">
                                        <i class="fa fa-minus" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                    <input class="input-group" id="item-qty" type="number" name="product-num" value="${item.qty}" readonly>
                                    <div class="input-group-button plus-btn" onclick="cart_qty_change(this,'${String(item.id)}',true);">
                                        <button type="button" class="button circle" data-quantity="plus" data-field="quantity">
                                        <i class="fa fa-plus" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                             
                           </td>
                             <td class="border-0 align-middle"><strong>&#8377;${item.subtotal}</strong></td>
                             <td class="border-0 align-middle"><a class="btn btn-outline-danger btn-round" onclick="removeCartItem(this,'${String(item.id)}')"> × Remove</a></td>
                           </tr>


                            `;
        });
    }

   
    
}

function alter_totalCost(price, isAdd){
    let cartCost = parseInt(localStorage.getItem('totalCost'));
    //let cartQty = parseInt(localStorage.getItem('cartNumbers'));

    if (isAdd){
        totalPrice = cartCost + price;
        document.getElementById("sub-total").innerHTML = "&#8377; "+ totalPrice;
        document.getElementById("cart-total").innerHTML = "&#8377; "+ totalPrice;
        document.getElementById("cart-total-1").innerHTML = "&#8377; "+ totalPrice;
        // cartQty += 1
        // $('div.icon-header-noti').attr("data-notify", cartQty);
        
        localStorage.setItem("totalCost",  totalPrice);
        //localStorage.setItem("cartNumbers",  cartQty);
        
    }
    else{
        totalPrice = cartCost - price;
        document.getElementById("sub-total").innerHTML = "&#8377; "+ totalPrice;
        document.getElementById("cart-total").innerHTML = "&#8377; "+ totalPrice;
        document.getElementById("cart-total-1").innerHTML = "&#8377; "+ totalPrice;
        
        //cartQty -= 1
        //$('div.icon-header-noti').attr("data-notify", cartQty);
        
        localStorage.setItem("totalCost",  totalPrice);
        //localStorage.setItem("cartNumbers",  cartQty);
    }
    
}  


// On qty change on product in cart

function cart_qty_change(e,itemId,isAdd){

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems){

       let prd_qty;
       let prd_sum = $(e).parent().parent().next().children();

       if (isAdd) prd_qty = $(e).prev();
       else prd_qty = $(e).next();

       let qty = Number (prd_qty.val());

       if(qty > 1 && isAdd==false) {
           qty -= 1;
           prd_qty.attr('value', qty);
           total = Number(cartItems[itemId]['price']) * qty;
           prd_sum.html('&#8377; ' + total);
           cartItems[itemId]['subtotal'] = total;
           cartItems[itemId]['qty'] -= 1;              
           localStorage.setItem("productsInCart", JSON.stringify (cartItems));
           alter_totalCost(cartItems[itemId]['price'], isAdd=false);                       
       }
       else if(qty >= 1 && isAdd==true){
           qty += 1;
           prd_qty.attr('value', qty);
           total = Number(cartItems[itemId]['price']) * qty;
           prd_sum.html('&#8377; ' + total);
           cartItems[itemId]['subtotal'] = total;
           cartItems[itemId]['qty'] += 1;              
           localStorage.setItem("productsInCart", JSON.stringify (cartItems));
           alter_totalCost(cartItems[itemId]['price'], isAdd=true);   
       }

   }
}


// Delete items in cart

function removeCartItem(e,itemId){
    let price = parseInt();
    let qty = parseInt();
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    price = cartItems[itemId].price;
    qty = cartItems[itemId].qty;
    
    delete cartItems[itemId];

    let totalCost = localStorage.getItem("totalCost");
    totalCost -= parseInt(price) * parseInt(qty);
    document.getElementById("sub-total").innerHTML = "&#8377; "+ totalCost;
    document.getElementById("cart-total").innerHTML = "&#8377; "+ totalCost;
    document.getElementById("cart-total-1").innerHTML = "&#8377; "+ totalCost;

    let cartNumbers = localStorage.getItem("cartNumbers");
    cartNumbers -= 1; 
    
    $('.cart-badge').attr("data-count", cartNumbers);
    localStorage.setItem("productsInCart", JSON.stringify (cartItems));
    localStorage.setItem("totalCost", JSON.stringify (totalCost));
    localStorage.setItem("cartNumbers", JSON.stringify (cartNumbers));

    $(e).closest('.table_row').remove();

    
 }


 function showAdd2Cart() {
    $("#snackbar").attr('class','show');
    setTimeout(function(){$("#snackbar").attr('class',''); }, 3000);
  }


// On PageReload Cart Numbers Should be Updated
    onLoadcartNumbers();
    displayCart();

    document.onreadystatechange = function() {
      if (document.readyState !== "complete") {
          document.querySelector(
            "body").style.visibility = "hidden";
          document.querySelector(
            "#loader").style.visibility = "visible";
      } else {
          document.querySelector(
            "#loader").style.display = "none";
          document.querySelector(
            "body").style.visibility = "visible";
      }
  };

  // Scroll Back to Top
  $(document).ready(function(){
	$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		// scroll body to 0px on click
		$('#back-to-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 400);
			return false;
		});
});



(function ($) {

    function signedinCheck() {

        let userState = localStorage.getItem('userState');
        userState = JSON.parse(userState);
        if (userState) {

            $('.signin-out').html('Sign Out');
            $('.user-name').html('Hi, ' + userState['user']['name']);
            $('.signin-out').attr('data-target', '.signout-modal-sm');
            $('.signin-out').removeClass("js-signin-modal-trigger");
            $('.js-signin-modal').css('visibility', 'hidden');
            $('#signout-body').css('visibility', 'visible');
            $('#signout-msg').css('visibility', 'hidden');
            $('#signout-btn').attr('disabled', false);
            $('#signout-btn').css('cursor', 'pointer');

        }

    }

    $('#signout-btn').on('click', function signout() {
        $(this).attr('disabled', true);
        $(this).css('cursor', 'no-drop');
        $('#signout-body').css('visibility', 'hidden');
        $('#signout-msg').css('visibility', 'visible');

        localStorage.removeItem('userState');

        setTimeout(() => { location.reload(); }, 2000);

    });

    $(window).on('load', signedinCheck());

    // Send Order Confirmation Email to Customers
    function sendEmail(email,uname,products){

        Object.values(products).map( item =>{

        Email.send({
        SecureToken : "9de3fc25-61d9-402e-905a-7291a26ddb8a",
        To : email,
        Username: "BakerCakes",
        From : "sri28vignesh@gmail.com",
        Subject : `Your Order for ${item.name} has been successfully placed`,
        Body : `Hi ${uname}, <br>  
        We are committed to serving you with utmost regard for your safety. Please note, the delivery time of your order may change based on the government's zonal advisory in your area. <br><br>
        Track your order <a href="http://127.0.0.1:5500/myorders.html">here </a> for further information. <br> <br>
        <h3>Amount Payable on Delivery &nbsp;&nbsp;&nbsp; Rs. ${item.subtotal}</h3> <hr> <br><br>
        <h4>Thank you for ordering with BakerCakes! </h4>   
        `
            }).then(
                message => console.log(message)
                )

        });     
     }
    
    // Place order action
    $('#checkout-btn').click(function(e) {
        e.preventDefault();
        let userStatechecking = JSON.parse(localStorage.getItem('userState'));
        //let cartnumbers = localStorage.getItem('cartNumbers');
        let totalCost = localStorage.getItem('totalCost');
        let products = JSON.parse(localStorage.getItem('productsInCart'));
        let userLocation = JSON.parse(localStorage.getItem('userLocation'));

        $('.icon-loading-order').css('visibility', 'visible');
        $('#checkout-btn').attr('disabled', true);
        $('#checkout-btn').css('cursor', 'no-drop');

        if (userStatechecking == null) {

            //window.alert('failed');
            // console.log("check failed");
            $('.js-signin-modal').addClass('cd-signin-modal--is-visible');
            $('#signin-block').addClass('cd-signin-modal__block--is-selected');
            $('#signin-switch').addClass('cd-selected');
        } 
        if (products == null){
            $("#snackbar").css('background-color','#a92ead');
            $("#snackbar").html("Sorry, Your cart is empty!");
            $("#snackbar").attr('class','show');
            setTimeout(function(){$("#snackbar").attr('class',''); }, 3000);
        }
        else {
            let emailId = userStatechecking['user']['id'];
            let fullname = userStatechecking['user']['name'];
            let userLoc = userLocation['userloc'];

            let post_url = "http://127.0.0.1:8000/checkout/";
            $.ajax({
                url: post_url,
                contentType: 'application/json',
                dataType: "json",
                type: "POST",
                data: JSON.stringify({ email: emailId, totalCost: totalCost, products_ordered: products,  name: fullname, user_location: userLoc, ostatus:"ordered", payment:"cash on delivery" }),
                success: function (response) {
                    let resp = JSON.parse(JSON.stringify(response));
                    if (resp.result == "error") {
                        $("#snackbar").css('background-color','red');
                        $("#snackbar").html("Something went wrong, please try again later!");
                        $("#snackbar").attr('class','show');
                        setTimeout(function(){$("#snackbar").attr('class',''); }, 3000);
                    }
                    else{
                        $("#snackbar").html("Your order has been placed successfully!");
                        $("#snackbar").attr('class','show');
                        setTimeout(function(){$("#snackbar").attr('class',''); }, 3000);

                        localStorage.removeItem("totalCost");
                        localStorage.removeItem('cartNumbers');
                        localStorage.removeItem("productsInCart");

                        document.getElementById("sub-total").innerHTML = "&#8377; 0.00";
                        document.getElementById("cart-total").innerHTML = "&#8377; 0.00";
                        document.getElementById("cart-total-1").innerHTML = "&#8377; 0.00";
                        $("#product-cart").html('');

                        sendEmail(emailId,fullname,products);

                    }
                },
                error: function (xhr) {
                    //Do Something to handle error
                    $("#snackbar").css('background-color','red');
                    $("#snackbar").html("Something went wrong, please try again later!");
                    $("#snackbar").attr('class','show');
                    setTimeout(function(){$("#snackbar").attr('class',''); }, 3000);
                }
            });

            

        }

            $('.icon-loading-order').css('visibility', 'hidden');
            $('#checkout-btn').attr('disabled', false);
            $('#checkout-btn').css('cursor', 'pointer');
       
    });

    //Login and SignUp modal Overlay

    //Login/Signup modal window 
    function ModalSignin(element) {
        this.element = element;
        this.blocks = this.element.getElementsByClassName('js-signin-modal-block');
        this.switchers = this.element.getElementsByClassName('js-signin-modal-switcher')[0].getElementsByTagName('a');
        this.triggers = document.getElementsByClassName('js-signin-modal-trigger');
        this.hidePassword = this.element.getElementsByClassName('js-hide-password');
        this.init();
    };

    ModalSignin.prototype.init = function () {
        var self = this;
        //open modal/switch form
        for (var i = 0; i < this.triggers.length; i++) {
            (function (i) {
                self.triggers[i].addEventListener('click', function (event) {
                    if (event.target.hasAttribute('data-signin')) {
                        // console.log("clicked");
                        event.preventDefault();
                        self.showSigninForm(event.target.getAttribute('data-signin'));
                    }
                });
            })(i);
        }

        //close modal
        this.element.addEventListener('click', function (event) {
            if (hasClass(event.target, 'js-signin-modal') || hasClass(event.target, 'js-close')) {
                event.preventDefault();
                removeClass(self.element, 'cd-signin-modal--is-visible');
            }
        });
        //close modal when clicking the esc keyboard button
        document.addEventListener('keydown', function (event) {
            (event.which == '27') && removeClass(self.element, 'cd-signin-modal--is-visible');
        });

        //hide/show password
        for (var i = 0; i < this.hidePassword.length; i++) {
            (function (i) {
                self.hidePassword[i].addEventListener('click', function (event) {
                    self.togglePassword(self.hidePassword[i]);
                });
            })(i);
        }


        function userLogin(email, username) {
            //console.log("username: ", username);
            let userState = localStorage.getItem('userState');
            userState = JSON.parse(userState);
            if (userState) {
                userState['user'] = { id: String(email), name: String(username) };
            }
            else userState = { 'user': { id: String(email), name: String(username) } };

            localStorage.setItem('userState', JSON.stringify(userState));

        }


        function resendEmailverification(email, password) {

            $.ajax({
                url: 'http://127.0.0.1:8000/user-resend-verification/',
                contentType: 'application/json',
                dataType: "json",
                type: "POST",
                data: JSON.stringify({ email: email, pwd: password }),
                success: function (response) {
                    let resp = JSON.parse(JSON.stringify(response));
                    if (resp.result == "sent") {
                        $("#verify-msg").html("Verification mail has been sent again, please check your mail!");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    else {
                        $("#verify-msg").html("Invalid email address, please try registering a valid email address!");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                },
                error: function (xhr) {
                    //Do Something to handle error
                    $("#verify-msg").html("Something went wrong, please try again!");
                    $('[name="login-btn"]').attr('disabled', false);
                    $('[name="login-btn"]').css('cursor', 'pointer');
                }
            });

        }

        //On submit the SignIn Form
        this.blocks[0].getElementsByTagName('form')[0].addEventListener('submit', function (event) {
            event.preventDefault();
            $('.icon-loading').css('visibility', 'visible');
            $('[name="login-btn"]').attr('disabled', true);
            $('[name="login-btn"]').css('cursor', 'no-drop');

            let email = document.forms["signin-form"]["email"].value;
            let password = document.forms["signin-form"]["password"].value;
            let post_url = 'http://127.0.0.1:8000/usersignin/';

            $('#resend-mail').on('click', function () {
                resendEmailverification(email, password);
            });

            $.ajax({
                url: post_url,
                contentType: 'application/json',
                dataType: "json",
                type: "POST",
                data: JSON.stringify({ email: email, pwd: password }),
                success: function (response) {
                    let resp = JSON.parse(JSON.stringify(response));
                    if (resp.result == "success") {

                        self.showSigninForm('signin-status');
                        $("#signin-msg").html("Successfully Signed In!");

                        setTimeout(() => { removeClass(self.element, 'cd-signin-modal--is-visible'); }, 3000);

                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');

                        userLogin(email, resp.username);
                        signedinCheck();
                    }
                    else if (resp.result == "notverified") {
                        self.showSigninForm('email-verify');
                        $("#verify-msg").html("Account not verified, please click on the link sent to your email to verify.");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    else if (resp.result == "err") {

                        self.showSigninForm('signup-verify');
                        $("#signup-msg").html("Email or Password incorrect, please enter a correct email/password!");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');

                    }

                    $('.icon-loading').css('visibility', 'hidden');

                },
                error: function (xhr) {
                    //Do Something to handle error
                    self.showSigninForm('signin-status');
                    $("#signin-msg").html("Something went wrong, please try again!");
                    $('[name="login-btn"]').attr('disabled', false);
                    $('[name="login-btn"]').css('cursor', 'pointer');
                    $('.icon-loading').css('visibility', 'hidden');
                }
            });




        });

        //On Submitting the SignUp Form
        this.blocks[1].getElementsByTagName('form')[0].addEventListener('submit', function (event) {
            event.preventDefault();
            $('.icon-loading').css('visibility', 'visible');
            $('[name="signup-btn"]').attr('disabled', true);
            $('[name="signup-btn"]').css('cursor', 'no-drop');

            let email = document.forms["signup-form"]["email"].value;
            let password = document.forms["signup-form"]["password"].value;
            let user_name = document.forms["signup-form"]["user-name"].value;
            let mob_number = document.forms["signup-form"]["mob-number"].value;

            let post_url = 'http://127.0.0.1:8000/usersignup/';

            $.ajax({
                url: post_url,
                contentType: 'application/json',
                dataType: "json",
                type: "POST",
                data: JSON.stringify({ email: email, pwd: password, username: user_name, mobile: mob_number }),
                success: function (response) {
                    let resp = JSON.parse(JSON.stringify(response));
                    if (resp.result == "mail sent") {

                        self.showSigninForm('email-verify');
                        $("#verify-msg").html("A verification link has been sent to your email, please click on the link to verify your account.");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    else if (resp.result == "notvalid") {
                        self.showSigninForm('signin-status');
                        $("#verify-msg").html("Email address not valid, please try registering a valid email address!.");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    else if (resp.result == "Account already registered") {
                        self.showSigninForm('signup-verify');
                        $("#signup-msg").html("Account already registered, please signin to proceed!");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    else {
                        self.showSigninForm('signin-status');
                        $("#signin-msg").html("Something went wrong, please try again after reloading!");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    $('.icon-loading').css('visibility', 'hidden');
                },
                error: function (xhr) {
                    //Do Something to handle error
                    self.showSigninForm('signin-status');
                    $("#signin-msg").html("Something went wrong, please try again!");
                    $('[name="login-btn"]').attr('disabled', false);
                    $('[name="login-btn"]').css('cursor', 'pointer');
                    $('.icon-loading').css('visibility', 'hidden');
                }
            });

        });

        //On Submitting the Reset Password Form
        this.blocks[2].getElementsByTagName('form')[0].addEventListener('submit', function (event) {
            event.preventDefault();
            $('.icon-loading').css('visibility', 'visible');
            $('[name="reset-pass-btn"]').attr('disabled', true);
            $('[name="reset-pass-btn"]').css('cursor', 'no-drop');

            let email = document.forms["forgot-pass-form"]["email"].value;
            let post_url = 'http://127.0.0.1:8000/user-password-reset/';

            $.ajax({
                url: post_url,
                contentType: 'application/json',
                dataType: "json",
                type: "POST",
                data: JSON.stringify({ email: email }),
                success: function (response) {
                    let resp = JSON.parse(JSON.stringify(response));
                    if (resp.result == "mail sent") {

                        self.showSigninForm('signup-verify');
                        $("#signup-msg").html("A password reset link has been sent to your email, please click on the link to reset your account password.");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    else if (resp.result == "notfound") {
                        self.showSigninForm('signin-status');
                        $("#signin-msg").html("Email address not found, please try registering a valid email address!.");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    else {
                        self.showSigninForm('signin-status');
                        $("#signin-msg").html("Something went wrong, please try again after reloading!");
                        $('[name="login-btn"]').attr('disabled', false);
                        $('[name="login-btn"]').css('cursor', 'pointer');
                    }
                    $('.icon-loading').css('visibility', 'hidden');
                },
                error: function (xhr) {
                    //Do Something to handle error
                    self.showSigninForm('signin-status');
                    $("#signin-msg").html("Something went wrong, please try again!");
                    $('[name="login-btn"]').attr('disabled', false);
                    $('[name="login-btn"]').css('cursor', 'pointer');
                    $('.icon-loading').css('visibility', 'hidden');
                }
            });

        });
    };

    ModalSignin.prototype.togglePassword = function (target) {
        var password = $(target).prev();
        ('password' == password.attr('type')) ? password.attr('type', 'text') : password.attr('type', 'password');
        target.innerHTML = ('Hide' == target.innerHTML) ? 'Show' : 'Hide';
        putCursorAtEnd(password);
    }

    ModalSignin.prototype.showSigninForm = function (type) {
        // show modal if not visible
        !hasClass(this.element, 'cd-signin-modal--is-visible') && addClass(this.element, 'cd-signin-modal--is-visible');
        // show selected form
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].getAttribute('data-type') == type ? addClass(this.blocks[i], 'cd-signin-modal__block--is-selected') : removeClass(this.blocks[i], 'cd-signin-modal__block--is-selected');
        }
        //update switcher appearance
        var switcherType = (type == 'signup') ? 'signup' : 'login';
        for (var i = 0; i < this.switchers.length; i++) {
            this.switchers[i].getAttribute('data-type') == switcherType ? addClass(this.switchers[i], 'cd-selected') : removeClass(this.switchers[i], 'cd-selected');
        }
    };

    ModalSignin.prototype.toggleError = function (input, bool) {
        // used to show error messages in the form
        toggleClass(input, 'cd-signin-modal__input--has-error', bool);
        toggleClass(input.nextElementSibling, 'cd-signin-modal__error--is-visible', bool);
    }

    var signinModal = document.getElementsByClassName("js-signin-modal")[0];
    if (signinModal) {
        new ModalSignin(signinModal);
    }


    //class manipulations - needed if classList is not supported
    function hasClass(el, className) {
        if (el.classList) return el.classList.contains(className);
        else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
    function addClass(el, className) {
        var classList = className.split(' ');
        if (el.classList) el.classList.add(classList[0]);
        else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
        if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
    }
    function removeClass(el, className) {
        var classList = className.split(' ');
        if (el.classList) el.classList.remove(classList[0]);
        else if (hasClass(el, classList[0])) {
            var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
        if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
    }
    function toggleClass(el, className, bool) {
        if (bool) addClass(el, className);
        else removeClass(el, className);
    }

    function putCursorAtEnd(el) {
        if (el.setSelectionRange) {
            var len = el.value.length * 2;
            el.focus();
            el.setSelectionRange(len, len);
        } else {
            el.value = el.value;
        }
    };




   

})(jQuery);

