import { usePathname, useRouter } from 'next/navigation'; 
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const useAuthRedirect = () => {
  const { isLoggedIn, isAuthLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();  

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      
      router.push(`/login?route=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthLoaded, isLoggedIn, pathname, router]);
};

export default useAuthRedirect;