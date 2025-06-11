import { useFormik } from 'formik';
import './CategoryForm.css';
import api from '../axiosConfig';

const UploadCsvModal = ({ isOpen, onClose,onSubmit }) => {
    if (!isOpen) return null;

    const formik = useFormik({
        initialValues: {
            csv: null,
        },
        onSubmit: async (values) => {
            console.log('Form Values:', values.csv); // output : null  

            const formData = new FormData();
            values.csv && formData.append('csv', values.csv);

            try {
                const headers = { 'Content-Type': 'multipart/form-data' };
                const response = await api.post('/product/uploadCsv', formData);  // product api
                console.log('response', response);
            } catch (error) {
                console.error('Error in uploading .csv file:', error);
            }

            onSubmit();
            onClose();
        }
    })

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h3 style={{ marginBottom: '5px', textAlign: 'center', display: 'block' }}>Upload .csv file</h3>
                <h3 style={{ marginBottom: '10px', textAlign: 'center', display: 'block' }}>and Update Product's Data</h3>

                <form onSubmit={formik.handleSubmit} className="category-form" style={{ marginTop: '20px' }}>

                    <input type="file" name="csv" accept=".csv"
                        onChange={(e) => {
                            console.log('e.target.files', e.target.files[0])
                            formik.setFieldValue('csv',e.target.files[0])
                        }} 
                        required/>

                    <div className="form-actions">
                        <button type="submit" className='btn edit-btn'>Upload</button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default UploadCsvModal;