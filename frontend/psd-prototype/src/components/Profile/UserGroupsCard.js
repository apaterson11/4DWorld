import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import axiosInstance from '../../axios'
import EditGroupsCardModal from './EditGroupsCardModal'

const useStyles = makeStyles({
  root: {
    minWidth: '90%'
  },
  paper: {
    marginTop: '50px',
    marginBottom: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
});

export default function UserGroupsCard({userDetails}) {
  const classes = useStyles();
  const [groups, setGroups] = useState([])
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    axiosInstance.get(`/user-details/${userDetails.user_id}`).then(response => {
        setGroups(response.data.user.groups)
    })
  }, [])

  const handleSubmit = (newGroup) => {
      axiosInstance.post(`/groups/`, {
          name: newGroup.name
      }).then(response => {
        let groupsClone = [...groups]
        groupsClone.push(response.data)
        setGroups(groupsClone)
        setOpen(false)
      })
  }

  const getRows = () => {
    if (groups.length > 0) {
        return groups.map(group => {
            return (
                <TableRow key={group.id}>
                    <TableCell component="th" scope="row">
                        {group.name}
                    </TableCell>
                    <TableCell align="right">{group.user_count} {group.user_count > 1 ? "members" : "member"} </TableCell>
                </TableRow>
            )
        })
    }
    return <Typography>You have no groups yet</Typography>
  }

  return (
    <>
    <EditGroupsCardModal 
        open={open}
        onClose={() => setOpen(false)} 
        onSubmit={handleSubmit} 
    />
    <div className={classes.paper}>
        <Card className={classes.root}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                My Groups
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableBody>
                            {getRows()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions>
            <Button size="small" color="primary" onClick={() => setOpen(true)}>
                Create a new group
            </Button>
            </CardActions>
        </Card>
    </div>
    </>
  );
}
