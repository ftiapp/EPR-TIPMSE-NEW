import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Ensure Next.js uses this folder as the workspace root
    root: __dirname,
  },
  env: {
    MYSQL_HOST: 'asia-southeast1-001.proxy.kinsta.app',
    MYSQL_PORT: '30509',
    MYSQL_USER: 'FTI_IT_ADMIN',
    MYSQL_PASSWORD: 'qZ1[sJ4*qG2*jW1:',
    MYSQL_DATABASE: 'FTI_annaul_meeting',
    MAILERSEND_API_KEY: 'mlsn.066f0b449e1e2228390af429d55c6ca24609ec72e2eb314762a635094a5ba4dd'
  },
};

export default nextConfig;
