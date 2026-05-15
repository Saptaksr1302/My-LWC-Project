import { LightningElement, track, wire } from 'lwc';
import searchProducts from '@salesforce/apex/ProductSearchController.searchProducts';

export default class ProductSearch extends LightningElement {

    keyword = '';
    @track products = [];
    @track isLoading = false;
    @track hasNoResults = false;
    @track hasNoMatch = false;

    delayTime;

    handleInputChange(event) {
        
        const inputValue = event.target.value;
    
        if (this.delayTime) {
            clearTimeout(this.delayTime);
        }
    
        this.delayTime = setTimeout(() => {
            this.keyword = inputValue;
            console.log(this.keyword); 
        }, 300);
    }

    // @wire(searchProducts, {keyword: '$keyword'})
    // products({data, error}){

    //     if(data){
    //         console.log(data);
    //     }

    //     if(error){
    //         console.log(error);
    //     }
    // }

    connectedCallback(){
        this.handleSearch();
    }

    handleSearch() {
        if (!this.keyword) {
            this.products = [];
            // this.hasNoResults = true;
            return;
        }

        this.isLoading = true;
        console.log('Checking');
        console.log(this.keyword);
        searchProducts({keyword: this.keyword})
        .then((result) => {
            console.log('Search Results:', result);
            this.products = result;

            if(this.products.length === 0){
                this.hasNoMatch = true;
                this.hasNoResults = false;
            }
            else{
                this.hasNoResults = false;
                this.hasNoMatch = false;
            }
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
            this.products = [];
            this.hasNoResults = true;
        })
        .finally(() => {
            this.isLoading = false;
        });
    }
}