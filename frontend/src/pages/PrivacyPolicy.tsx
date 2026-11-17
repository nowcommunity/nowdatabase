import { Alert, Box, Divider, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'

export const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy'
  }, [])

  return (
    <Box sx={{ padding: 3 }}>
      <Stack gap={2} sx={{ maxWidth: '50em', margin: '0 auto' }}>
        <Typography variant="h4" component="h1">
          Privacy Policy
        </Typography>
        <Alert severity="warning">
          Draft for review. Complete the marked items and verify the processing details before publication.
        </Alert>
        <Typography>
          This policy describes personal data processed in connection with The NOW Database, including registered-user
          accounts and any optional site analytics described below.
        </Typography>

        <Divider />
        <Typography variant="h6" component="h2">
          Controller and contact
        </Typography>
        <Typography>
          Controller: University of Helsinki, Finnish Museum of Natural History. Business ID: 0313471-7. Address:
          Finnish Museum of Natural History, P.O. Box 17 (Pohjoinen Rautatiekatu 13), FI-00014 University of Helsinki.
        </Typography>
        <Typography>
          Privacy contact: Kari Lintulaakso, Collection Coordinator. Email:{' '}
          <a href="mailto:kari.lintulaakso@helsinki.fi">kari.lintulaakso@helsinki.fi</a>.
        </Typography>

        <Typography variant="h6" component="h2">
          Data and purposes
        </Typography>
        <Typography>
          Personal data is processed to manage registered-user accounts and authenticate users; administer person
          records, project contacts and memberships, and coordinator assignments; determine project access for some
          users; and maintain a history of database changes for accountability. Person records include initials, first
          name, surname, full name, email, organization, and country. User account records include a username,
          last-login date, and user-group assignment. Change history can include the acting user, date, affected data,
          and old and new values. The account-creation service hashes newly set passwords.
        </Typography>
        <Typography>
          Application response logs record the response status, request method and URL, response time, and, for
          authenticated requests, the username. The application logging code does not explicitly record client IP
          addresses or user-agent strings. [TODO: Confirm with the service operator whether the hosting provider,
          reverse proxy, or other infrastructure logs IP addresses or other request data, and document the data and
          retention period if so (for example: “The hosting provider records IP addresses and retains them for
          [period].”).]
        </Typography>
        <Typography>
          The frontend also contains optional Google Analytics 4 page-view tracking outside development environments
          when a measurement ID is configured. It sends the current page path and query string, honors Do Not Track, and
          configures IP anonymization. Confirm whether analytics is enabled in deployed environments and, if so,
          document its data, purpose, legal basis, and applicable settings before publication (for example: “GA4 is
          enabled in production to collect page views, including the page path and query string, for [purpose] under
          [legal basis].”).
        </Typography>

        <Typography variant="h6" component="h2">
          Legal basis and retention
        </Typography>
        <Typography>
          [TODO: Confirm and describe the legal basis for each processing purpose and the applicable data retention
          periods (for example: “Account administration is processed under [legal basis]; inactive accounts are deleted
          after [period], and logs are retained for [period].”). Example questions, not confirmed retention rules: when
          is an inactive or closed account removed, and how long are last-login information and backups retained? The
          services inspected show person/account deletion can be initiated but may be blocked by linked history or
          roles; no automatic retention schedule was found in those services.]
        </Typography>

        <Typography variant="h6" component="h2">
          Recipients and international transfers
        </Typography>
        <Typography>
          [TODO: Identify hosting, authentication, analytics, and other service providers that can access personal data,
          and describe any transfers outside the EU/EEA and their safeguards (for example: “The service is hosted by
          [provider] in [location]; data transferred to [country] is protected by [safeguard].”). Examples to
          investigate include the institution&apos;s hosting provider and Google Analytics if enabled; neither is a
          complete or confirmed provider list.]
        </Typography>

        <Typography variant="h6" component="h2">
          Security
        </Typography>
        <Typography>
          [TODO: Describe safeguards actually used (for example: “Connections use TLS, access is limited by role, and
          backups are encrypted.” Include only controls that are verified). Examples to verify include encrypted
          connections, access controls, backups, and access monitoring. The account-creation code hashes newly set
          passwords; confirm how existing credentials and other systems are protected (for example: state the password
          hashing method and which roles can access production data).]
        </Typography>

        <Typography variant="h6" component="h2">
          Your rights
        </Typography>
        <Typography>
          Depending on the circumstances and applicable law, you may have the right to request access to, correction or
          deletion of your personal data, restriction of processing, data portability, or to object to processing.
          Contact the controller to make a request. [TODO: Confirm the applicable rights, any limitations, and the
          supervisory authority contact details (for example: “You may complain to [authority name] at [contact or
          link].”).]
        </Typography>

        <Typography variant="h6" component="h2">
          Changes and effective date
        </Typography>
        <Typography>
          This policy may be updated when the service or its data processing changes. [TODO: Add the effective date and
          a process for notifying users of material changes (for example: “Effective [date]; material changes will be
          announced via [channel].”).]
        </Typography>
      </Stack>
    </Box>
  )
}
