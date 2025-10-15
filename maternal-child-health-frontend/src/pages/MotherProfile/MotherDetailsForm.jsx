import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import AppLoading from "../components/spinners/AppPageLoading";
// import AppLoadError from "../components/spinners/AppLoadError";

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  dob: yup.date().required('Date of birth is required'),
  contactNumber: yup
    .string()
    .matches(/^0\d{9}$/, 'Enter a valid South African number')
    .required('Contact number is required'),
  address: yup.string().required('Address is required'),
  lastMenstrualDate: yup.date().required('Last menstrual date is required'),
});

const MotherDetailsForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/mothers', data);
      console.log('Mother saved:', response.data);

      // Redirect to child form or dashboard
      navigate('/mother/children/new'); // or '/mother/dashboard'
    } catch (error) {
      console.error('Error saving mother:', error);
    }
  };

  return (
    <div className="container p-4">
      <h2 className="mb-4 text-center">Mother Details Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            {...register('fullName')}
            placeholder="Enter full name"
          />
          <div className="invalid-feedback">{errors.fullName?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
            {...register('dob')}
          />
          <div className="invalid-feedback">{errors.dob?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Last Menstrual Date</label>
          <input
            type="date"
            className={`form-control ${errors.lastMenstrualDate ? 'is-invalid' : ''}`}
            {...register('lastMenstrualDate')}
          />
          <div className="invalid-feedback">{errors.lastMenstrualDate?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input
            type="tel"
            className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
            {...register('contactNumber')}
            placeholder="Enter contact number"
          />
          <div className="invalid-feedback">{errors.contactNumber?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            {...register('address')}
            rows="3"
            placeholder="Enter address"
          ></textarea>
          <div className="invalid-feedback">{errors.address?.message}</div>
        </div>

        <button type="submit" className="btn btn-success">Save Details</button>
      </form>
    </div>
  );
};

export default MotherDetailsForm;
