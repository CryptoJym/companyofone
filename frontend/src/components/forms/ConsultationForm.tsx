'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { apiClient, ConsultationFormData } from '@/lib/api';

interface ConsultationFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const ConsultationForm = ({
  onSuccess,
  onError,
  className,
}: ConsultationFormProps) => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: '',
    email: '',
    businessType: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await apiClient.submitConsultationForm(formData);
      
      if (response.success) {
        setSuccessMessage('Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          businessType: '',
          message: '',
        });
        onSuccess?.();
      } else {
        if (response.errors) {
          const errorMap: Record<string, string> = {};
          response.errors.forEach(error => {
            if (error.field) {
              errorMap[error.field] = error.msg;
            }
          });
          setErrors(errorMap);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors({ general: errorMessage });
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Request Submitted!</h3>
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn('space-y-6 max-w-md mx-auto', className)}
    >
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div>
        <label htmlFor="consultation-name" className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="consultation-name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.name && 'border-red-300 focus:ring-red-500 focus:border-red-500'
          )}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="consultation-email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="consultation-email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.email && 'border-red-300 focus:ring-red-500 focus:border-red-500'
          )}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="consultation-businessType" className="block text-sm font-medium text-gray-700 mb-2">
          Business Type *
        </label>
        <select
          id="consultation-businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleInputChange}
          required
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.businessType && 'border-red-300 focus:ring-red-500 focus:border-red-500'
          )}
        >
          <option value="">Select your business type</option>
          <option value="solopreneur">Solopreneur</option>
          <option value="freelancer">Freelancer</option>
          <option value="consultant">Consultant</option>
          <option value="small-business">Small Business</option>
          <option value="other">Other</option>
        </select>
        {errors.businessType && <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>}
      </div>

      <div>
        <label htmlFor="consultation-message" className="block text-sm font-medium text-gray-700 mb-2">
          Tell us about your business goals *
        </label>
        <textarea
          id="consultation-message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.message && 'border-red-300 focus:ring-red-500 focus:border-red-500'
          )}
          placeholder="What challenges are you facing? What are your goals for the next 6-12 months?"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Submitting Request...' : 'Get My Free Consultation'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to receive communication from Company of One.
      </p>
    </form>
  );
};