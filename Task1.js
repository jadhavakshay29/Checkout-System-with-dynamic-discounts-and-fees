//Checkout System with dynamic discounts and fees

const prompt = require("prompt-sync")();
//object of product name and price 
const products = {
        productA : 20,
        productB : 40,
        productC : 50,
    };

//to store user input and gift wrap status 
const cart ={};

//user inputs
for(const product in products){
    const quantity = parseInt(prompt(`Enter the quantity for ${product}: `),10);
    const giftWrap = prompt(`Is ${product} wrapped as a gift? (yes/no) `).toLowerCase() === "yes";
    cart[product] = {quantity, giftWrap};
   
}

//calculte subtotal 
const calculateSubTotal = function(cart, products){
   return Object.keys(cart).reduce((total,product)=>{
        return total + cart[product].quantity * products[product];
   },0);
     
}

//discount rules    
function calculateDiscount(cart, products){
    let totalQuantity = 0;
    let maxQuantity = 0;

    for(const product in products){
        totalQuantity += cart[product].quantity;
        if(cart[product].quantity > maxQuantity){
            maxQuantity = cart[product].quantity;   
        }
    }

    //apply most benefecial discount
    let discountAmount = 0;
    let discountName = "";

    if(totalQuantity > 30 && maxQuantity> 15){
        //50% discount
        discountAmount = products.reduce((total, product)=>{
             if(cart[product].quantity > 15){
                return total + (cart[product].quantity - 15) * (products[product] * 0.5);
             }
                return total;
        },0);
        discountName = "tiered_50_discount";
    }else if(totalQuantity > 20){
        discountAmount = calculateSubTotal(cart, products)* 0.1;
        discountName = "bulk_10_discount";
    }else if(maxQuantity > 10){
        for(const product in cart){
            if(cart[product].quantity > 10 ){
                discountAmount = cart[product].quantity * (products[product] * 0.05); 
                discountName = "bulk_5_discount";
                break;
            }
        }
    }else if(calculateSubTotal(cart, products) > 200){
        discountAmount = 10;
        discountName = "flat_10_discount";
    }

    return {discountName, discountAmount};
}

//calculate total 
function calculateTotal(cart, products){
    const totalQuantity = Object.keys(cart).reduce((total, product) => total + cart[product].quantity, 0);
     const {discountName , discountAmount} = calculateDiscount(cart, products);
     const subtotal = calculateSubTotal(cart, products);
     const giftWrapFee = Object.keys(cart).reduce((total, product) => {
        return total + (cart[product].giftWrap ? cart[product].quantity : 0);
    }, 0);
    const shippingFee = Math.ceil(totalQuantity/10) * 5;
    const total = subtotal - discountAmount + shippingFee + giftWrapFee ;
    return {
        subtotal,
        discountName,
        discountAmount,
        shippingFee,
        giftWrapFee,
        total,
    };
}

const result = calculateTotal(cart, products);

console.log("Product Details:");
for (const product in cart) {
    console.log(`${product}: Quantity - ${cart[product].quantity}, Total Amount - ${cart[product].quantity * products[product]}$`);
}

console.log("\nSubtotal:", result.subtotal,"$");
console.log("Discount Applied:", result.discountName, "-", result.discountAmount,"$");
console.log("Shipping Fee:", result.shippingFee,"$");
console.log("Gift Wrap Fee:", result.giftWrapFee,"$");
console.log("\nTotal:", result.total,"$");

