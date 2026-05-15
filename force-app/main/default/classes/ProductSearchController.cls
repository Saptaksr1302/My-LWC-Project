public without sharing class ProductSearchController {
    @AuraEnabled(cacheable=true)
    public static List<ProductWrapper> searchProducts(String keyword) {
        System.debug(keyword);
        //String pricebookName = 'Capricorn B2B LWR Store Price Book';
        //String strikePricebookName = 'Capricorn B2B LWR Store Strikethrough Price Book';

        Pricebook2 storePricebook = [ SELECT Id FROM Pricebook2 WHERE Name = :label.Pricebook_Name AND IsActive = true];

        Pricebook2 strikePricebook = [SELECT Id FROM Pricebook2 WHERE Name = :label.Strike_Pricebook_Name AND IsActive = true];

        keyword = '%' + keyword + '%';
        // List<Product2> products = [
        //     SELECT Id, Name, ProductCode, Description, StockKeepingUnit
        //     FROM Product2
        //     WHERE Id IN (SELECT Product2Id FROM PricebookEntry WHERE Pricebook2Id = :storePricebook.Id) AND IsActive = true  AND (Name LIKE :keyword OR ProductCode LIKE :keyword OR Description LIKE :keyword OR StockKeepingUnit LIKE :keyword)
        // ];
        //return products;
        List<PricebookEntry> storePricebookEntries = [SELECT Id, Product2Id, UnitPrice, Product2.Name, Product2.ProductCode, Product2.StockKeepingUnit FROM PricebookEntry WHERE Pricebook2Id = :storePricebook.Id AND Product2.IsActive = true AND (Product2.Name LIKE :keyword OR Product2.ProductCode LIKE :keyword OR Product2.StockKeepingUnit LIKE :keyword)];

        Map<Id, Decimal> strikeProductPrices = new Map<Id, Decimal>();
        for(PricebookEntry pe:[SELECT Product2Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :strikePricebook.Id]){
            strikeProductPrices.put(pe.Product2Id, pe.UnitPrice);
        }

        List<ProductWrapper> products = new List<ProductWrapper>();
        for(PricebookEntry pe:storePricebookEntries){
            Decimal strikePrice = strikeProductPrices.containsKey(pe.Product2Id) ? strikeProductPrices.get(pe.Product2Id) : 0;
            products.add(new ProductWrapper(pe.Product2Id, pe.Product2.Name, pe.UnitPrice, strikePrice, pe.Product2.StockKeepingUnit, pe.Product2.ProductCode));
        }
        
        return products;
    }
    
    //Wrapper Class
    public class ProductWrapper{
        @AuraEnabled public Id productId;
        @AuraEnabled public String name;
        @AuraEnabled public Decimal price;
        @AuraEnabled public Decimal strikePrice;
        @AuraEnabled public String sku;
        @AuraEnabled public String productCode;

        public ProductWrapper(Id productId, String name, Decimal price, Decimal strikePrice, String productCode, String sku) {
            this.productId = productId;
            this.name = name;
            this.price = price;
            this.strikePrice = strikePrice;
            this.sku = sku;
            this.productCode = productCode;
        }
    }
}