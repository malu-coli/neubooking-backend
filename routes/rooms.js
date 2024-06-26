import express from 'express';
import { 
    createRoom, 
    deleteRoom, 
    getRoom, 
    getRooms, 
    updateRoom, 
    updateRoomAvailablity
} from '../controllers/room.js';

const router = express.Router();

//CREATE
router.post("/:hotelid", createRoom);
//UPDATE
router.put("/:id", updateRoom);
router.put("/availability/:id", updateRoomAvailablity);
//DELETE
router.delete("/:id/:hotelid", deleteRoom);
//GET
router.get("/:id", getRoom);
//GET ALL
router.get("/", getRooms);

export default router;