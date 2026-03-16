import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['fs', 'path', 'crypto'],
  
}

export default nextConfig