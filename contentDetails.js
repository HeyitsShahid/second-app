console.clear();

let id = location.search.split("?")[1];
console.log(`Product ID: ${id}`);

// Utility function to safely get cookie values
function getCookieValue(name) {
    const cookieArr = document.cookie.split("; ").map(cookie => cookie.split("="));
    const cookieObj = Object.fromEntries(cookieArr);
    return cookieObj[name] || null;
}

// Update cart badge
const counterCookie = getCookieValue("counter");
if (counterCookie) {
    document.getElementById("badge").innerHTML = counterCookie;
}

/**
 * Function to dynamically generate product details
 * @param {Object} ob - Product object from API
 */
function dynamicContentDetails(ob) {
    if (!ob.name || !ob.photos || !ob.description) {
        console.error("Invalid product data:", ob);
        document.getElementById("containerProduct").innerHTML =
            "Product details are unavailable.";
        return;
    }

    const mainContainer = document.createElement("div");
    mainContainer.id = "containerD";

    const imageSectionDiv = document.createElement("div");
    imageSectionDiv.id = "imageSection";

    const imgTag = document.createElement("img");
    imgTag.id = "imgDetails";
    imgTag.src = ob.preview;

    imageSectionDiv.appendChild(imgTag);

    const productDetailsDiv = document.createElement("div");
    productDetailsDiv.id = "productDetails";

    const h1 = document.createElement("h1");
    h1.textContent = ob.name;

    const h4 = document.createElement("h4");
    h4.textContent = ob.brand;

    const detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    const h3DetailsDiv = document.createElement("h3");
    h3DetailsDiv.textContent = `Rs ${ob.price}`;

    const h3 = document.createElement("h3");
    h3.textContent = "Description";

    const para = document.createElement("p");
    para.textContent = ob.description;

    const productPreviewDiv = document.createElement("div");
    productPreviewDiv.id = "productPreview";

    const h3ProductPreviewDiv = document.createElement("h3");
    h3ProductPreviewDiv.textContent = "Product Preview";
    productPreviewDiv.appendChild(h3ProductPreviewDiv);

    ob.photos.forEach((photo, index) => {
        const imgTagPreview = document.createElement("img");
        imgTagPreview.id = `previewImg-${index}`;
        imgTagPreview.src = photo;

        imgTagPreview.onclick = function () {
            console.log(`Preview image clicked: ${photo}`);
            imgTag.src = photo;
        };

        productPreviewDiv.appendChild(imgTagPreview);
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.id = "button";

    const buttonTag = document.createElement("button");
    buttonTag.textContent = "Add to Cart";
    buttonTag.onclick = function () {
        let order = id + " ";
        let counter = 1;

        if (counterCookie) {
            order = id + " " + getCookieValue("orderId");
            counter = Number(counterCookie) + 1;
        }

        document.cookie = `orderId=${order},counter=${counter}`;
        document.getElementById("badge").innerHTML = counter;
        console.log(`Updated cookies: ${document.cookie}`);
    };

    buttonDiv.appendChild(buttonTag);

    productDetailsDiv.append(h1, h4, detailsDiv, productPreviewDiv, buttonDiv);
    detailsDiv.append(h3DetailsDiv, h3, para);
    mainContainer.append(imageSectionDiv, productDetailsDiv);

    document.getElementById("containerProduct").appendChild(mainContainer);
}

// Backend API Call
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            console.log("Connected to API.");
            const contentDetails = JSON.parse(this.responseText);
            dynamicContentDetails(contentDetails);
        } else {
            console.error("API call failed with status:", this.status);
            document.getElementById("containerProduct").textContent =
                "Failed to load product details.";
        }
    }
};
httpRequest.open("GET", `https://5d76bf96515d1a0014085cf9.mockapi.io/product/${id}`, true);
httpRequest.send();
