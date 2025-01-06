document.cookie = "orderId=0,counter=0";

const jsonRequestURL = "https://5d76bf96515d1a0014085cf9.mockapi.io/order";

/**
 * Fetch orders from the server.
 * @returns {Promise<Array>} Promise resolving to the fetched order list.
 */
function fetchOrders() {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", jsonRequestURL, true);
        httpRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        const orders = JSON.parse(this.responseText);
                        resolve(orders);
                    } catch (error) {
                        reject("Failed to parse server response.");
                    }
                } else {
                    reject(`GET request failed with status: ${this.status}`);
                }
            }
        };
        httpRequest.send(null);
    });
}

/**
 * Send updated orders to the server.
 * @param {Array} updatedOrders - The updated order list to be sent.
 */
function updateOrders(updatedOrders) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", jsonRequestURL, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                console.log("Orders updated successfully.");
            } else {
                console.error(`POST request failed with status: ${this.status}`);
            }
        }
    };
    httpRequest.send(JSON.stringify(updatedOrders));
}

// Main logic
fetchOrders()
    .then((orders) => {
        console.log("Fetched orders:", orders);

        // Validate and update orders
        const newOrder = {
            id: orders.length + 1,
            amount: 200,
            product: ["userOrder"],
        };
        orders.push(newOrder);

        console.log("Updated orders:", orders);

        // Send updated orders back to the server
        updateOrders(orders);
    })
    .catch((error) => {
        console.error("Error fetching or updating orders:", error);
    });
