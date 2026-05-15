public without sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getUserCases() {
        List<Case> cases = [
            SELECT Id, CaseNumber, Subject, Description, Priority, Reason, Type, Origin, Status, CreatedDate 
            FROM Case 
            WHERE OwnerId = :UserInfo.getUserId() 
            ORDER BY CreatedDate DESC
        ];

        // for (Case c : cases) {
        //     if (c.Origin == null) {
        //         c.Origin = 'N/A';
        //     }
        //     if(c.Description == null) {
        //         c.Description = 'No Description Available';
        //     }
        //     if(c.Priority == null) {
        //         c.Priority = 'Normal';
        //     }
        //     if(c.Reason == null) {
        //         c.Reason = 'No Reason Provided';
        //     }
        //     if(c.Type == null) {
        //         c.Type = 'General Inquiry';
        //     }
        // }
        return cases;
    }

    // @AuraEnabled(cacheable=true)
    // public static Map<String, List<String>> getPicklistValues(String objectName, List<String> fieldNames) {
    //     Map<String, List<String>> picklistValuesMap = new Map<String, List<String>>();

    //     for (String fieldName : fieldNames) {
    //         List<String> picklistValues = new List<String>();
    //         Schema.DescribeFieldResult fieldResult = Schema.getGlobalDescribe().get(objectName).getDescribe()
    //             .fields.getMap().get(fieldName).getDescribe();

    //         for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
    //             picklistValues.add(entry.getLabel());
    //         }
    //         picklistValuesMap.put(fieldName, picklistValues);
    //     }
    //     return picklistValuesMap;
    // }

    @AuraEnabled
    public static void updateUserCases(List<Case> newCases) {
        try {
            update newCases;
        } catch (DmlException e) {
            throw new AuraHandledException('Error updating cases: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Case_Code__c> getActiveCaseCodes() {
        return [SELECT Id, Name, Description__c FROM Case_Code__c WHERE Is_Active__c = true AND Case__c = null];
    }

    @AuraEnabled
    public static void assignCodesToCase(Id caseId, List<Id> codeIds) {
        List<Case_Code__c> codes = [SELECT Id FROM Case_Code__c WHERE Id IN :codeIds];
        for (Case_Code__c code : codes) {
            code.Case__c = caseId;
        }
        update codes;
    }
}