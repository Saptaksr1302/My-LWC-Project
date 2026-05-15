import { LightningElement, track } from 'lwc';

export default class CaseItemButton extends LightningElement {

    @track showCases = false;

    get buttonLabel() {
        return this.showCases ? 'Hide Cases' : 'Show Cases';
    }
 
    handleOpenCases() {
        this.showCases = !this.showCases;
    }
}