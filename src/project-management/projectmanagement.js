import { Avatar, Box, Button, Card, CardMedia, CircularProgress, Container, Grid, makeStyles, Typography, withStyles } from '@material-ui/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthContext from '../contexts/auth';
import ResponsiveDialog from '../organisms/ResponsiveDialog';
import ProjectUpdateForm from '../project/ProjectUpdateForm';
import Introduction from './introduction';
import TeamSelect from '../team/TeamSelect';
import { DeleteProject, GetProject, SetProjectTeam } from './projectapi';
import { GetTeam } from '../team/TeamApi';
import { convertResourceUrl, resizeImage } from '../utils';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const DeleteButton = withStyles({
  root: {
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: 14,
      color: 'white',
      padding: '6px 12px',
      border: '1px solid',
      lineHeight: 1.5,
      backgroundColor: 'rgb(220, 0, 78)',
      borderColor: 'rgb(220, 0, 78)',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        backgroundColor: 'rgb(162, 0, 56)',
        borderColor: 'rgb(162, 0, 56)',
        boxShadow: '-0.05em 0.05em 0.2em 0.1em rgba(0, 0, 0, 0.3)',
      },
      '&:active': {
        backgroundColor: 'rgb(162, 0, 56)',
        borderColor: 'rgb(162, 0, 56)',
        boxShadow: '-0.05em 0.05em 0.2em 0.1em rgba(0, 0, 0, 0.3)',
      },
    },
})(Button);

const ProjectManagement = (props) => {
    const classes = useStyles();
    const { projectId } = useParams();
    const [userId] = useContext(AuthContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isProjectUpdatFormOpened, setIsProjectUpdatFormOpened] = useState(false);
    const [isTeamSelectOpened, setIsTeamSelectOpened] = useState(false);
    const [project, setProject] = useState(); // ????????????
    const [team, setTeam] = useState(null);

    const { setType } = props;
    setType('PROJECT');
  const handleUserSelectClose = () => {
      setIsTeamSelectOpened(false);
  };

  const thumbnailInput = useRef(null);
  const onChangeThumbnailInput = async (event) => {
    const [file] = event.target.files;

    const formData = new FormData();
    const data = {
      projectId,
    };
    formData.append(
      'key',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );

    try {
      const tempURL = URL.createObjectURL(file);
      const resizedImage = await resizeImage(file, tempURL);
      formData.append('thumbnail', resizedImage);

      const res = await fetch(`/api/projects/${projectId}/thumbnail`, {
        method: 'PUT',
        body: formData,
      });

      if (res.status >= 200 && res.status < 300) {
        setProject(await (await GetProject(projectId)).json());
      }
    } catch (error) {
      console.log(error);
    }
  };

    useEffect(async () => {
        const projectResponse = await GetProject(projectId);

        if (projectResponse.status === 401) {
            setIsLogin(false);
            return;
        }

        const tempProject = await projectResponse.json();
        setProject(tempProject);
        if (tempProject.team !== null) {
          setTeam(tempProject.team);
        }
        setIsLoaded(true);
    }, []);

    if (!isLogin) {
        window.location.replace('/login');
    }

    if (!isLoaded) {
        return (
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
          >
            <Grid item>
              <CircularProgress />
            </Grid>
            <Grid item>
              <Typography> ???????????? ?????? ???????????? ???????????? ?????????! </Typography>
            </Grid>
          </Grid>
        );
    }

    return (
      <Container maxWidth="md">
        <Grid container style={{ marginBottom: '2em' }}>
          <Grid item xs={9} sm={10}>
            <Typography variant="h6">???????????? ?????? ?????????</Typography>
          </Grid>
          <Grid item style={{ marginTop: '1em', marginBottom: '4em' }}>
            <Card style={{ marginRight: '1rem' }}>
              <CardMedia
                style={{ width: 200, height: 120 }}
                image={convertResourceUrl(project.thumbnail)}
              />
              <Button
                onClick={() => {
                    thumbnailInput.current.click();
                  }}
                fullWidth
              >
                ????????????
              </Button>
              <Box display="none">
                <input
                  type="file"
                  accept="image/*"
                  ref={thumbnailInput}
                  onChange={onChangeThumbnailInput}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item style={{ margin: '1em 0' }} xs={9} sm={10}>
            <Typography variant="h6">???????????? ??????</Typography>
          </Grid>
          <Grid item style={{ margin: '1em 0' }} xs={3} sm={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => { setIsProjectUpdatFormOpened(true); }}
            >??????
            </Button>
            <ResponsiveDialog
              open={isProjectUpdatFormOpened}
              updateOpen={setIsProjectUpdatFormOpened}
            >
              <ProjectUpdateForm updateOpen={setIsProjectUpdatFormOpened} project={project} />
            </ResponsiveDialog>
          </Grid>
          <Grid item style={{ marginBottom: '2em' }}>
            <Introduction
              masterId={project.masterId}
              createTime={project.createTime}
              followerCount={project.followerCount}
              memberCount={project.memberCount}
            />
          </Grid>
        </Grid>
        <Grid container style={{ marginBottom: '4em' }}>
          <Grid container>
            <Grid item style={{ margin: '1em 0' }} xs={9} sm={10}>
              <Typography variant="h6">???????????? ????????? ??????</Typography>
            </Grid>
            <Grid item style={{ margin: '1em 0' }} xs={3} sm={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => { setIsTeamSelectOpened(true); }}
              >??????
              </Button>
              <ResponsiveDialog
                open={isTeamSelectOpened}
                updateOpen={setIsTeamSelectOpened}
              >
                {console.log(team)}
                <TeamSelect
                  userId={userId}
                  updateOpen={setIsProjectUpdatFormOpened}
                  currentTeam={team}
                  setCurrentTeam={setTeam}
                  projectId={projectId}
                  handleClose={handleUserSelectClose}
                />
              </ResponsiveDialog>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {team === null ? (<Grid item>???????????? ???????????? ????????????.</Grid>) : (
              <Grid item sm={6} xs={12}>
                <Card elevation={2}>
                  <Box display="flex" flexDirection="row">
                    <Grid item xs={8}>
                      <Link to={`/teams/${team.id}/project`} style={{ textDecoration: 'none' }}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" noWrap color="textPrimary" style={{ margin: '0.8em' }}>
                            {team.name}
                          </Typography>
                        </Box>
                      </Link>
                    </Grid>
                    <Grid item xs={4} display="flex" alignItems="center" style={{ textAlign: 'right', margin: '0.5em' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={async () => {
                          if (window.confirm('???????????? ?????? ?????? ?????????????????????????')) {
                            const response = await SetProjectTeam(projectId, null);
                            console.log(response);
                            if (response.status === 200) {
                              setTeam(null);
                            }
                          }
                        }}
                      >
                        ??????
                      </Button>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
      )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item style={{ margin: '1em 0' }} xs={9} sm={10}>
            <Typography variant="h6" style={{ color: 'rgb(220, 0, 78)' }}>
              ???????????? ??????
            </Typography>
          </Grid>
          <Grid item style={{ margin: '1em 0' }} xs={3} sm={2}>
            <DeleteButton
              fullWidth
              onClick={async () => {
                    if (window.confirm('???????????? ?????? ????????? ?????? ???????????????. ?????? ????????? ?????????????????????????')) {
                        const { status } = await DeleteProject(projectId);

                        if (status === 401) {
                            setIsLogin(false);
                            return;
                        }

                        if (status === 200) {
                            window.location.replace(`/users/${project.masterId}`);
                        }
                    }
                }}
            >
              ??????
            </DeleteButton>
          </Grid>
        </Grid>
      </Container>
);
};

export default ProjectManagement;
