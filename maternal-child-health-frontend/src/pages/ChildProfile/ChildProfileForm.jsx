import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Child name is required'),
  dob: yup.date().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female'], 'Select gender').required('Gender is required'),
});

const ChildProfileForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const motherId = searchParams.get('mother_id'); // or pass via props/context

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, mother_id: motherId };
      const response = await axios.post('/api/children', payload);
      console.log('Child created:', response.data);

      // Redirect to child profile or dashboard
      navigate(`/mother/children/${response.data.id}`);
    } catch (error) {
      console.error('Error creating child:', error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Child Profile Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Child Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            {...register('name')}
            placeholder="Enter child's name"
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
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
          <label className="form-label">Gender</label>
          <select
            className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
            {...register('gender')}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <div className="invalid-feedback">{errors.gender?.message}</div>
        </div>

        <button type="submit" className="btn btn-primary">Save Child Profile</button>
      </form>
    </div>
  );
};

export default ChildProfileForm;
