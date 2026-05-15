import { LightningElement, track, wire } from 'lwc';
import getFeaturedProducts from '@salesforce/apex/FeaturedProductsController.getFeaturedProducts';
import { NavigationMixin } from 'lightning/navigation';
import './starProductCarousel.css';

export default class StarProductCarousel extends NavigationMixin(LightningElement) {

    @track products = [];
    @track currentIndex = 0;
    @track trackStyle = '';
    //@track iframeSrc = null;
 
    @wire(getFeaturedProducts)
    wiredProducts({ error, data }) {
        console.log(data);
        if (data) {
            this.products = data.map(product => ({
                id: product.productId,
                name: product.name,
                price: product.price || 'N/A',
                // image: product.imageUrl ? `CapricornB2BLWRStore/sfc/servlet.shepherd/document/download/${product.imageUrl}` : '/default-image-path' // Fallback for missing images
            }));
        } 
        if (error) {
            console.error('Error fetching products:', error);
            this.products = [];
        }
    }
 
    handlePrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.products.length - 1; // Loop to the last item
        }
        this.updateTrackStyle();
    }

    updateTrackStyle() {
        const itemWidth = 100; // Percentage width of a single carousel item
        this.trackStyle = `transform: translateX(-${this.currentIndex * itemWidth}%);`;
    }
 
    handleNext() {
        if (this.currentIndex < this.products.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to the first item
        }
        this.updateTrackStyle();
    }

    connectedCallback() {
        this.autoSlide = setInterval(() => {
            this.handleNext();
        }, 5000);
    }

    disconnectedCallback() {
        clearInterval(this.autoSlide);
    }
 
    handleViewProduct(event) {
        const productId = event.currentTarget.dataset.id;
        console.log(productId);
        const productName = event.currentTarget.dataset.name;
        console.log(productName);
        const targetUrl = `https://ddl00000eh8lbuab-dev-ed.develop.my.site.com/CapricornB2BLWRStore/product/${productName}/${productId}`;
        
        // if(productId){
        //     this[NavigationMixin.Navigate]({
        //         type: 'standard__webPage',
        //         attributes: {
        //             url: targetUrl
        //         }
        //     });
        // }

        // if(productId){
        //     this.iframeSrc = targetUrl;
        // }

        // const iframeElement = this.template.querySelector('.product-iframe');
        //     if (iframeElement) {
        //         iframeElement.scrollIntoView({ behavior: 'smooth' });
        //     }

        if(productId && productName){
            window.location.href = targetUrl;
        }
    }
}