// Clear console for debugging purposes
console.clear();

let contentTitle;

// Utility function to get cookie value by name
function getCookieValue(name) {
    const cookieArr = document.cookie.split("; ").map(cookie => cookie.split("="));
    const cookieObj = Object.fromEntries(cookieArr);
    return cookieObj[name] || null;
}

// Safely get badge counter from cookies
const counterCookie = getCookieValue("counter");
if (counterCookie) {
    document.getElementById("badge").innerHTML = counterCookie;
}

/**
 * Function to dynamically create product sections
 * @param {Object} ob - Product object from API
 * @returns {HTMLElement} - Rendered product box
 */
function dynamicClothingSection(ob) {
    if (!ob.name || !ob.preview || !ob.price || !ob.brand) {
        console.error("Invalid product data:", ob);
        return document.createTextNode("Invalid product data");
    }

    let boxDiv = document.createElement("div");
    boxDiv.id = "box";

    let boxLink = document.createElement("a");
    boxLink.href = `/contentDetails.html?${ob.id}`;

    let imgTag = document.createElement("img");
    imgTag.src = ob.preview;

    let detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    let h3 = document.createElement("h3");
    h3.textContent = ob.name;

    let h4 = document.createElement("h4");
    h4.textContent = ob.brand;

    let h2 = document.createElement("h2");
    h2.textContent = `Rs ${ob.price}`;

    boxDiv.appendChild(boxLink);
    boxLink.appendChild(imgTag);
    boxLink.appendChild(detailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(h4);
    detailsDiv.appendChild(h2);

    return boxDiv;
}

// Get containers
let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

if (!mainContainer || !containerClothing || !containerAccessories) {
    console.error("One or more required containers are missing.");
}

// Backend API call
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            try {
                contentTitle = JSON.parse(this.responseText);

                contentTitle.forEach(product => {
                    const container = product.isAccessory ? containerAccessories : containerClothing;
                    if (container) {
                        container.appendChild(dynamicClothingSection(product));
                    } else {
                        console.error("Container for product type not found:", product);
                    }
                });
            } catch (error) {
                console.error("Error processing API response:", error);
            }
        } else {
            console.error("API call failed with status:", this.status);
        }
    }
};
httpRequest.open("GET", "https://5d76bf96515d1a0014085cf9.mockapi.io/product", true);
httpRequest.send();
