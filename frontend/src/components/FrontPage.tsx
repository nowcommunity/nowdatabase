import { ENV } from '@/util/config'
import { Divider } from '@mui/material'
import Box from '@mui/material/Box'

export const FrontPage = () => {
  if (ENV === 'dev') {
    document.title = 'NOW Database (dev)'
  } else {
    document.title = 'NOW Database'
  }
  return (
    <Box sx={{ fontSize: 20, maxWidth: '40em' }}>
      <h1>Welcome</h1>
      {ENV !== 'prod' && (
        <p>
          <b style={{ backgroundColor: 'orange' }}>
            This version is running on test data. May contain incorrect and outdated information.
          </b>
        </p>
      )}
      <p>
        This is a new version of the NOW (New And Old Worlds) Fossil Mammal Database. It displays tables and details of
        localities, species, time units and references.
      </p>
      <p>
        <b>To navigate this application, use the bar at the top of the website.</b> Click on the links there to view
        different data tables, such as localities or species. Then, to view details of an individual item, click the
        magnifying glass icon on the left side of the row.
      </p>
      <p>
        To log in, click the Login-link at the top-right corner of the screen. A logged in user will see more links in
        the navigation bar, depending on their user rights, as well as the User-link that will take the user to their
        own user-page, where you can view your own information and change your password.
      </p>
      <p style={{ fontSize: 26 }}>
        <b>
          <a href="https://forms.gle/Aj392QWov5QXBJfo7">Click here to provide feedback!</a>
        </b>
      </p>
      <Divider />
      <h2>External links</h2>
      <ul>
        <li>
          Information about the database and NOW community:{' '}
          <a href="https://nowdatabase.org/">https://nowdatabase.org/</a>
        </li>
        <li>
          The old application: <a href="https://nowdatabase.luomus.fi/">https://nowdatabase.luomus.fi/</a>
        </li>
        <li>
          Code repository of the project:{' '}
          <a href="https://github.com/nowcommunity/nowdatabase">https://github.com/nowcommunity/nowdatabase</a>
        </li>
      </ul>
    </Box>
  )
}
