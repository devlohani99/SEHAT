import React, { useState } from 'react';
import { useAuthStore } from '../store/auth.store';

const Profile = () => {
  const { user, updateProfile, loading, error } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button
                className="text-red-700 hover:text-red-900"
                onClick={() => updateProfile({ error: null })}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-12 items-start max-w-7xl mx-auto">
          {/* Left Side - Profile Information */}
          <div className="w-full md:w-3/5">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-semibold text-gray-800">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 text-base font-medium text-green-600 hover:text-green-500"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-base font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-3 text-base border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 text-base bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-300"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <dl className="space-y-8">
                    <div>
                      <dt className="text-base font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-2 text-xl text-gray-900">{user?.name || 'Not provided'}</dd>
                    </div>

                    <div>
                      <dt className="text-base font-medium text-gray-500">Email Address</dt>
                      <dd className="mt-2 text-xl text-gray-900">{user?.email || 'Not provided'}</dd>
                    </div>

                    <div>
                      <dt className="text-base font-medium text-gray-500">Phone Number</dt>
                      <dd className="mt-2 text-xl text-gray-900">{user?.phone || 'Not provided'}</dd>
                    </div>

                    <div>
                      <dt className="text-base font-medium text-gray-500">Address</dt>
                      <dd className="mt-2 text-xl text-gray-900">{user?.address || 'Not provided'}</dd>
                    </div>
                  </dl>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="w-full md:w-2/5">
            <div className="h-full flex items-center justify-center">
              <img
                src="https://img.freepik.com/free-vector/boy-with-smartphone-social-profile-commnication_24877-53919.jpg"
                alt="Profile Illustration"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;