'use client';

import React, { useState } from 'react';
import { Button, Card, Input, Modal, CTASection } from '@h3ro-dev/ofone-ui';

export default function SharedComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Of One UI Components Demo - Company of One
      </h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="primary" size="small">Small Button</Button>
          <Button variant="primary" size="large">Large Button</Button>
          <Button variant="primary" loading>Loading...</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Card>
            <h3>Default Card</h3>
            <p>This is a basic card with default styling.</p>
          </Card>
          <Card shadow="md" hover>
            <h3>Interactive Card</h3>
            <p>This card has a shadow and hover effect.</p>
          </Card>
          <Card padding="large" style={{ background: '#f0f0f0' }}>
            <h3>Custom Styled Card</h3>
            <p>Cards can be customized with padding and styles.</p>
          </Card>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Inputs</h2>
        <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Basic Input"
            placeholder="Enter some text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="We'll never share your email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={password && password.length < 6 ? "Password must be at least 6 characters" : ""}
          />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Modal</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p>This is an example modal dialog. It can contain any content you need.</p>
          <p style={{ marginTop: '1rem' }}>Perfect for Company of One operations!</p>
        </Modal>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>CTA Section</h2>
        <CTASection
          title="Ready to Start Your Company of One?"
          description="Get AI-powered business guidance tailored for solopreneurs."
          primaryAction={{
            label: "Start Free Trial",
            onClick: () => alert('Starting your Company of One journey!')
          }}
          secondaryAction={{
            label: "Learn More",
            onClick: () => alert('Learn more about Company of One!')
          }}
        />
      </section>
    </div>
  );
}