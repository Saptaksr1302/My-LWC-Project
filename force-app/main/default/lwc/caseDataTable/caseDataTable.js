import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getUserCases from '@salesforce/apex/CaseController.getUserCases';
import updateUserCases from '@salesforce/apex/CaseController.updateUserCases';
import getActiveCaseCodes from '@salesforce/apex/CaseController.getActiveCaseCodes';
import assignCodesToCase from '@salesforce/apex/CaseController.assignCodesToCase';
// import getPicklistValues from '@salesforce/apex/CaseController.getPicklistValues';

// const OBJECT_NAME = 'Case';
// const PICKLIST_FIELDS = ['Status', 'Origin', 'Priority', 'Reason'];

const COLUMNS = [
    // { label: 'Case Number', fieldName: 'CaseNumber', type: 'text', initialWidth: 130 },
    {
        label: 'Case Number',
        fieldName: 'caseLink',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'CaseNumber' },
            target: '_self'
        },
        initialWidth: 100
    },
    // { label: 'Subject', fieldName: 'Subject', type: 'text', wrapText: true },
    // {
    //     label: 'Subject',
    //     fieldName: 'caseLink',
    //     type: 'url',
    //     typeAttributes: {
    //         label: { fieldName: 'Subject' },
    //         target: '_self'
    //     },
    //     wrapText: true
    // },
    {
        label: 'Subject',
        fieldName: 'Subject',
        type: 'text',
        editable: true,
        wrapText: true,
        initialWidth: 140
    },
    { label: 'Description', fieldName: 'Description', type: 'text', editable: true, wrapText: true },
    { label: 'Origin', fieldName: 'Origin', type: 'text', editable: true, initialWidth: 90 },
    // { label: 'Origin', fieldName: 'Origin', type: 'picklist', editable: true, typeAttributes: {
    //     placeholder: 'Select Origin',
    //     options: [
    //         { label: 'Email', value: 'Email' },
    //         { label: 'Phone', value: 'Phone' },
    //         { label: 'Web', value: 'Web' }
    //     ]
    // },
    // initialWidth: 100 },
    // {
    //     label: 'Origin',
    //     fieldName: 'Origin',
    //     type: 'picklist',
    //     typeAttributes: {
    //         placeholder: 'Choose Origin',
    //         options: { fieldName: 'picklistOptions.Origin' },
    //         value: { fieldName: 'Origin' }, // Default value
    //         context: { fieldName: 'Id' } // Track which row is being edited
    //     },
    //     editable: true
    // },
    { label: 'Status', fieldName: 'Status', type: 'text', editable: true, initialWidth: 120 },
    // { label: 'Status', fieldName: 'Status', type: 'picklist', editable: true, typeAttributes: {
    //     placeholder: 'Choose Status',
    //     options: [
    //         { label: 'Closed', value: 'Closed' },
    //         { label: 'New', value: 'New' },
    //         { label: 'Working', value: 'Working' },
    //         {label: 'Escalated', value: 'Escalated' },
    //     ]
    // },
    //  initialWidth: 120 },
    // {
    //     label: 'Status',
    //     fieldName: 'Status',
    //     type: 'picklist',
    //     typeAttributes: {
    //         placeholder: 'Choose Status',
    //         options: { fieldName: 'picklistOptions.Status' },
    //         value: { fieldName: 'Status' }, // Default value
    //         context: { fieldName: 'Id' } // Track which row is being edited
    //     },
    //     editable: true
    // },
    {label: 'Priority', fieldName: 'Priority', type: 'text', editable: true, initialWidth: 100 },
    // {label: 'Priority', fieldName: 'Priority', type: 'picklist', typeAttributes: {
    //     placeholder: 'Choose Priority',
    //     options: [
    //         { label: 'High', value: 'High' },
    //         { label: 'Medium', value: 'Medium' },
    //         { label: 'Low', value: 'Low' }
    //     ]
    // }, 
    // initialWidth: 100 },
    {label: 'Reason', fieldName: 'Reason', type: 'text', editable: true, wrapText: true, initialWidth: 120 },
    // {label: 'Reason', fieldName: 'Reason', type: 'picklist', editable: true, typeAttributes: {
    //     placeholder: 'Choose Reason',
    //     options: [
    //         { label: 'Installation', value: 'Installation' },
    //         { label: 'Equipment Complexity', value: 'Equipment Complexity' },
    //         { label: 'Performance', value: 'Performance' },
    //         {label: 'Breakdown', value: 'Breakdown' },
    //         {label: 'Equipment Design', value: 'Equipment Design' },
    //         {label: 'Feedback', value: 'Feedback' },
    //         {label: 'Customer Request', value: 'Customer Request' },
    //         {label: 'Product Issue', value: 'Product Issue' },
    //         {label: 'Delay in Delivery', value: 'Delay in Delivery' },
    //         {label: 'Return/Remake', value: 'Return/Remake' },
    //         {label: 'Shipping Delay', value: 'Shipping Delay' },
    //         {label: 'Other', value: 'Other' }
    //     ]
    // }, 
    // wrapText: true, initialWidth: 120 },
    // {
    //     label: 'View Case Details',
    //     type: 'button',
    //     typeAttributes: {
    //         label: 'View Details',
    //         name: 'view_details',
    //         variant: 'brand',
    //         iconName: 'utility:preview',
    //         iconPosition: 'left',
    //         class: 'custom-view-details'
    //     },
    //     cellAttributes: {
    //         alignment: 'center'
    //     }, 
    //     initialWidth: 150
    // }
    {
        type: 'button',
        label: 'Assign Codes',
        typeAttributes: {
            label: 'Add Codes',
            name: 'add_codes',
            variant: 'outline-brand'
        }
    }
];

export default class CaseDataTable extends LightningElement {

    @track cases = [];
    //@track isModalOpen = false;
    //@track selectedCase = {};
    @track draftValues = [];
    columns = COLUMNS;
    // @track picklistOptions = {
    //     Status: [],
    //     Origin: [],
    //     Priority: [],
    //     Reason: []
    // };
    @track newCases = [];
    @track caseOptions = [];
    @track caseCodes = [];
    @track selectedCaseId = '';
    @track selectedCodeIds = [];

    @track isModalOpen = false;
    @track showCaseSelection = true;
    @track showCodeSelection = false;
    @track selectedCaseNumber;
    @track showError = false;
    errorTimeout;
    //@track modalTitle = 'Select Case';

    // newColumns = [
    //     { label: 'Case Number', fieldName: 'CaseNumber' }
    // ];

    codeColumns = [
        { label: 'Code Number', fieldName: 'Name' },
        { label: 'Description', fieldName: 'Description__c', wrapText: true },
    ];

    @wire(getUserCases)
    wiredCases({ error, data }) {
        if (data) {
            console.log(data);
            this.cases = data.map(caseRecord => ({
                ...caseRecord,
                caseLink: `/lightning/r/Case/${caseRecord.Id}/view`,
                Origin: caseRecord.Origin || 'N/A',
                Description: caseRecord.Description || 'No Description Available',
                Priority: caseRecord.Priority || 'Normal',
                Reason: caseRecord.Reason || 'No Reason Provided',
                Type: caseRecord.Type || 'General Inquiry',
                // picklistOptions: this.picklistOptions,
            }));
            // this.cases = data;
        } else if (error) {
            console.error('Error fetching cases:', error);
        }
    }

    // @wire(getPicklistValues, { objectName: OBJECT_NAME, fieldNames: PICKLIST_FIELDS })
    // wiredPicklistValues({ error, data }) {
    //     if (data) {
    //         let picklistData = {};
    //         Object.keys(data).forEach(field => {
    //             picklistData[field] = data[field].map(value => ({ label: value, value: value }));
    //         });

    //         this.picklistOptions = picklistData;

    //         // Update cases to attach picklist values dynamically
    //         this.cases = this.cases.map(caseRecord => ({
    //             ...caseRecord,
    //             picklistOptions: this.picklistOptions
    //         }));
    //     } else if (error) {
    //         console.error('Error fetching picklist values:', error);
    //     }
    // }

    handleSave(event) {
        const updatedCaseFields = event.detail.draftValues;
        // let isValid = true;
        // let errorMessage = '';

        // updatedCaseFields.forEach(record => {
        //     if (!record.Status || record.Status.trim() === '') {
        //         isValid = false;
        //         errorMessage = 'Status cannot be empty.';
        //     }
        //     if (!record.Origin || record.Origin.trim() === '') {
        //         isValid = false;
        //         errorMessage = 'Origin cannot be empty.';
        //     }
        // });
    
        // if (!isValid) {
        //     this.showToast('Error', errorMessage, 'error');
        //     return; // Stop save operation
        // }

        updateUserCases({ newCases: updatedCaseFields })
            .then(() => {
                console.log(updatedCaseFields);
                this.showToast('Success', 'Cases updated successfully!', 'success');
                this.draftValues = []; // Clear draft values
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                return refreshApex(this.wiredCases);
            })
            .catch(error => {
                console.error('Error updating cases:', error);
                this.showToast('Error', 'Failed to update cases.', 'error');
            });
    }

    // connectedCallback() {
    //     getUserCases()
    //         .then(data => {
    //             console.log(data);
    //             this.newCases = data;
    //             this.caseOptions = data.map(result => ({
    //                 //label: result.CaseNumber,
    //                 label: result.Subject,
    //                 value: result.Id
    //             }));
    //         })
    //         .catch(err => console.error(err));
    // }

    // openModal() {
    //     this.isModalOpen = true;
    //     this.showCaseSelection = true;
    //     this.showCodeSelection = false;
    //     this.selectedCaseId = '';
    //     this.modalTitle = 'Select Case';
    // }

    // handleCaseChange(event) {
    //     this.selectedCaseId = event.detail.value;
    // }

    // handleNext() {
    //     if (!this.selectedCaseId) {
    //         this.showToast('Error', 'Please select a case before proceeding.', 'error');
    //         return;
    //     }

    //     getActiveCaseCodes()
    //         .then(data => {
    //             console.log(data);
    //             this.caseCodes = data;
    //             this.showCaseSelection = false;
    //             this.showCodeSelection = true;
    //             this.modalTitle = 'Assign Case Codes';
    //         })
    //         .catch(err => console.error(err));
    // }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        console.log(actionName);
        const row = event.detail.row;
        console.log(row);

        if (actionName === 'add_codes') {
            this.selectedCaseId = row.Id;
            console.log(this.selectedCaseId);
            this.selectedCaseNumber = row.CaseNumber;
            console.log(this.selectedCaseNumber);
            this.openModal();
        }
    }

    handleCodeSelection(event) {
        this.selectedCodeIds = event.detail.selectedRows.map(row => row.Id);
        console.log(this.selectedCodeIds);
    }

    openModal() {
        getActiveCaseCodes()
            .then(result => {
                console.log(result);
                this.isModalOpen = true;
                this.caseCodes = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleSaveCodes() {
        if (this.selectedCodeIds.length === 0) {
            // this.dispatchEvent(new ShowToastEvent({
            //     title: 'Error',
            //     message: 'Select at least one Case Code to proceed.',
            //     variant: 'error'
            // }));
            this.showError = true;

            if (this.errorTimeout) {
                clearTimeout(this.errorTimeout);
            }
    
            this.errorTimeout = setTimeout(() => {
                this.showError = false;
                this.errorTimeout = null;
            }, 2000);

            return;
        }

        assignCodesToCase({ caseId: this.selectedCaseId, codeIds: this.selectedCodeIds })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Case Codes assigned successfully.',
                    variant: 'success'
                }));
                this.closeModal();
            })
            .catch(error => {
                console.error(error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to assign codes.',
                    variant: 'error'
                }));
            });
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedCaseId = '';
        this.selectedCodeIds = [];
        this.showError = false;
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    // handleSave() {
    //     if (this.selectedCodeIds.length === 0) {
    //         this.showToast('Error', 'Select at least one Case Code to proceed.', 'error');
    //         return;
    //     }

    //     assignCodesToCase({ caseId: this.selectedCaseId, codeIds: this.selectedCodeIds })
    //         .then(() => {
    //             this.showToast('Success', 'Case Codes assigned successfully.', 'success');
    //             this.closeModal();
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             this.showToast('Error', 'Error assigning codes.', 'error');
    //         });
    // }

    // handleRowAction(event) {
    //     const actionName = event.detail.action.name;
    //     const row = event.detail.row;

    //     if (actionName === 'view_details') {
    //         this.selectedCase = row;
    //         this.isModalOpen = true;
    //     }
    // }

    // get selectedCaseOrigin() {
    //     return this.selectedCase.Origin || 'N/A';
    // }

    // get selectedCaseDescription(){
    //     return this.selectedCase.Description || 'No Description Available';
    // }

    // get selectedCasePriority(){
    //     return this.selectedCase.Priority || 'Normal';
    // }

    // get selectedCaseReason(){
    //     return this.selectedCase.Reason || 'No Reason Provided';
    // }

    // get selectedCaseType(){
    //     return this.selectedCase.Type || 'General Inquiry';
    // }

    // closeModal() {
    //     this.isModalOpen = false;
    // }
}