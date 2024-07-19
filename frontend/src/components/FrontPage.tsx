import { ENV } from '@/util/config'
import Box from '@mui/material/Box'

export const FrontPage = () => {
  return (
    <Box sx={{ fontSize: 20 }}>
      <h1>NOW Database</h1>
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
        Have any questions or suggestions for improvement? Make an in GitHub by clicking &quot;New Issue&quot; (requires
        a GitHub user): <a href="https://github.com/nowcommunity/nowdatabase/issue">GitHub Issues</a>
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
