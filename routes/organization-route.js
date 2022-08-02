const express = require('express');
const router = express.Router();
const db = require("../utils/db");
const organizationHandlers = require("../utils/organizationHandlers");
const s3 = require("../utils/s3");
const compareStaff = require('../helper/compare-list');

router.post("/createOrganization", s3.uploadLogo.single("imageURL"), async function (req, res) {
    var name = req.body.organizationName;
    var createdBy = req.body.createdBy;
    var organizationId = +new Date();
    console.log(req.body.address)
    await db.addNewOrganizationStaff(organizationId, createdBy);

    var addressList = [];
    addressList[0] = createdBy;

    if (req.body.address != null) {
        var address = req.body.address.count;

        if (typeof address === "string") {
            var addressString = address.toLowerCase();
            addressList[1] = addressString;
            await db.addNewOrganizationStaff(organizationId, addressString);
        } else if (typeof address === "object") {
            for (let i = 0; i < address.length; i++) {
                let addressString = address[i].toLowerCase();
                addressList[i + 1] = address[i]
                await db.addNewOrganizationStaff(organizationId, addressString);
            }
        }
    }
    await db.addNewOrganization(name, JSON.stringify(addressList), req.file.location, organizationId, createdBy);

    res.send('<script>alert("Organization added"); window.location.href = "/"; </script>');
});
//
router.patch("/updateOrganization", s3.uploadLogo.single("image"), async(req,res) => {
    const orgID = req.query?.orgID
    const { name, addresses, createdBy } = req.body || {};
 
    const addressList = addresses.split(',');
    const submitStaff = addressList.map(a => ({ organizationId: parseInt(orgID), address: a}));
    const currentStaffs = await db.getStaffs(parseInt(orgID));
  
    const deleteList = compareStaff(submitStaff,currentStaffs);
    const addList = compareStaff(currentStaffs,submitStaff);

    if(deleteList.length) await db.deleteOrganizationStaffs(deleteList);
    if(addList.length)await db.updateOrganizationStaffs(addList);
    const response = await db.updateOrganization( name, addressList, req?.file?.location , orgID, createdBy);
    res.json({organization: response?.Attributes})
     
})

router.get('/getOrganization', async (req, res) => {
    try {
        const id = req.query.orgID;
        const organization = await db.getOrganizationDetails(parseInt(id));
        if(!organization) {
            res.status(404).json({ message: "Not found"})
        }
        res.json({data: organization})
    } catch (error) {
        console.log(error)
    }

});
router.get("/getOrganizationDetails", async (req, res) => {
    var address = req.query.address;
    if (address != "") {
            var organizationDetails = await organizationHandlers.handleFetchOrganizationDetails(address);
            res.send({ organizationDetails: organizationDetails });
        } else {
        res.send({ error: "couldn't get organization details" })
    }
});

module.exports = router;