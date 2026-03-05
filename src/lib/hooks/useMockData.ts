"use client";

import { useState, useEffect } from 'react';
import ordersFallback from '@/data/orders.json';
import licensesFallback from '@/data/licenses.json';
import { Order, License } from '@/lib/types';

export function useMockData() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Orders
        const storedOrders = localStorage.getItem('mock_orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            setOrders(ordersFallback as Order[]);
        }

        // Licenses
        const storedLicenses = localStorage.getItem('mock_licenses');
        if (storedLicenses) {
            setLicenses(JSON.parse(storedLicenses));
        } else {
            setLicenses(licensesFallback as License[]);
        }

        setIsLoaded(true);
    }, []);

    return { orders, licenses, isLoaded };
}
