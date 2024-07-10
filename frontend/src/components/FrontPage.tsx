import { ENV } from '@/util/config'
import Box from '@mui/material/Box'

export const FrontPage = () => {
  return (
    <Box>
      <h1>NOW Database</h1>
      <p>Site under construction.</p>
      {ENV !== 'prod' && (
        <p>
          <b>This version is running on test data. May contain incorrect and outdated information.</b>
        </p>
      )}
      <p>
        Project repository:{' '}
        <a href="https://github.com/nowcommunity/nowdatabase">https://github.com/nowcommunity/nowdatabase</a>
      </p>
      <p>
        Have any questions or suggestions for improvement? Make an issue by logging into GitHub and clicking the
        &quot;New Issue&quot; -button on this page:{' '}
        <a href="https://github.com/nowcommunity/nowdatabase/issue">GitHub Issues</a>
      </p>
      <p>
        The old application: <a href="https://nowdatabase.luomus.fi/">https://nowdatabase.luomus.fi/</a>
      </p>
      <p>
        Information about the database and NOW community:{' '}
        <a href="https://nowdatabase.org/">https://nowdatabase.org/</a>
      </p>
    </Box>
  )
}
