"use client";
import { Suspense } from 'react';
import CustomJerseyBuilder from '@/components/CustomJerseyBuilder';
import Container from '@/components/ui/Container';

export default function CustomJerseyPage() {
  return (
    <Container className="py-8 md:py-12">
      <Suspense fallback={<div className="py-20 text-center text-neutral-400">Loading custom jersey builder...</div>}>
        <CustomJerseyBuilder />
      </Suspense>
    </Container>
  );
}
