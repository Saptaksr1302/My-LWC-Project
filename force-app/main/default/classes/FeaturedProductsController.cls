public without sharing class FeaturedProductsController {
    @AuraEnabled(cacheable=true)
    public static List<ProductWrapper> getFeaturedProducts() {

        Pricebook2 storePricebook = [ SELECT Id FROM Pricebook2 WHERE Name = :label.Pricebook_Name AND IsActive = true];

        // Fetch products from the category
        List<Product2> featuredProducts = [
            SELECT Id, Name, (SELECT UnitPrice FROM PricebookEntries WHERE Pricebook2Id = :storePricebook.Id LIMIT 1)
            FROM Product2
            WHERE Id IN (
                SELECT ProductId FROM ProductCategoryProduct WHERE ProductCategoryId = :label.Mobile_and_Watches
            )
            AND IsActive = true
            LIMIT 10
        ];
 
        // A wrapper to include image URLs
        List<ProductWrapper> productWrappers = new List<ProductWrapper>();
        for (Product2 product : featuredProducts) {
            // Fetch primary media (image) for the product
            List<ProductMedia> mediaLinks = [
                SELECT ElectronicMediaId
                FROM ProductMedia
                WHERE ProductId = :product.Id
                ORDER BY SortOrder ASC
                LIMIT 1
            ];

            // List<ManagedContentVariant> mediaLinks = [
            //     SELECT ManagedContentId FROM ManagedContentVariant
            //     WHERE Name = :product.Name LIMIT 1
            // ];
 
            // Add to the wrapper
            productWrappers.add(new ProductWrapper(
                product.Id,
                product.Name,
                product.PricebookEntries.isEmpty() ? null : product.PricebookEntries[0].UnitPrice,
                mediaLinks.isEmpty() ? null : mediaLinks[0].ElectronicMediaId
                //imageUrl
            ));
        }
 
        return productWrappers;
    }
 
    // Wrapper class for the products and images
    public class ProductWrapper {
        @AuraEnabled public String productId;
        @AuraEnabled public String name;
        @AuraEnabled public Decimal price;
        @AuraEnabled public String imageUrl;
 
        public ProductWrapper(String productId, String name, Decimal price, String imageUrl) {
            this.productId = productId;
            this.name = name;
            this.price = price;
            this.imageUrl = imageUrl;
        }
    }
}