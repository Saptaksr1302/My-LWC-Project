public without sharing class ProductInventoryController {
    @AuraEnabled(cacheable=true)
    public static List<InventoryWrapper> getInventoryData(Id productId) {

        List<InventoryWrapper> inventoryList = new List<InventoryWrapper>();
 
        // Fetch inventory data for the given products
        List<Product_Inventory__c> inventoryRecords = [
            SELECT Product__c, Stock_Quantity__c, Restore_Date__c
            FROM Product_Inventory__c
            WHERE Product__c = :productId LIMIT 1
        ];
 
        // Process inventory records
        for (Product_Inventory__c record : inventoryRecords) {
            inventoryList.add(new InventoryWrapper(
                record.Product__c,
                record.Stock_Quantity__c,
                record.Restore_Date__c
            ));
        }
 
        return inventoryList;
    }
 
    // Wrapper class to return structured data
    public class InventoryWrapper {
        @AuraEnabled public Id productId;
        @AuraEnabled public Decimal quantity;
        @AuraEnabled public Date restockDate;
 
        public InventoryWrapper(Id productId, Decimal quantity, Date restockDate) {
            this.productId = productId;
            this.quantity = quantity;
            this.restockDate = restockDate;
        }
    }
}