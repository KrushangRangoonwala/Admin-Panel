import express from 'express';
import Size from '../models/sizeSchema.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const allSize = await Size.find({});
            console.log('allSize', allSize);
            res.json(allSize);
        } catch (error) {
            res.json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            const savedSize = await Size.create(req.body);
            console.log('savedSize', savedSize);
            res.status(201).json(savedSize);
        } catch (error) {
            res.json({ message: error.message });
        }
    });


router.route('/id/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        console.log('id', id);
        try {
            const record = await Size.findById(id);
            res.send({
                success: true,
                message: 'SubCategory found',
                data: record,
            })
        } catch (error) {
            res.send({
                success: false,
                error,
            })
        }
    })
    .delete(async (req, res) => {
        const id = req.params.id;
        console.log('id', id);
        try {
            const record = await Size.findByIdAndDelete(id);
            res.send({
                success: true,
                message: 'Size deleted',
                data: record,
            })
        } catch (error) {
            res.send({
                success: false,
                error,
            })
        }
    })

export default router;