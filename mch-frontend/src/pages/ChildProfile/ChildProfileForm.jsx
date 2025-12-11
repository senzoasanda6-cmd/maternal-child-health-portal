import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // your auth context

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Child name is required'),
  dob: yup.date().required('Date of birth is required'),
  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Select gender')
    .required('Gender is required'),
});

// Roles allowed to edit/create child profiles
const ALLOWED_ROLES = ['admin', 'health_worker', 'midwife', 'facility_worker'];

const ChildProfileForm = () => {
  const { user } = useContext(AuthContext); // current logged-in user
  const navigate = useNavigate();
  const { childId } = useParams(); // child ID if editing
  const [searchParams] = useSearchParams();
  const motherId = searchParams.get('mother_id');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const canEdit = ALLOWED_ROLES.includes(user?.role); // role-based access

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Fetch existing child data if editing
  useEffect(() => {
    if (childId) {
      setLoading(true);
      axios
        .get(`/children/${childId}`)
        .then((res) => {
          const { name, dob, gender } = res.data;
          setValue('name', name);
          setValue('dob', dob.split('T')[0]); // format as YYYY-MM-DD
          setValue('gender', gender);
        })
        .catch((err) => {
          console.error('Failed to load child data:', err);
          setErrorMessage('Failed to load child data.');
        })
        .finally(() => setLoading(false));
    }
  }, [childId, setValue]);

  const onSubmit = async (data) => {
    if (!canEdit) {
      setErrorMessage('You do not have permission to edit this profile.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      let response;
      const payload = { ...data, mother_id: motherId };

      if (childId) {
        // Edit existing child
        response = await axios.patch(`/children/${childId}`, payload);
        setSuccessMessage('Child profile updated successfully!');
      } else {
        // Create new child
        response = await axios.post('/children', payload);
        setSuccessMessage('Child profile created successfully!');
      }

      setTimeout(() => {
        navigate(
          childId
            ? `/mother/children/${childId}`
            : `/mother/children/${response.data.id}`
        );
      }, 1500);
    } catch (error) {
      console.error('Error saving child profile:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to save child profile'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">
        {childId ? 'Edit Child Profile' : 'New Child Profile'}
      </h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label">Child Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            {...register('name')}
            placeholder="Enter child's name"
            disabled={loading || !canEdit}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
            {...register('dob')}
            disabled={loading || !canEdit}
          />
          <div className="invalid-feedback">{errors.dob?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
            {...register('gender')}
            disabled={loading || !canEdit}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <div className="invalid-feedback">{errors.gender?.message}</div>
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/mother/${motherId}`)}
            disabled={loading}
          >
            ← Back to Mother Profile
          </button>

          {canEdit && (
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : childId ? 'Update Profile' : 'Save Profile'}
            </button>
          )}
        </div>

        {!canEdit && (
          <p className="mt-3 text-muted">
            You do not have permission to edit this child profile.
          </p>
        )}
      </form>
    </div>
  );
};

export default ChildProfileForm;
