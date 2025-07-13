import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getAffiliateLink } from '@/data/affiliateLinks';
import { supabase } from '@/integrations/supabase/client';

const Redirect = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [searchParams] = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [error, setError] = useState(false);
  
  const email = searchParams.get('email');

  useEffect(() => {
    const handleRedirect = async () => {
      if (!linkId) {
        setError(true);
        return;
      }

      const affiliateLink = getAffiliateLink(linkId);
      
      if (!affiliateLink) {
        setError(true);
        return;
      }

      try {
        // Track the click
        await supabase
          .from('affiliate_clicks')
          .insert({
            link_id: linkId,
            user_email: email || null
          });

        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to affiliate URL
        window.location.href = affiliateLink.url;
      } catch (error) {
        console.error('Error tracking click:', error);
        // Still redirect even if tracking fails
        window.location.href = affiliateLink.url;
      }
    };

    handleRedirect();
  }, [linkId, email]);

  if (error) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Redirecting...</h2>
        <p className="text-gray-600">Taking you to your selected resource</p>
      </div>
    </div>
  );
};

export default Redirect;