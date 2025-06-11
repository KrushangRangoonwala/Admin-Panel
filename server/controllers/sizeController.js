export async function getSizeById(req, res) {
    // async (req, res) => {
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
    // }
}