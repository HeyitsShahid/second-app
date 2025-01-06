// Clear the console for debugging purposes
console.clear();

/**
 * Utility function to get a specific cookie value by name
 */
function getCookieValue(name) {
    const cookieArr = document.cookie.split("; ").map(cookie => cookie.split("="));
    const cookieObj = Object.fromEntries(cookieArr);
    return cookieObj[name] || null;
}

// Validate and get the counter value from cookies
const counterCookie = getCookieValue("counter");
const counter = counterCookie ? Number(counterCookie) : 0;

// Update badge if counter is valid
if (counter > 0) {
    document.getElementById("badge").innerHTML = counter;
}

// Container for cart items
const cartContainer = document.getElementById("cartContainer");

const boxContainerDiv = document.createElement("div");
boxContainerDiv.id = "boxContainer";

// Dynamically render items in the cart
function dynamicCartSection(ob, itemCounter) {
    const boxDiv = document.createElement("div");
    boxDiv.id = "box";
    boxContainerDiv.appendChild(boxDiv);

    const boxImg = document.createElement("img");
    boxImg.src = ob.preview || "default.jpg"; // Fallback for missing image
    boxDiv.appendChild(boxImg);

    const boxh3 = document.createElement("h3");
    const h3Text = document.createTextNode(`${ob.name} × ${itemCounter}`);
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    const boxh4 = document.createElement("h4");
    const h4Text = document.createTextNode(`Amount: Rs ${ob.price * itemCounter}`);
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    cartContainer.appendChild(boxContainerDiv);
    cartContainer.appendChild(totalContainerDiv);
}

// Container for the total amount
const totalContainerDiv = document.createElement("div");
totalContainerDiv.id = "totalContainer";

const totalDiv = document.createElement("div");
totalDiv.id = "total";
totalContainerDiv.appendChild(totalDiv);

// Add header for total amount
const totalh2 = document.createElement("h2");
const h2Text = document.createTextNode("Total Amount");
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

// Function to update the total amount dynamically
function amountUpdate(amount) {
    totalDiv.querySelectorAll("h4").forEach(el => el.remove()); // Clear previous amounts
    const totalh4 = document.createElement("h4");
    const totalh4Text = document.createTextNode(`Amount: Rs ${amount}`);
    totalh4.appendChild(totalh4Text);
    totalDiv.appendChild(totalh4);
    totalDiv.appendChild(buttonDiv);
}

// Button to place the order
const buttonDiv = document.createElement("div");
buttonDiv.id = "button";
totalDiv.appendChild(buttonDiv);

const buttonTag = document.createElement("button");
buttonDiv.appendChild(buttonTag);

const buttonLink = document.createElement("a");
buttonLink.href = "/orderPlaced.html?";
buttonTag.appendChild(buttonLink);

const buttonText = document.createTextNode("Place Order");
buttonLink.appendChild(buttonText);

buttonTag.onclick = function () {
    console.log("Order placed!");
};

// Backend API call to fetch product data
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            try {
                const contentTitle = JSON.parse(this.responseText);

                const itemCookie = getCookieValue("items");
                const item = itemCookie ? itemCookie.split(" ") : [];
                
                let totalAmount = 0;

                item.forEach((id, index) => {
                    const product = contentTitle.find(p => p.id === Number(id));
                    if (product) {
                        let itemCounter = item.filter(x => x === id).length;
                        totalAmount += Number(product.price) * itemCounter;

                        dynamicCartSection(product, itemCounter);

                        // Remove duplicates from processing
                        item.splice(index, itemCounter - 1);
                    }
                });

                amountUpdate(totalAmount);
            } catch (error) {
                console.error("Error processing response:", error);
            }
        } else {
            console.error("API call failed with status:", this.status);
        }
    }
};

// Open and send API request
httpRequest.open("GET", "https://5d76bf96515d1a0014085cf9.mockapi.io/product", true);
httpRequest.send();
