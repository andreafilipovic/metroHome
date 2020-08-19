let selectedCatID=1;

window.onload=function(){
    showProducts();
    showMenu();
    var coverSlider=['images/slider5.jpg','images/slider22.jpg','images/slider23.jpg'];

    function changeSlider(){
    
        for (var i=0; i < coverSlider.length; i++) {
            (function(ind) {
                   setTimeout(function(){
                       
                    document.getElementById("cover").style.backgroundImage="url('" + coverSlider[ind] + "')"
                    document.getElementsByClassName("next")
    
                }, 3000*ind);
            })(i);
        }
    }
    changeSlider()
    setInterval(function(){
            changeSlider()
        },3000*coverSlider.length) 

 $(document).on("click",".link-about",function(){
    $('html, body').animate({
        scrollTop: $("#about-section").offset().top
    }, 1000);
});

document.getElementById("bag-link").addEventListener("click",displayCartData);



var modal = document.getElementById('kitchen');
var btn = document.getElementsByClassName("look-button");
var span = document.getElementsByClassName("close")[0];
for(var i=0;i<btn.length;i++){
    btn[i].onclick = function() {
        var catId=$(this).data('id');
        filtrirajPoKategoriji(catId)
     $("#kitchen").fadeIn("300");
    }
}
span.onclick = function() {
    $("#kitchen").fadeOut();
}
window.onclick = function(event) {
  if (event.target == modal) {
    $("#kitchen").fadeOut();
  }
}
var modal2 = document.getElementById('itemsInBag');
var btn2 = document.getElementById("bag-link");
var span2 = document.getElementsByClassName("close2")[0];

span2.onclick = function() {
    $("#itemsInBag").fadeOut();
}
window.onclick = function(event) {
  if (event.target == modal2) {
    $("#itemsInBag").fadeOut();
  }
}

btn2.onclick = function() {
    $("#itemsInBag").fadeIn("300");
    
  }

$(".aboutus").click(function() {
    $('html, body').animate({
      scrollTop: $("#about-section").offset().top
    }, 2000)
  });

  $(".elemets-link").click(function() {
    $('html, body').animate({
      scrollTop: $("#element1").offset().top
    }, 2000)
  });

  $(".futer-link").click(function() {
    $('html, body').animate({
      scrollTop: $("#futer").offset().top
    }, 2000)
  });

  $(".home-link").click(function() {
    $('html, body').animate({
      scrollTop: $("#cover").offset().top
    }, 2000)
  });
 

function checkNavPosition() {
    if($(window).scrollTop() <= 50) {
        $('.nav').removeClass('active');
    } else {
        $('.nav').addClass('active');
    }
}
checkNavPosition();

$(document).scroll(function() { 
    checkNavPosition()
});

//localStorage.products=[{}];
let products = productsInCart();
    
if(products){
       
        displayCartData();
}
else{
    showEmptyCart();
}

function filtrirajPoKategoriji(idKat) {
     selectedCatID=idKat;
     ajaxShop(
        function(products){
            const pro=products.filter(p=>{
                return p.category.id==idKat;
          });
         
         allProducts(pro);
        }
    );
}
   
}


function ajaxShop(callbackSuccess){
    $.ajax({
        url: "data/shop.json",
        method: "GET",
        success: callbackSuccess,
        error:function(xhr,status,error){
            alert("greska");
        }
    });
}


function showProducts(){
    ajaxShop(
        function(shop){
            allProducts(shop);
        }
    );
}

function productsInCart() {
    return JSON.parse(localStorage.getItem("products"));
    
}

function removeFromCart(id) {
    let products = productsInCart();
    let filtered = products.filter(p => p.id != id);

    localStorage.setItem("products", JSON.stringify(filtered));

    displayCartData();
}


function displayCartData() {
    
let products = productsInCart();    
if(products.length){
    ajaxShop(
        function(data){
            data = data.filter(p => {
                for(let prod of products)
                {
                    if(p.id == prod.id) {
                        p.quantity = prod.quantity;
                        return true;
                    }
                        
                }
                return false;
            });
            populateCardPage(data)
        }
    );
        
}else{
    showEmptyCart();
}
}


function populateCardPage(data){
    let html=`<div id="allProductsInBag">

    <div class="card col-lg-12 card-row">
    
    <h4 class="card-title col-lg-4 ">Product</h4>
    <h4 class="card-title col-lg-4 ">Total Price</h4>
    <h4 class="card-title col-lg-4 ">Remove</h4>
    </div>
    `;
    for(let d of data){
        html+=`
        <div class="card-row col-lg-12">
            <div class="priduct-inBag col-lg-4 col-md-4 col-sm-12 card-item">
                    <div class="col-lg-6 col-md-6 col-sm-6">
                         <img src="${d.img.src}" alt="${d.img.alt}" class="bag-product-picture col-lg-12">
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 card-item card-text">
                        <p class="col-lg-12">${d.title}</p>
                        <p class="col-lg-12">$${d.price}</p>
                        <p class="col-lg-12">Quantity: ${d.quantity}</p>
                    </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-6 card-item">
                <p class="col-lg-12 col-md-12 col-sm-6 price-trash">Total: $${d.price * d.quantity}</p>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-6 card-item price-trash">
                <p class="col-lg-12 col-md-12 col-sm-6 trash-button" onclick="removeFromCart(${d.id})"><i class="fa fa-trash" aria-hidden="true" data-id="${d.id}"></i>Remove</p> 
            </div>
         </div>   
        `
    }
    html+=`
    <div class="checkout-button col-lg-12" id="btnCheckout">
    <button class="checkout">Checkout</button>
    </div>

    <div id="pay" class="col-lg-12 animated fadeIn">
        <div id="forma" class="alignerh">
            <form action="obrada.php" method="post" class="col-lg-12 alignerh">
                <h3>CHECKOUT</h3>
                <input type="text" name="fullName" id="name" placeholder="FullName" class="checkout-item"/>
                <span id="error-name" class="col-lg-12 error"></span>
                <br>
                <input type="text" name="mail" id="email" placeholder="Email" class="checkout-item"/>
                <span id="error-mail" class="col-lg-12 error"></span>
                <br>
                <input type="text" name="numebr" id="cardNum" placeholder="CardNumber" class="checkout-item"/>
                <span id="error-number" class="col-lg-12 error"></span>
                <br>
                
                <select id="ddlCard" class="checkout-item">
                    <option value="Select">Select Card</option>
                    <option value="visa">Visa</option>
                    <option value="master">MasterCard</option>
                    <option value="american">American Express</option>
                    <option value="paypal">PayPal</option>
                </select>
                <span id="error-cardType" class="col-lg-12 error"></span>
                <br>
                <span>Delivery:</span> <input type="radio" value="standard" name="rbDelivery"/> Standard <input type="radio" value="standard" name="rbDelivery"/> Fast
                <span id="error-delivery" class="col-lg-12 error"></span>
                <br>
                <input type="button" name="pay" id="btnPay" value="PAY"/>
            </form>
            <button id="return">RETURN</button>
        </div>
    </div>
    </div>
    
    `
     document.getElementById("bag").innerHTML=html;
     $("#pay").hide();
     $(".checkout").click(function(){
        $(".card-row ").hide();
        $("#pay").show();
        $("#btnCheckout").hide();
     })
    $("#btnPay").click(proveriPodatke);
    $("#return").click(function(){
        $(".card-row ").show();
        $("#pay").hide();
        $("#btnCheckout").show();
    })
    

}

function proveriPodatke(){
    var cardList=document.getElementById("ddlCard");
	var selectedType=cardList.options[cardList.selectedIndex].value;
	if (selectedType=="Select") {
		document.getElementById("error-cardType").innerHTML="please select one type of card"
	}
	else{
		document.getElementById("error-cardType").innerHTML=""
	
    }
    
    var reName=/^[A-Z][a-z]{2,}(\s[A-Z][a-z]{2,})+$/;
    var FullName=document.getElementById("name").value;
    console.log(FullName);
	if (!reName.test(FullName) || FullName.length==0) {
		
		document.getElementById("error-name").innerHTML="please retry with a correct format"	
	}
	else{
		
		document.getElementById("error-name").innerHTML="";
    }
    
    var reMail=/^[a-z]{2,}[\.\$\%\!\?\.\#\^\\\/]*[A-z0-9]*[\.\$\%\!\?\.\#\^\\\/]*[A-z0-9]*[@][a-z]{2,}\.[a-z]{2,}$/;
	var Mail=document.getElementById('email').value;
	if (!reMail.test(Mail) || Mail.length==0) {
		document.getElementById("error-mail").innerHTML="please retry with a correct format";
	}
	else{
		document.getElementById("error-mail").innerHTML=""
    }
    
    var reNumber=/^[0-9]{4}[-][0-9]{4}[-][0-9]{4}[-][0-9]{4}$/;
    var cardNumber=document.getElementById("cardNum").value;
    if (!reNumber.test(cardNumber) || cardNumber.length==0) {
		document.getElementById("error-number").innerHTML="format is xxxx-xxxx-xxxx-xxxx";
	}
	else{
		document.getElementById("error-number").innerHTML=""
    }

    var dostava=document.getElementsByName("rbDelivery");
    var izabrano="";
    for(var i=0; i<dostava.length;i++){
        if(dostava[i].checked){
            izabrano=dostava[i].value;
            break;
        }
    }

    if(izabrano==""){
        document.getElementById("error-delivery").innerHTML="please choose type of delivery"
    }
    else{
        document.getElementById("error-delivery").innerHTML=""
    }

}


function pretrazi(){
    var unos=document.getElementById("search").value;
    //alert(unos);
    ajaxShop(
        function(data){
            var nekiPostovi=data.filter(el=>{
                if(el.title.toLowerCase().indexOf(unos.toLowerCase())!==-1){
                    return true;
                }
            });
            nekiPostovi = nekiPostovi.filter(p=>{
                return p.category.id==selectedCatID;
            });
            allProducts(nekiPostovi);
            console.log(nekiPostovi);
        }
    );
}

function allProducts(shop){
   // alert(shop);
    let ispis=`
    <div class="col-lg-12" id="sortPrice"><button id="high" data-order="dsc" class="btnSort">High To Low</button> <button id="low" class="btnSort" data-order="asc" >Low To High</button></div>

    <div class="col-lg-12"><input type="text" id="search" placeholder="Search..." class="futer-item"><button id="go" onclick="pretrazi()">GO</button></div>
    `;
     for(let s of shop){
         ispis+=`
     
             <div class="product col-lg-4 col-md-6 col-sm-12 modal-content">
                 <div class="imgP">
                     <img src="${s.img.src}" alt="${s.img.alt}" title="${s.title}" class="imgProduct col-lg-12"/>
                 </div>
                 <div class="textProduct col-lg-12 col-md-12 col-sm-12">
                     <span class="bla"><i class="fa fa-heart-o" aria-hidden="true"></i>
                      ${s.title}
                     </span>
                     <p class="price">$${s.price}</p>
                     <p class="disc">${s.dicsount}</p>
                     <button class="button add-to-cart" data-id=${s.id}><i class="fa fa-shopping-cart" aria-hidden="true"></i>Add to cart</button>
                 </div>
             </div>
 
         `;
     }
     document.querySelector("#pr").innerHTML=ispis;
     $(".btnSort").click(sortirajPoCeni);
     $(".add-to-cart").click(addToCart);
 }

function sortirajPoCeni(){
    let order=$(this).data('order');
    console.log(order);
    ajaxShop(
        function(data){
            var podaci=data.sort(function(a,b) {
                let valueA = a.price;
                let valueB = b.price;
                    if(valueA > valueB)
                         return order=='asc' ? 1 : -1;
                    else if(valueA < valueB)
                        return order=='asc' ? -1 : 1;
                     else 
                        return 0;
            });
            podaci = data.filter(p=>{
                return p.category.id==selectedCatID;
          });

          allProducts(podaci)
       
        }
    );
 }

function addToCart() {
    let id = $(this).data("id");

    var products = productsInCart();

    if(products) {
        if(productIsAlreadyInCart()) {
            updateQuantity();
        } else {
            addToLocalStorage()
        }
    } else {
        addFirstItemToLocalStorage();
    }

    alert("Cart successfully updated!");

    function productIsAlreadyInCart() {
        return products.filter(p => p.id == id).length;
    }

    function addToLocalStorage() {
        let products = productsInCart();
        products.push({
            id : id,
            quantity : 1
        });
        localStorage.setItem("products", JSON.stringify(products));
    }

    function updateQuantity() {
        let products = productsInCart();
        for(let i in products)
        {
            if(products[i].id == id) {
                products[i].quantity++;
                break;
            }      
        }

        localStorage.setItem("products", JSON.stringify(products));
    }

    

    function addFirstItemToLocalStorage() {
        let products = [];
        products[0] = {
            id : id,
            quantity : 1
        };
        localStorage.setItem("products", JSON.stringify(products));
    }
}///


function showEmptyCart() {
    
    document.getElementById("bag").innerHTML="<h1>Your cart is currenlty empty!</h1>";
}

function showMenu(){
        $.ajax({
            url:"data/meniSocial.json",
            method:"GET",
            dataType:"json",
            success:function(menu){
               let ispis="";
               for(let m of menu){
                   ispis+=`<a href="${m.link}"><i class="${m.ico}" aria-hidden="true"></i>${m.title}</a>`;
               }
               document.getElementById("social-links").innerHTML=ispis;
            },
            error:function(xhr,error,status){
                alert(status);
            }
        });

}




   