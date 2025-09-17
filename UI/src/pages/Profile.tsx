import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockProperties } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'viewed'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Mock data for saved and viewed properties
  const savedProperties = mockProperties.slice(0, 3);
  const viewedProperties = mockProperties.slice(2, 5);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={user?.avatar || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="avatar-image"
            />
            <div className="avatar-overlay">
              <span>📷</span>
            </div>
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{savedProperties.length}</span>
                <span className="stat-label">Saved Properties</span>
              </div>
              <div className="stat">
                <span className="stat-number">{viewedProperties.length}</span>
                <span className="stat-label">Recently Viewed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Properties
          </button>
          <button 
            className={`tab ${activeTab === 'viewed' ? 'active' : ''}`}
            onClick={() => setActiveTab('viewed')}
          >
            Recently Viewed
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-tab-content">
              <div className="tab-header">
                <h2>Profile Information</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn btn-outline">
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button onClick={handleSave} className="btn">
                      Save Changes
                    </button>
                    <button onClick={handleCancel} className="btn btn-outline">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="account-actions">
                <h3>Account Actions</h3>
                <div className="action-buttons">
                  <button className="btn btn-secondary">
                    Change Password
                  </button>
                  <button className="btn btn-secondary">
                    Notification Settings
                  </button>
                  <button onClick={logout} className="btn btn-outline">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="profile-tab-content">
              <div className="tab-header">
                <h2>Saved Properties</h2>
                <p>Properties you've saved for later viewing</p>
              </div>

              {savedProperties.length > 0 ? (
                <div className="properties-grid">
                  {savedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">💾</div>
                  <h3>No saved properties</h3>
                  <p>Start saving properties you're interested in to see them here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'viewed' && (
            <div className="profile-tab-content">
              <div className="tab-header">
                <h2>Recently Viewed</h2>
                <p>Properties you've recently viewed</p>
              </div>

              {viewedProperties.length > 0 ? (
                <div className="properties-grid">
                  {viewedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">👁️</div>
                  <h3>No recently viewed properties</h3>
                  <p>Start browsing properties to see your viewing history here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
