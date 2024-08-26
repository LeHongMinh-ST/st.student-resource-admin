import { useRouter } from 'next/router';

export default function useMatchPath(basePath: string = ''): boolean {
  const router = useRouter();
  const matchPath = (pathname: string, basePath: string): boolean => {
    if (!basePath) return false;

    const cleanPathname = pathname.split('?')[0];
    const regex = new RegExp(`^${basePath}(\\/.*)?$`);
    return regex.test(cleanPathname);
  };

  return matchPath(router.pathname, basePath);
}
