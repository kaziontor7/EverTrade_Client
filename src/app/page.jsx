"use client";

import React, { useEffect, useState } from 'react';
import { Button, Spinner, Card, CardBody } from '@heroui/react';

export default function Home() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setHealthData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-on-surface px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary-container dark:text-on-primary-container">
          EverTrade Project Setup
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Incremental build milestone 1: Client and server basic connectivity check.
        </p>

        <Card className="bg-surface border border-outline/10 shadow-lg">
          <CardBody className="p-6 flex flex-col items-center gap-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              API Server Status
            </span>

            {loading && (
              <div className="flex items-center gap-2">
                <Spinner size="sm" color="success" />
                <span className="text-sm text-on-surface-variant">Verifying connection...</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-xl">error</span>
                <span className="text-sm font-semibold">Server Offline</span>
              </div>
            )}

            {!loading && healthData && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-success">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-sm font-bold">Connected Successfully</span>
                </div>
                <div className="text-xs text-on-surface-variant bg-surface-container p-3 rounded-lg text-left">
                  <div><strong>Status:</strong> {healthData.status}</div>
                  <div><strong>Message:</strong> {healthData.message}</div>
                  <div><strong>Timestamp:</strong> {new Date(healthData.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <div className="flex justify-center gap-4">
          <Button 
            className="bg-primary text-on-primary font-semibold px-6 py-2 rounded-xl"
            onPress={() => window.location.reload()}
          >
            Retry Check
          </Button>
        </div>
      </div>
    </div>
  );
}
