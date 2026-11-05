import { Alert, Box, Divider, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'

export const AccessibilityStatement = () => {
  useEffect(() => {
    document.title = 'Accessibility Statement'
  }, [])

  return (
    <Box sx={{ padding: 3 }}>
      <Stack gap={2} sx={{ maxWidth: '50em', margin: '0 auto' }}>
        <Typography variant="h4" component="h1">
          Accessibility Statement
        </Typography>
        <Alert severity="warning">
          Draft for review. The accessibility status and marked details have not yet been verified.
        </Alert>
        <Typography>
          We aim to make The NOW Database usable by as many people as possible, including people who use assistive
          technologies.
        </Typography>

        <Divider />
        <Typography variant="h6" component="h2">
          Accessibility status
        </Typography>
        <Typography>
          The service has not yet been assessed for conformance. WCAG 2.1 Level AA is a target, not a statement that the
          service currently conforms.
        </Typography>

        <Typography variant="h6" component="h2">
          Accessibility features and limitations
        </Typography>
        <Typography>
          A limited source-code review (not a conformance assessment) found semantic headings on this page, a labeled
          navigation landmark in the footer, and labels associated with username and password fields in the
          user-management form. Keyboard navigation, screen-reader behavior, color contrast, and responsive behavior
          have not been comprehensively assessed.
        </Typography>
        <Typography>
          The same review found potential barriers that need testing: the navigation logo image has no alternative text
          in the source, and the password visibility and password-generation buttons have no explicit accessible names.
          Other barriers may exist.
        </Typography>

        <Typography variant="h6" component="h2">
          Preparing this statement
        </Typography>
        <Typography>
          This draft is based on a limited source-code review; a full manual or automated accessibility assessment has
          not been completed. [TODO: Add the assessment method and date when an assessment is performed (for example:
          “Reviewed with [tool] and keyboard testing on [date].”).]
        </Typography>

        <Typography variant="h6" component="h2">
          Feedback and contact
        </Typography>
        <Typography>
          If you encounter an accessibility barrier, contact us at{' '}
          <a href="mailto:kari.lintulaakso@helsinki.fi">kari.lintulaakso@helsinki.fi</a>. [TODO: Confirm the contact and
          add an expected response time only if one is approved (for example: “We aim to respond within [number]
          business days.”).]
        </Typography>

        <Typography variant="h6" component="h2">
          Enforcement procedure
        </Typography>
        <Typography>
          [TODO: Confirm and provide the applicable accessibility enforcement procedure and authority contact details
          (for example: “[Authority name] — [contact details or link to the complaint procedure].”).]
        </Typography>

        <Typography variant="h6" component="h2">
          Last updated
        </Typography>
        <Typography>
          [TODO: Add the date this statement is approved or updated (for example: “Last updated: [DD Month YYYY].”).]
        </Typography>
      </Stack>
    </Box>
  )
}
