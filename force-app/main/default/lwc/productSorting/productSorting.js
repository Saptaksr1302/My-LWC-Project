import { LightningElement, track, wire } from 'lwc';
import getSortedProducts from '@salesforce/apex/ProductSortingController.getSortedProducts';
import getSortingOptions from '@salesforce/apex/ProductSortingController.getSortingOptions';

export default class ProductSorting extends LightningElement {

    @track sortingOptions = []; // Dynamic sorting options from metadata
    @track selectedOption=''; // Selected sorting option by the user
    @track products = []; // List of products to display
    @track productsNotFound = false; // Flag for no products

    // Fetch sorting options dynamically from custom metadata
    @wire(getSortingOptions)
    WiredSortingOptions({ error, data }) {
        if (data) {
            console.log(data);
            this.sortingOptions = data.map(option => ({
                label: option.MasterLabel,
                value: option.DeveloperName
            }));
            if(!this.selectedOption){
                this.products = [];
                return;
            }
            this.selectedOption = this.sortingOptions[0]?.value; // Set default sorting option
            if (this.selectedOption) {
                this.fetchProducts();
            }
        } else if (error) {
            console.error('Error fetching sorting options:', error);
        }
    }

    // Fetch products dynamically based on the selected sorting option
    fetchProducts() {

        // const pricebookName = 'Capricorn B2B LWR Store Price Book';

        getSortedProducts({ sortingOptionName: this.selectedOption })
            .then(data => {
                console.log(data);
                this.products = data;
                this.productsNotFound = false;
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                this.productsNotFound = true;
            });
    }

    // Handle sorting option change
    handleSortingChange(event) {
        this.selectedOption = event.detail.value;
        this.fetchProducts();
    }
}