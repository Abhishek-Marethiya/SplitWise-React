const express = require("express");
const { createGroup, getGroups,deleteGroup,getGroupById,addMemberToGroup } =require("../controllers/groupControllers");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.delete("/:id",deleteGroup);
router.get("/:id",getGroupById);
router.put('/:id',addMemberToGroup);
module.exports = router;
