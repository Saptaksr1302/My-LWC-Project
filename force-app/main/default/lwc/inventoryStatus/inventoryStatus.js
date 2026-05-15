import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getInventoryData from '@salesforce/apex/ProductInventoryController.getInventoryData';
import './inventoryStatus.css';

export default class InventoryStatus extends LightningElement {

    @track productId;
    @track stockMessage = '';
    @track isInStock = false;
    @track isOutOfStock = false;
    @track isError = false;
    @track isNotAvailable = false;

    connectedCallback(){
        // this.productId = this.getProductIdFromUrl();
        // console.log('Product ID:', this.productId);
        this.fetchInventoryData();
    }

    // getProductIdFromUrl() {
    //     const url = window.location.href;
    //     const match = url.match(/\/product\/.+\/([^/]+)/);
    //     return match ? match[1] : null;
    // }

    @wire(CurrentPageReference)
    getPageParams(pageRef) {
        if (pageRef && pageRef.state) {
            const fullUrl = window.location.href; // Get full URL
            this.extractProductDetails(fullUrl);
        }
    }

    extractProductDetails(url) {
        const urlParts = url.split('/'); // Split URL by "/"
        const productIndex = urlParts.indexOf('product'); // Find "product" in URL

        if (productIndex !== -1 && urlParts.length > productIndex + 2) {
            this.productId = decodeURIComponent(urlParts[productIndex + 2]); // Extract Product ID
            console.log('Product ID:', this.productId);
        }
    }
 
    fetchInventoryData() {
        getInventoryData({ productId: this.productId })
            .then((data) => {
                console.log(data);
                if(data && data.length > 0) {
                    const inventory = data[0];
                    console.log('Type of Data', typeof inventory);
                    const quantity = inventory.quantity !== undefined ? inventory.quantity : null;
                    const restockDate = inventory.restockDate !== undefined ? inventory.restockDate : null;
 
                    console.log('Quantity:', quantity);
                    console.log('Restock Date:', restockDate);
 
                    // Set stock message
                    if (quantity !== null) {
                        if (quantity > 0) {
                            this.stockMessage = 'In Stock';
                            this.isInStock = true;
                            this.isOutOfStock = false;
                            this.isError = false;
                        } else {
                            this.stockMessage = restockDate
                                ? `Out of Stock - Expected Restock Date: ${restockDate}`
                                : 'Out of Stock - No Restock Date Available';
                            this.isInStock = false;
                            this.isOutOfStock = true;
                            this.isError = false;
                            // this.disableCommerceButtons();
                            this.waitForButtonToLoad();
                            this.waitForAddToListButton();
                        }
                    } else {
                        this.stockMessage = 'No Inventory Data Available';
                        this.isInStock = false;
                        this.isOutOfStock = false;
                        this.isNotAvailable = true;
                        this.isError = false;
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching inventory:', error);
                this.stockMessage = 'Error retrieving inventory';
                this.isInStock = false;
                this.isOutOfStock = false;
                this.isError = true;
            });
    }

    // disableCommerceButtons() {
    //     setTimeout(() => {
    //         // Disable standard Commerce buttons
    //         let addToCartBtn = this.template.querySelector('.lwc-76nnmqsstjk');
    //         let addToListBtn = this.template.querySelector('.lwc-76nnmqsstjk');
 
    //         if (addToCartBtn) {
    //             addToCartBtn.disabled = true;
    //             addToCartBtn.classList.add('disabled');
    //             addToCartBtn.innerText = 'Out of Stock';
    //         }
 
    //         if (addToListBtn) {
    //             addToListBtn.disabled = true;
    //             addToListBtn.classList.add('disabled');
    //         }
    //     }, 500); // Wait for the DOM to fully load
    // }

    waitForButtonToLoad() {
        const checkButton = setInterval(() => {
            let addToCartBtn = document.querySelector('button[aria-label="Add To Cart"]');
 
            if (addToCartBtn) {
                clearInterval(checkButton); // Stop checking once buttons are found
                this.hideAddToCartButton(addToCartBtn);
            }
        }, 500); // Check every 500ms
    }
 
    hideAddToCartButton(addToCartBtn) {
        if (addToCartBtn) {
            addToCartBtn.disabled = true;
            addToCartBtn.classList.add('disabled');
            addToCartBtn.innerText = 'Out of Stock';
        }
    }

    waitForAddToListButton() {
        const checkButton = setInterval(() => {
            let addToListBtn = document.querySelector('button[aria-label="Add To List"]');

            if (addToListBtn) {
                clearInterval(checkButton); // Stop checking once button is found
                this.disableAddToListButton(addToListBtn);
            }
        }, 500); // Check every 500ms
    }

    disableAddToListButton(addToListBtn) {
        if (addToListBtn) {
            addToListBtn.disabled = true;
            addToListBtn.classList.add('disabled');
        }
    }
}