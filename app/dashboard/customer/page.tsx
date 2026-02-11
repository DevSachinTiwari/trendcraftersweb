'use client';

import { useAuthStore } from '../../../lib/auth-store';
import { ProfileImageUpload } from '../../../components/profile/profile-image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ShoppingBag, Heart, MapPin, CreditCard, Settings, Phone, Shield, Edit2 } from 'lucide-react';
import AuthGuard from '../../../components/auth-guard';

export default function CustomerDashboard() {
  const { user } = useAuthStore();

  return (
    <AuthGuard allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Customer Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name || 'Customer'}!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Profile Image Upload */}
                <ProfileImageUpload size="lg" />
              
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Your account details</CardDescription>
                    </div>
                    <button 
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        // TODO: Implement profile editing
                        alert('Profile editing feature coming soon!');
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Account Status Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Account Status:</span>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          user?.emailVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user?.emailVerified ? '✓ Email Verified' : '⚠ Email Pending'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          user?.mobile 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user?.mobile ? '✓ Mobile Added' : '+ Add Mobile'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{user?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>Mobile Number</span>
                    </label>
                    <p className={`text-gray-900 ${!user?.mobile ? 'text-gray-400 italic' : ''}`}>
                      {user?.mobile || 'Not set - Add your mobile number for security'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>Email Verification</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                      </span>
                      {!user?.emailVerified && (
                        <button 
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                          onClick={() => {
                            // TODO: Implement email verification
                            alert('Email verification feature coming soon!');
                          }}
                        >
                          Send Verification
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="text-gray-900 capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orders Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                    <span>My Orders</span>
                  </CardTitle>
                  <CardDescription>Track your orders and purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-gray-500">No orders yet</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                      Start Shopping →
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Wishlist Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Wishlist</span>
                  </CardTitle>
                  <CardDescription>Your saved items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-gray-500">No items saved</p>
                    <button className="text-red-500 hover:text-red-600 text-sm mt-2">
                      Browse Products →
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Address Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>Addresses</span>
                  </CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-gray-500">No addresses added</p>
                    <button className="text-green-600 hover:text-green-700 text-sm mt-2">
                      Add Address →
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span>Payment Methods</span>
                  </CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-gray-500">No payment methods</p>
                    <button className="text-purple-600 hover:text-purple-700 text-sm mt-2">
                      Add Method →
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors">
                    <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <span className="text-sm text-gray-700">Shop Now</span>
                  </button>
                  <button className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <span className="text-sm text-gray-700">Wishlist</span>
                  </button>
                  <button className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <span className="text-sm text-gray-700">Addresses</span>
                  </button>
                  <button className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors">
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <span className="text-sm text-gray-700">Payment</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}