const {getStaffDetails, getOrganizationDetails } = require("./db");

const handleFetchOrganizationDetails = async (address) =>{
    var details = await getStaffDetails(address);
        var organizationDetails = [];
        if (details.length == 0) {
           // organizationDetails.push({ "image": "https://the-organization-logo.s3.ap-south-1.amazonaws.com/imageURL-1657871685788", "organizationId": 1657871686003, "addresses": '["0xa85a8f2de5bccfb35ad70fe4fcf8f2ada7323c72"]', "createdBy": "0xa85a8f2de5bccfb35ad70fe4fcf8f2ada7323c72", "name": "test", "accessToken": "some-token" })
            organizationDetails.push(await getOrganizationDetails(1657871686003));
        } else {
            for (var i = 0; i < details.length; i++) {
                var organizationId = details[i].organizationId;
                organizationDetails[i] = await getOrganizationDetails(organizationId);
            }
            organizationDetails.push(await getOrganizationDetails(1657871686003));
           // organizationDetails.push({ "image": "https://the-organization-logo.s3.ap-south-1.amazonaws.com/imageURL-1657871685788", "organizationId": 1657871686003, "addresses": '["0xa85a8f2de5bccfb35ad70fe4fcf8f2ada7323c72"]', "createdBy": "0xa85a8f2de5bccfb35ad70fe4fcf8f2ada7323c72", "name": "test", "accessToken": "some-token" })
            for (var i = 0; i < organizationDetails.length; i++) {
                if (organizationDetails[i].initialValues != undefined) {
                    organizationDetails[i].closedPercentage =
                        (organizationDetails[i].closed - organizationDetails[i].initialValues.closed) * 100 / ((organizationDetails[i].initialValues.closed == 0) ?
                            1 : organizationDetails[i].initialValues.closed);
                    organizationDetails[i].closedSign = (organizationDetails[i].closedPercentage >= 0) ? "down" : "up";

                    organizationDetails[i].prioritizedPercentage =
                        (organizationDetails[i].prioritized - organizationDetails[i].initialValues.prioritized) * 100 / ((organizationDetails[i].initialValues.prioritized == 0) ?
                            1 : organizationDetails[i].initialValues.prioritized);
                    organizationDetails[i].prioritizedSign = (organizationDetails[i].prioritizedPercentage >= 0) ? "down" : "up";

                    organizationDetails[i].totalPercentage =
                        (organizationDetails[i].totalConversations - organizationDetails[i].initialValues.totalConversations) * 100 / ((organizationDetails[i].initialValues.totalConversations == 0) ?
                            1 : organizationDetails[i].initialValues.totalConversations);
                    organizationDetails[i].totalSign = (organizationDetails[i].totalPercentage >= 0) ? "down" : "up";

                    organizationDetails[i].staffPercentage =
                        (organizationDetails[i].staff - organizationDetails[i].initialValues.staff) * 100 / ((organizationDetails[i].initialValues.staff == 0) ?
                            1 : organizationDetails[i].initialValues.staff);
                    organizationDetails[i].staffSign = (organizationDetails[i].staffPercentage >= 0) ? "down" : "up";

                    organizationDetails[i].customers = organizationDetails[i].totalConversations - organizationDetails[i].closed;
                    organizationDetails[i].customerPercentage =
                        (organizationDetails[i].customers - organizationDetails[i].initialValues.customers) * 100 / ((organizationDetails[i].initialValues.customers == 0) ?
                            1 : organizationDetails[i].initialValues.customers);
                    organizationDetails[i].customerSign = (organizationDetails[i].customerPercentage >= 0) ? "down" : "up";
                }
            }
        }
        return organizationDetails;
}
module.exports = { handleFetchOrganizationDetails };