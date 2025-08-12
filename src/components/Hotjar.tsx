'use client';

import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';

const siteId = 5163749;
const hotjarVersion = 6;

export default function HotjarAnalytics() {
    useEffect(() => {
        // Initialize Hotjar
        Hotjar.init(siteId, hotjarVersion);
    }, []);

    return null; // This component doesn't render anything
}
