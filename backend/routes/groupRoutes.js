const express = require("express");
const { createGroup, getGroups,deleteGroup,getGroupById,addMemberToGroup,removeMemberFromGroup,updateMemberName } =require("../controllers/groupControllers");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.delete("/:id",deleteGroup);
router.get("/:id",getGroupById);
router.put('/:id',addMemberToGroup);
router.delete('/:id/member',removeMemberFromGroup);
router.patch('/:id/member',updateMemberName);
module.exports = router;
