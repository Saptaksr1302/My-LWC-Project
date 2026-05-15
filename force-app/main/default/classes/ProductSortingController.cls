public without sharing class ProductSortingController {
    @AuraEnabled(cacheable=true)
    public static List<Product2> getSortedProducts(String sortingOptionName, String pricebookName) {
        // Fetch the sorting option from Custom Metadata
        Product_Sorting_Option__mdt sortOptions = [
            SELECT Sorting_Field__c, Sort_Direction__c, Best_Product__c 
            FROM Product_Sorting_Option__mdt 
            WHERE DeveloperName = :sortingOptionName 
            LIMIT 1
        ];

        // List<Pricebook2> pricebook = [SELECT Id FROM Pricebook2 WHERE Id = :pricebookName];

        // Id pricebookId = pricebook[0].Id;

        // List<PricebookEntry> storePricebookEntries = [SELECT Product2Id FROM PricebookEntry WHERE Pricebook2Id = :pricebookId AND IsActive = true];

        // Set<Id> productIds = new Set<Id>();
        // for(PricebookEntry entry:storePricebookEntries){
        //     productIds.add(entry.Product2Id);
        // }

        String sortingField = sortOptions.Sorting_Field__c;
        String sortDirection = sortOptions.Sort_Direction__c;
        Boolean bestProduct = sortOptions.Best_Product__c;

        // Build the query
        String query = 'SELECT Id, Name FROM Product2 WHERE IsActive = true';

        if (bestProduct) {
            query += ' AND Best_Product__c = true';
        }

        query += ' ORDER BY ' + sortingField + ' ' + sortDirection;

        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Product_Sorting_Option__mdt> getSortingOptions() {
        // Query all sorting options from Custom Metadata
        return [
            SELECT DeveloperName, MasterLabel 
            FROM Product_Sorting_Option__mdt
            ORDER BY MasterLabel ASC
        ];
    }
}