import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from '@/Footer'
import { AccessibilityStatement } from '@/pages/AccessibilityStatement'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'

describe('legal statement pages', () => {
  it('renders the privacy policy draft and its contact', () => {
    render(<PrivacyPolicy />)

    expect(document.title).toBe('Privacy Policy')
    expect(screen.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeTruthy()
    expect(screen.getByText(/Google Analytics 4 page-view tracking/)).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'kari.lintulaakso@helsinki.fi' }).getAttribute('href') ===
        'mailto:kari.lintulaakso@helsinki.fi'
    ).toBeTruthy()
  })

  it('renders the accessibility statement draft and its contact', () => {
    render(<AccessibilityStatement />)

    expect(document.title).toBe('Accessibility Statement')
    expect(screen.getByRole('heading', { name: 'Accessibility Statement', level: 1 })).toBeTruthy()
    expect(screen.getByText(/WCAG 2.1 Level AA is a target/)).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'kari.lintulaakso@helsinki.fi' }).getAttribute('href') ===
        'mailto:kari.lintulaakso@helsinki.fi'
    ).toBeTruthy()
  })

  it('links to both statements from the footer', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Privacy Policy' }).getAttribute('href') === '/privacy-policy').toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Accessibility Statement' }).getAttribute('href') === '/accessibility-statement'
    ).toBeTruthy()
  })
})
